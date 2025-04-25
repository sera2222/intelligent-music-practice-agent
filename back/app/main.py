from contextlib import asynccontextmanager
from fastapi import FastAPI
from . import models, database, auth
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler

# @app.get("/")
# async def root():
#     return {"message": "Hello World"}

models.Base.metadata.create_all(bind=database.engine)

from . import batch

scheduler = BackgroundScheduler(timezone="Asia/Seoul")

scheduler.add_job(
    batch.generate_weekly_goals,
    trigger="cron",
    day_of_week="mon",
    hour=0,
    minute=0,
    id="generate_weekly_goals",
    replace_existing=True
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 서버 시작 시
    scheduler.add_job(
        batch.generate_weekly_goals,
        trigger="cron",
        day_of_week="mon",
        hour=0,
        minute=0,
        id="weekly-goal-job"
    )
    scheduler.start()
    print("## APScheduler 시작됨")

    yield  # 여기서 FastAPI 앱이 실행됨

    # 서버 종료 시
    scheduler.shutdown()
    print("## APScheduler 종료됨")

# app = FastAPI(lifespan=lifespan)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

from . import practice

app.include_router(practice.router)

from . import chat

app.include_router(chat.router)

from .db import vector_resource

app.include_router(vector_resource.router)