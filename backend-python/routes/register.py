from fastapi import APIRouter, Form, UploadFile, File
from fastapi.responses import JSONResponse

# Entities
from models.entities.user import User

# Models
from models.user_model import UserModel

# Utils
from utils.encrypt import Encrypt


router = APIRouter()


# Endpoint: /register
# Description: This endpoint is used to register a new user.
# Body: Form data
# TODO: Upload photo to S3
@router.post("/register", response_model=dict, status_code=200)
async def register(
    nickname: str = Form(...),
    name: str = Form(...),
    password: str = Form(...),
    photo: UploadFile = File(...),
):

    photo_url = "www.example.com"
    encrypted_password = Encrypt.md5_encrypt(password)
    user = User(0, nickname, name, encrypted_password, photo_url)
    
    try:
        affected_rows = UserModel.add_user(user)
        
        if affected_rows == 1:
            return {
                "message": "Usuario registrado correctamente.",
                "status": 200,
            }
        else:
            return JSONResponse(content={"message": "Error en el registro", "status": 500}, status_code=500)
    
    except Exception as e:
        return JSONResponse(content={"message": "Error en el registro", "status": 500}, status_code=500)
