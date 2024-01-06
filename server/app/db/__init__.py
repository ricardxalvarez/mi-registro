from contextlib import contextmanager
from app.db.session import SessionLocal
from sqlalchemy.orm import Session

@contextmanager
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
    
def get_database():
    with get_db() as db:
        return db