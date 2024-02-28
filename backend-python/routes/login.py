from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Models
from models.entities.user import User
from models.user_model import UserModel

# Utils
from utils.encrypt import Encrypt
from utils.security import Security

router = APIRouter()


class LoginData(BaseModel):
    username: str
    password: str


@router.post("/login", response_model=dict, status_code=200)
async def login(data: LoginData):
    encrypted_password = Encrypt.md5_encrypt(data.password)

    # Validate credentials
    user = UserModel.login_user(
        User(username=data.username, password=encrypted_password)
    )

    if user is None:
        return JSONResponse(
            content={"message": "Error en la autenticacion", "status": 401},
            status_code=401,
        )
    else:
        # Generate JWT
        token = Security.generate_token({"id": user[0]})

        data = {
            "userid": user[0],
            "username": user[1],
            "name": user[2],
            "image": user[4],
            "jwt": token,
        }
        return JSONResponse(
            content={"message": "Autenticacion exitosa", "status": 200, "data": data},
            status_code=200,
        )


# TODO: Implement logout
@router.post("/logout", response_model=dict, status_code=200)
async def logout():
    return {
        "message": "Logout successful",
        "status": 200,
    }
