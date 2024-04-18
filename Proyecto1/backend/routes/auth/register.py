from fastapi import APIRouter
from fastapi.responses import JSONResponse
from services.cognito import register_user
from pydantic import BaseModel

# Entity
from models.entities.user import User

# Model
from models.user_model import UserModel

router = APIRouter()


class RegisterData(BaseModel):
    username: str
    password: str
    name: str


@router.post("/register", response_model=dict, status_code=200)
async def register(data: RegisterData):
    try:
        # Register user on Cognito
        result_cognito = register_user(data.username, data.password, data.name)

        # Create user entity
        new_user = User(
            id=result_cognito.get("UserSub"),
            username=data.username,
            name=data.name,
            password=data.password,
        )

        # Register user on DB
        result_db = UserModel.add_user(new_user)

        # Check if user was registered on DB
        if result_db["affected_rows"] == 1:

            # Build response
            response = {
                "message": "User registered successfully",
                "status": 200,
                "data": {
                    "id": result_cognito.get("UserSub"),
                    "username": data.username,
                    "name": data.name,
                },
                "cognito": result_cognito,
            }

            return JSONResponse(response, 200)
        else:
            return JSONResponse(
                {
                    "error": "Error registering user",
                    "status": 500,
                    "message": "Error registering user on DB",
                },
                500,
            )

    except Exception as e:
        print("Error registering user: ")
        print(e)
        return JSONResponse(
            {"error": "Error registering user", "message": str(e), "status": 500}, 500
        )
