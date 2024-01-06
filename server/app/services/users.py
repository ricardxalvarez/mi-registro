from app.bases.users import Login
from app.db.models import Students, Admins, Teachers, Parents
from sqlalchemy.orm import Session
from sqlalchemy import literal, union_all
import bcrypt
from app.utils.encode import encode
from fastapi import HTTPException

async def login(data: Login, db: Session):
    # Combine the queries using union_all
    admin_query = db.query(
        literal('administrador').label('source'),
        Admins.id, Admins.email, Admins.username, Admins.password,
        Admins.name, Admins.lastName, Admins.created_at
    ).filter(Admins.username == data.username).subquery()

    teacher_query = db.query(
        literal('profesor').label('source'),
        Teachers.id, Teachers.email, Teachers.username, Teachers.password,
        Teachers.name, Teachers.lastName, Teachers.created_at
    ).filter(Teachers.username == data.username).subquery()
    
    parent_query = db.query(
        literal('padre').label('source'),
        Parents.id, Parents.email, Parents.username, Parents.password,
        Parents.name, Parents.lastName, Parents.created_at
    ).filter(Parents.username == data.username).subquery()
    
    student_query = db.query(
        literal('estudiante').label('source'),
        Students.id, Students.email, Students.username, Students.password,
        Students.name, Students.lastName, Students.created_at
    ).filter(Students.username == data.username).subquery()

    # Combine the queries using union_all
    login_union = union_all(
        admin_query.select(),
        teacher_query.select(),
        parent_query.select(),
        student_query.select()
    ).alias('login_union')

    # Execute the union_all query
    result = db.query(
        login_union.c.source,
        login_union.c.id,
        login_union.c.email,
        login_union.c.username,
        login_union.c.password,
        login_union.c.name,
        login_union.c.lastName,
        login_union.c.created_at,
        literal('').label('token')
    ).first()

    if not result:
        raise HTTPException(status_code=401, detail='No user found')

    user = result._asdict()

    if not user['id']:
        return user
    if user['password']:
        provided_password = data.password.encode('utf-8')
        stored_password = user['password'].encode('utf-8') if isinstance(user['password'], str) else user['password']
        passwordMatch = bcrypt.checkpw(provided_password, stored_password)
        if passwordMatch:
            user['password'] = data.password
        else:
            raise ValueError('Incorrect password for user')
    user['password'] = data.password
    token = encode(user)
    user.pop('password', None)
    user['token'] = token
    return user
