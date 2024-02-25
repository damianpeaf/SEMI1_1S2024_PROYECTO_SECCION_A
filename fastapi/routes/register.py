from fastapi import APIRouter, Form, UploadFile, File
from pydantic import BaseModel

router = APIRouter()


class RegisterData(BaseModel):
    nickname: str
    name: str
    password: str
    photo: bytes


# Endpoint: /register
# Description: This endpoint is used to register a new user.
# Body: Form data
# TODO: Encrypt the password before saving it in the database.
@router.post("/register", response_model=dict, status_code=200)
async def register(
    nickname: str = Form(...),
    name: str = Form(...),
    password: str = Form(...),
    photo: UploadFile = File(...),
):
    return {
        "message": "Register successful!",
        "status": 200,
    }
