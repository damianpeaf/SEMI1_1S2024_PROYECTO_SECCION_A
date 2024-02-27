from decouple import config
import datetime
import jwt


class Security:
    secret = config("JWT_SECRET")

    def __init__(self):
        self

    @classmethod
    def generate_token(cls, payload):
        payload["iat"] = datetime.datetime.utcnow()
        payload["exp"] = datetime.datetime.utcnow() + datetime.timedelta(days=1)

        return jwt.encode(payload, cls.secret, algorithm="HS256")

    @classmethod
    def verify_token(cls, headers):
        if "Authorization" in headers.keys():
            authorization = headers["Authorization"]
            encoded_token = authorization.split(" ")[1]

            if len(encoded_token) > 0:
                try:
                    payload = jwt.decode(
                        encoded_token, cls.secret, algorithms=["HS256"]
                    )
                    return payload
                except (jwt.ExpiredSignatureError, jwt.InvalidSignatureError):
                    return False

        return False
