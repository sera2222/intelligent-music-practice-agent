from .database import Base

from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    # weekly_start_day = Column(Integer, default=0)

class PracticeLog(Base):
    __tablename__ = "practice_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(255))
    duration = Column(Integer)  # 연습 시간 (분 단위)
    tempo = Column(Integer)     # 평균 템포
    difficult_part = Column(String(1000))
    memo = Column(String(2000))
    practice_date = Column(Date)
    created_at = Column(DateTime, default=datetime.now(ZoneInfo("Asia/Seoul")))
    updated_at = Column(DateTime, default=datetime.now(ZoneInfo("Asia/Seoul")), onupdate=datetime.now(ZoneInfo("Asia/Seoul")))

    user = relationship("User", backref="practice_logs")

class PracticeChatThread(Base):
    __tablename__ = "practice_chat_threads"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    practice_log_id = Column(Integer, ForeignKey("practice_logs.id"), unique=True)
    messages_json = Column(JSON)  # list of messages
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class WeeklyGoal(Base):
    __tablename__ = "weekly_goals"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    week_start = Column(Date, nullable=False)
    songs_to_practice = Column(JSON, nullable=True)  # List of songs with details

    # Example structure for songs_to_practice:
    # [
    #     {
    #         "song_name": "Song Title",
    #         "target_tempo": 120,
    #         "focus_skills": ["skill1", "skill2"],
    #         "additional_notes": "Some notes about the song"
    #     },
    #     ...
    # ]
    total_practice_time = Column(Integer, default=0)
    is_acheived = Column(Integer, default=0)
    summary = Column(String(500))
    full = Column(String(2000))
    created_at = Column(DateTime, default=datetime.now(ZoneInfo("Asia/Seoul")))
    updated_at = Column(DateTime, default=datetime.now(ZoneInfo("Asia/Seoul")), onupdate=datetime.now(ZoneInfo("Asia/Seoul")))