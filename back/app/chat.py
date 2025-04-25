from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .llm.call_llm import generate_next_message
from . import database, models, schemas, auth
from datetime import date, timedelta, datetime
from sqlalchemy import select
from zoneinfo import ZoneInfo

router = APIRouter()

from .auth import get_db
get_current_user = auth.get_current_user

def serialize_msg(msg):
    d = msg.model_dump()
    if isinstance(d["timestamp"], (datetime, date)):
        d["timestamp"] = d["timestamp"].isoformat()
    return d

@router.post("/chat-thread", response_model=schemas.PracticeChatThreadOut)
async def create_chat_thread(
    chat: schemas.PracticeChatThreadCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    print("Creating chat thread...")
    # 1) 연습 로그 확인
    log = db.query(models.PracticeLog).filter_by(
        id=chat.practice_log_id, user_id=user.id
    ).first()
    if not log:
        raise HTTPException(status_code=404, detail="Practice log not found")

    # 2) 기존 스레드 조회
    thread = db.query(models.PracticeChatThread).filter_by(
        practice_log_id=chat.practice_log_id,
        user_id=user.id
    ).first()

    # 3) 메시지 직렬화
    new_messages = [serialize_msg(msg) for msg in chat.messages]

    if thread is None:
        # - 스레드가 없으면 새로 생성
        thread = models.PracticeChatThread(
            user_id=user.id,
            practice_log_id=chat.practice_log_id,
            messages_json=new_messages
        )
        db.add(thread)

        db.commit()
    else:
        # - 스레드가 있으면 메시지만 합치기
        thread.messages_json.extend(new_messages)
        thread.updated_at = datetime.now(ZoneInfo("Asia/Seoul"))

        db.commit()     # 사용자 메시지 등록

        # 4) 전체 히스토리 기반으로 에이전트 메시지 생성
        #    generate_next_message은 List[dict] 형태의 messages를 받고, 텍스트를 리턴한다고 가정
        agent_text = await generate_next_message(thread.messages_json) 
        agent_msg = {
            "sender": "agent",
            "message": agent_text,
            "timestamp": datetime.now(ZoneInfo("Asia/Seoul")).isoformat()
        }
        print("Agent message:", agent_text)
        thread.messages_json.append(agent_msg)
        thread.updated_at = datetime.now(ZoneInfo("Asia/Seoul"))

        db.commit()  # 에이전트 메시지 저장


    # 반환 시점에는 항상 thread.messages_json을 리턴
    return {
        "practice_log_id": thread.practice_log_id,
        "messages": thread.messages_json
    }

@router.get("/chat-thread/{practice_log_id}", response_model=schemas.PracticeChatThreadOut)
def get_chat_thread(practice_log_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    thread = db.query(models.PracticeChatThread).filter_by(
        user_id=user.id, practice_log_id=practice_log_id
    ).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Chat thread not found")
    return {
        "practice_log_id": thread.practice_log_id,
        "messages": thread.messages_json
    }
