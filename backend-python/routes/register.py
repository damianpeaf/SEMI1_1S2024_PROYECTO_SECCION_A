from fastapi import APIRouter, Form, UploadFile, File
from pydantic import BaseModel

# Entities
from models.entities.user import User

# Models
from models.user_model import UserModel


router = APIRouter()


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

    photo_url = "www.example.com"
    user = User(0, nickname, name, password, photo_url)
    affected_rows = UserModel.add_user(user)

    if affected_rows == 1:
        return {
            "message": "Register successful!",
            "status": 200,
        }
    else:
        return {"message": "Error on register", "status": 500}
