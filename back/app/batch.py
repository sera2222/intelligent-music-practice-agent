from datetime import date, timedelta, datetime
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import PracticeLog, WeeklyGoal, User
from zoneinfo import ZoneInfo

def get_week_range(today: date, start_day: int) -> tuple[date, date]:
    """
    사용자 설정 시작 요일 기준으로 '이번 주' 시작일, 종료일 반환
    start_day: 0=Mon, …, 6=Sun
    """
    weekday_today = today.weekday()  # 0=Mon … 6=Sun
    # (오늘 요일 – 시작 요일) 만큼 뒤로 가면 이번 주 첫째 날
    days_since_start = (weekday_today - start_day + 7) % 7
    week_start = today - timedelta(days=days_since_start)
    week_end   = week_start + timedelta(days=6)
    return week_start, week_end

def generate_weekly_goals():
    db: Session = SessionLocal()
    today     = date.today()
    month_ago = today - timedelta(days=30)

    try:
        # 1) 지난 한 달간 연습 기록이 있는 사용자 ID 목록
        rows     = (
            db.query(PracticeLog.user_id)
              .filter(PracticeLog.practice_date >= month_ago)
              .distinct()
              .all()
        )
        user_ids = [r[0] for r in rows]

        for user_id in user_ids:
            user = db.query(User).get(user_id)
            if not user:
                continue

            # 2) 이번 주 범위 계산
            # start_day = getattr(user, "weekly_start_day", 0)
            start_day = getattr(user, "mon", 0)
            week_start, _ = get_week_range(today, start_day)

            # 3) 지난 한 달에 동일 주차 목표 생성 여부 확인
            exists = (
                db.query(WeeklyGoal)
                  .filter_by(user_id=user_id)
                  .filter(WeeklyGoal.created_at >= month_ago)
                  .first()
            )
            if exists:
                continue

            # 4) 지난 한 달간의 연습 로그 조회
            logs = (
                db.query(PracticeLog)
                  .filter_by(user_id=user_id)
                  .filter(PracticeLog.practice_date.between(month_ago, today))
                  .all()
            )
            if not logs:
                continue

            # 5) 집계 및 songs_to_practice 구성
            total_duration = sum(log.duration for log in logs)
            songs = [
                {
                    "song_name":          log.title,
                    "target_tempo":       log.tempo,
                    "focus_skills":       [log.difficult_part],
                    "additional_notes":   log.memo
                }
                for log in logs
            ]

            # 6) summary / full text
            summary   = f"지난 한 달간 {len(songs)}곡을 연습, 총 {total_duration}분 연습했습니다."
            full_text = "\n".join(
                f"- {s['song_name']} (목표 템포 {s['target_tempo']}): "
                f"{', '.join(s['focus_skills'])}"
                for s in songs
            )

            # 7) WeeklyGoal 생성
            new_goal = WeeklyGoal(
                user_id             = user_id,
                week_start          = week_start,
                songs_to_practice   = songs,
                total_practice_time = total_duration,
                is_acheived         = 0,
                summary             = summary,
                full                = full_text,
                created_at          = datetime.now(ZoneInfo("Asia/Seoul")),
                updated_at          = datetime.now(ZoneInfo("Asia/Seoul")),
            )
            db.add(new_goal)

        db.commit()
        print(f"## {len(user_ids)}명의 주간 목표 생성 완료")

    except Exception as e:
        db.rollback()
        print("## 배치 오류:", e)
    finally:
        db.close()
