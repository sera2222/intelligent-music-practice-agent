from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import database, models, schemas, auth
from datetime import date, timedelta, datetime, timezone
from sqlalchemy import select
from .models import PracticeChatThread

router = APIRouter()

from .auth import get_db
get_current_user = auth.get_current_user

from .llm.call_llm import summarize_logs, generate_feedback  # LLM 호출 함수 (OpenAI, Anthropic 등)

import httpx

async def fetch_vector_search(summary: str, instrument: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "http://localhost:8000/vector/search",  # 실제 서버 주소
            params={"query": summary, "instrument": instrument}
        )
        response.raise_for_status()
        return response.json()

async def fetch_incontext_example(summary: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "http://localhost:8000/vector/incontext",
            params={"query": summary}
        )
        response.raise_for_status()
        return response.json()


@router.post("/practice/logs", response_model=schemas.PracticeLogOut)
async def create_log(
    log: schemas.PracticeLogCreate, db: Session = Depends(get_db), user=Depends(get_current_user)
    ):
    # 1) 새로운 연습 기록 저장
    new_log = models.PracticeLog(**log.dict(), user_id=user.id)
    db.add(new_log)
    db.commit()
    db.refresh(new_log)

    # 2) 최근 3개의 연습 기록, 이번주 목표 가져오기
    past_logs = (
        db.query(models.PracticeLog)
          .filter(
              models.PracticeLog.user_id == user.id,
              models.PracticeLog.title == log.title  # "title" 기준으로 필터링 추가
          )
          .order_by(models.PracticeLog.practice_date.desc())
          .limit(3)
          .all()
    )
    weekly_goal = (
        db.query(models.WeeklyGoal)
          .filter(
              models.WeeklyGoal.user_id == user.id,
              models.WeeklyGoal.week_start <= log.practice_date,
              models.WeeklyGoal.week_start + timedelta(days=6) >= log.practice_date
          )
          .first()
    )

    # 3) 요약 생성
    summary = summarize_logs(past_logs, weekly_goal.full if weekly_goal else "")

    # 4) 연습 리소스 + incontext example 검색
    vector_results = await fetch_vector_search(summary, "piano")
    incontext_result = await fetch_incontext_example(summary)

    # 5) LLM 피드백 생성
    feedback = generate_feedback(weekly_goal, log, summary, vector_results, incontext_result)

    feedback_dict = {
        "sender": "agent",
        "message": feedback,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    chat_thread = PracticeChatThread(
        user_id=user.id,
        practice_log_id=new_log.id,
        messages_json=[feedback_dict]
    )
    db.add(chat_thread)
    db.commit()

    return new_log

@router.get("/practice/logs/date/{practice_date}", response_model=list[schemas.PracticeLogOut])
def get_logs_by_date(
    practice_date: date,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    logs = db.query(models.PracticeLog).filter_by(
        user_id=user.id,
        practice_date=practice_date
    ).all()
    return logs

@router.post("/practice/logs/exists")
def logs_exist_for_dates(
    request: schemas.DateListRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    dates = request.dates

    # 쿼리: 내 연습일 중, 요청한 날짜들만 필터링
    logs = db.query(models.PracticeLog.practice_date).filter(
        models.PracticeLog.user_id == user.id,
        models.PracticeLog.practice_date.in_(dates)
    ).all()

    existing_dates = {log.practice_date for log in logs}

    # 날짜 리스트 기반 결과 매핑
    result = {str(d): (d in existing_dates) for d in dates}
    return result

@router.get("/practice/logs/titles", response_model=list[str])
def get_recent_titles(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    six_months_ago = date.today() - timedelta(days=30 * 6)
    
    # SQLAlchemy select for performance
    results = db.query(models.PracticeLog.title).filter(
        models.PracticeLog.user_id == user.id,
        models.PracticeLog.practice_date >= six_months_ago
    ).distinct().all()

    # 결과는 [("곡1",), ("곡2",)...] 형태 → 문자열 리스트로 변환
    return [row[0] for row in results]

@router.get("/practice/logs", response_model=list[schemas.PracticeLogOut])
def get_logs(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(models.PracticeLog).filter_by(user_id=user.id).all()

@router.put("/practice/logs/{log_id}", response_model=schemas.PracticeLogOut)
def update_log(log_id: int, updated: schemas.PracticeLogUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    log = db.query(models.PracticeLog).filter_by(id=log_id, user_id=user.id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    for key, value in updated.dict().items():
        setattr(log, key, value)
    db.commit()
    return log

@router.delete("/practice/logs/{log_id}")
def delete_log(log_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    log = db.query(models.PracticeLog).filter_by(id=log_id, user_id=user.id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    db.delete(log)
    db.commit()
    return {"message": "Deleted"}

@router.post("/practice/goals/week", response_model=schemas.WeeklyGoalOut)
def get_weekly_goal(
    request: schemas.WeeklyGoalRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    goal = (
        db.query(models.WeeklyGoal)
        .filter_by(user_id=user.id, week_start=request.week_start)
        .first()
    )
    if not goal:
        raise HTTPException(status_code=404, detail="Weekly goal not found")

    return goal
