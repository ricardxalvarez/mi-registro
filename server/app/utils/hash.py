import bcrypt

def hash(data):
    salt = bcrypt.gensalt()
    hash = bcrypt.hashpw(data.encode('utf-8'), bytes(salt))
    return hash