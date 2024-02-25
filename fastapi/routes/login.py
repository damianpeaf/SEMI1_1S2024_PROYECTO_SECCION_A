from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class LoginData(BaseModel):
    nickname: str
    password: str


# TODO: Encrypt the password before comparing it with the database.
@router.post("/login", response_model=dict, status_code=200)
async def login(data: LoginData):
    
    # TESTING PURPOSES ONLY
    user_id = 1
    name = "John Doe"
    nickname = "Johnny"
    photo = "https://example.com/photo.jpg"
    jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

    return {
        "message": "Login successful!",
        "status": 200,
        "data": {
            "userid": user_id,
            "name": name,
            "nickname": nickname,
            "photo": photo,
            "jwt": jwt,
        },
    }


@router.post("/logout", response_model=dict, status_code=200)
async def logout():
    return {
        "message": "Logout successful!",
        "status": 200,
    }