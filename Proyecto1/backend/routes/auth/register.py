from fastapi import APIRouter
from fastapi.responses import JSONResponse
from services.cognito import register_user
from pydantic import BaseModel
from re import match
from decouple import config

# Entity
from models.entities.user import User

# Model
from models.user_model import UserModel
import boto3

router = APIRouter()


class RegisterData(BaseModel):
    username: str
    password: str
    name: str


@router.post("/register", response_model=dict, status_code=200)
async def register(data: RegisterData):
    try:
        # Register user on Cognito
        # validate that user is an email
        regex = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
        if not match(regex, data.username):
            return JSONResponse(
                {
                    "error": "Error registering user",
                    "message": "El username no es un correo válido",
                    "status": 400,
                },
                400,
            )
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

            # Send Welcome email
            try:
                ses_client = boto3.client(
                        "ses",
                        region_name="us-east-1",
                        aws_access_key_id=config("SES_ACCESS_KEY"),
                        aws_secret_access_key=config("SES_SECRET_KEY"),
                    )
                ses_client.send_email(
                    Source="noreply@damianpeaf.tech",
                    Destination={"ToAddresses": [data.username]},
                    Message={
                        "Subject": {
                            "Data": "Bienvenido a Planorama",
                            "Charset": "UTF-8",
                        },
                        "Body": {
                            "Text": {
                                "Data": "Bienvenido a Planorama",
                                "Charset": "UTF-8",
                            },
                            "Html": {
                                "Data": "<h1>Bienvenido a Planorama</h1><p>Gracias por confiar en nosotros, esperamos que disfrutes de nuestra plataforma.</p>",
                                "Charset": "UTF-8",
                            },
                        },
                    },
                )
            except Exception as e:
                print("Error sending welcome email: ")
                print(e)
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
