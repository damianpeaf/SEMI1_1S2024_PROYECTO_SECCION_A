from typing import Dict, TypeVar
from decouple import config
import datetime
import jwt

T = TypeVar("T")

class Security:
    secret = config("JWT_SECRET")

    def __init__(self):
        self

    @classmethod
    def generate_token(cls, payload: Dict[str, T]) -> str:
        payload["iat"] = datetime.datetime.utcnow()
        payload["exp"] = datetime.datetime.utcnow() + datetime.timedelta(days=1)

        return jwt.encode(payload, cls.secret, algorithm="HS256")

    @classmethod
    def check_token(cls, token) -> Dict[str, T]:
        if len(token) > 0:
            try:
                payload = jwt.decode(token, cls.secret, algorithms=["HS256"])
                return payload
            except (jwt.ExpiredSignatureError, jwt.InvalidSignatureError) as e:
                print(e)
                return None

        return None