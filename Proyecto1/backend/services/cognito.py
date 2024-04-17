import json
import boto3
from config.credentials import COGNITO_REGION, COGNITO_CLIENT_ID


client = boto3.client("cognito-idp", region_name=COGNITO_REGION)


def register_user(username: str, password: str, name: str, id: int):
    try:
        response = client.sign_up(
            ClientId=COGNITO_CLIENT_ID,
            Username=username,
            Password=password,
            UserAttributes=[
                {
                    'Name': 'name',
                    'Value': name
                },
                {
                    'Name': 'custom:id',
                    'Value': str(id)
                }
            ]
        )
        
        return response
    except Exception as e:
        return e


def login_user(username: str, password: str):
    try:
        response = client.initiate_auth(
            ClientId=COGNITO_CLIENT_ID,  # Reemplaza con tu ID de cliente de Cognito
            AuthFlow="USER_PASSWORD_AUTH",
            AuthParameters={"USERNAME": username, "PASSWORD": password},
        )
        print(response)
        return response
    except client.exceptions.NotAuthorizedException:
        return {"error": "Usuario o password incorrectos."}
    except client.exceptions.UserNotFoundException:
        return {"error": "Usuario no encontrado."}
    except Exception as e:
        return {"error": f"Error al iniciar sesión: {e}"}
