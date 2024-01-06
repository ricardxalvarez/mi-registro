import jwt
from app.config import settings

def encode(payload) -> str:
    if payload['id']:
        payload['id'] = str(payload['id'])
    if payload['created_at']:
        payload['created_at'] = payload['created_at'].isoformat()
    encoded_jwt = jwt.encode(payload=payload, key=settings.JWT_SECRET, algorithm="HS256")
    return encoded_jwt