from fastapi import APIRouter
from services.cognito import register_user
from pydantic import BaseModel

router = APIRouter()


class RegisterData(BaseModel):
    username: str
    password: str
    name: str


@router.post("/register", response_model=dict, status_code=200)
async def register(data: RegisterData):
    # Register user on Cognito
    print("Registering user")
    try:
        response = register_user(data.username, data.password, data.name)
        # TODO: Register user on DB

    except Exception as e:
        print(e)
        return {"error": "Error registering user"}

    return response
