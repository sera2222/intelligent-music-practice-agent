from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

from datetime import date, datetime

class PracticeLogBase(BaseModel):
    title: str
    duration: int
    tempo: int
    difficult_part: str
    memo: str
    practice_date: date

class PracticeLogCreate(PracticeLogBase):
    pass

class PracticeLogUpdate(PracticeLogBase):
    pass

class PracticeLogOut(PracticeLogBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

from typing import List

class DateListRequest(BaseModel):
    dates: List[date]

class ChatMessage(BaseModel):
    sender: str
    message: str
    timestamp: datetime

class PracticeChatThreadCreate(BaseModel):
    practice_log_id: int
    messages: List[ChatMessage]

class PracticeChatThreadOut(BaseModel):
    practice_log_id: int
    messages: List[ChatMessage]

    class Config:
        from_attributes = True

class WeeklyGoalOut(BaseModel):
    week_start: date
    songs_to_practice: List[dict]
    summary: str
    full: str
    total_practice_time: int

    class Config:
        from_attributes = True

class WeeklyGoalRequest(BaseModel):
    week_start: date