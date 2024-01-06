import jwt
from functools import wraps
from fastapi import Header, HTTPException, Depends, Request
from typing import Literal, Callable
from app.config import settings
from sqlalchemy.orm import Session
from app.db import get_database
from sqlalchemy import literal, union_all
from app.db.models import Admins, Teachers, Parents, Students
import bcrypt

AllowedRoles = Literal['administrador', 'profesor', 'estudiante', 'padre']

def get_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header is missing")

    try:
        scheme, token = authorization.split()
        if scheme.lower() != 'bearer':
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
        print(scheme)
        return token.encode('utf-8')  # Encoding the token to bytes
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header format")

def auth(valid: list[AllowedRoles]):
    def decorator(route_function: Callable):
        @wraps(route_function)
        async def inner(*args, request: Request, db: Session = Depends(get_database), **kwargs):
            authorization: str = request.headers.get('Authorization')
            if not authorization:
                raise HTTPException(status_code=401, detail="Authorization header missing")

            token = get_token(authorization)
            user_info = jwt.decode(token, settings.JWT_SECRET, algorithms="HS256")
            # Add your JWT token validation and role checking logic here
            # ...
            if user_info['id']:
                username = user_info['username']
                admin_query = db.query(
                    literal('administrador').label('source'),
                    Admins.id, Admins.email, Admins.username, Admins.password,
                    Admins.name, Admins.created_at
                ).filter(Admins.username == username).subquery()

                teacher_query = db.query(
                    literal('profesor').label('source'),
                    Teachers.id, Teachers.email, Teachers.username, Teachers.password,
                    Teachers.name, Teachers.created_at
                ).filter(Teachers.username == username).subquery()

                parent_query = db.query(
                    literal('padre').label('source'),
                    Parents.id, Parents.email, Parents.username, Parents.password,
                    Parents.name, Parents.created_at
                ).filter(Parents.username == username).subquery()

                student_query = db.query(
                    literal('estudiante').label('source'),
                    Students.id, Students.email, Students.username, Students.password,
                    Students.name, Students.created_at
                ).filter(Students.username == username).subquery()

                # Combine the queries using union_all
                login_union = union_all(
                    admin_query.select(),
                    teacher_query.select(),
                    parent_query.select(),
                    student_query.select()
                ).alias('login_union')

                # Execute the union_all query
                user = db.query(
                    login_union.c.source,
                    login_union.c.id,
                    login_union.c.email,
                    login_union.c.username,
                    login_union.c.password,
                    login_union.c.name,
                    login_union.c.created_at
                ).first()._asdict()
                
                if user['id']:
                    if user['source'] not in valid:
                        raise HTTPException(status_code=400, detail="Invalid authentication scheme")
                    provided_password = user_info['password'].encode('utf-8')
                    stored_password = user['password'].encode('utf-8') if isinstance(user['password'], str) else user['password']
                    print(provided_password)
                    passwordMatch = bcrypt.checkpw(provided_password, stored_password)
                    if not passwordMatch:
                        raise HTTPException(status_code=400, detail="Invalid authentication scheme")
                    else:
                        pass
                        user.pop('password', None)
                        request.state.user = user
                else: raise HTTPException(status_code=400, detail="Invalid authentication scheme")
            else: raise HTTPException(status_code=400, detail="Invalid authentication scheme")
            # Once validated, call the actual route function
            response = await route_function(request=request, db=db, *args, **kwargs)
            return response
        return inner
    return decorator