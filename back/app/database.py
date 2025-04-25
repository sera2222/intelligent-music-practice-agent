from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
db_pass = os.getenv("DB_PASSWORD")
if not db_pass:
    raise RuntimeError("DB_PASSWORD 환경변수가 설정되지 않았습니다")

DATABASE_URL = f"mysql+pymysql://root:{db_pass}@localhost/practice_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()