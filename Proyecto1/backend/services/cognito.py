import json
import boto3
from config.credentials import COGNITO_REGION, COGNITO_CLIENT_ID


client = boto3.client("cognito-idp", region_name=COGNITO_REGION)


def register_user(username: str, password: str, name: str):
    try:
        response = client.sign_up(
            ClientId=COGNITO_CLIENT_ID,
            Username=username,
            Password=password,
            UserAttributes=[{"Name": "name", "Value": name}],
        )

        return response
    except client.exceptions.UsernameExistsException:
        raise Exception("El usuario ya existe")

    except Exception as e:
        raise e


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
        return {
            "error": "Error on log in",
            "message": "Usuario o password incorrectos.",
            "status": 401,
        }
    except client.exceptions.UserNotFoundException:
        return {
            "error": "Error on log in",
            "message": "Usuario no encontrado.",
            "status": 404,
        }
    except Exception as e:
        return {
            "error": "Error on log in",
            "message": f"Error al iniciar sesión: {e}",
            "status": 500,
        }
