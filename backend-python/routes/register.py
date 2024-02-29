import time
from fastapi import APIRouter, Form, UploadFile, File
from fastapi.responses import JSONResponse
from models.entities.album import Album

# Entities
from models.entities.user import User
from models.entities.album import Album, AlbumType
from models.entities.photo import Photo

# Models
from models.user_model import UserModel
from models.album_model import AlbumModel
from models.photo_model import PhotoModel

# Utils
from utils.encrypt import Encrypt
from utils.file_uploader import FileUploader


router = APIRouter()


# Description: This endpoint is used to register a new user.
@router.post("/register", response_model=dict, status_code=200)
async def register(
    username: str = Form(...),
    name: str = Form(...),
    password: str = Form(...),
    image: UploadFile = File(...),
):
    try:
        encrypted_password = Encrypt.md5_encrypt(password)

        # Register user
        new_user = User(0, username, name, encrypted_password, "")
        res_user = UserModel.add_user(new_user)
        new_user.id = res_user.get("user_id")

        # Upload photo to S3 and get the file url
        timestamp = int(time.time())
        file_location = f"Fotos_Perfil/{image.filename}-{timestamp}-{new_user.id}.jpg"
        file_url = FileUploader.upload_photo(image.file, file_location)

        # Update user photo url
        new_user.photo_url = file_url
        UserModel.update_user(new_user.id, None, None, file_url)

        # Register album
        res_album = AlbumModel.add_album(
            Album(
                0, "Fotos de perfil", new_user.id, AlbumType.PROFILE.value
            )
        )

        # Register user photo url
        res_photo = PhotoModel.add_photo(
            Photo(0, image.filename, file_url, res_album.get("album_id"))
        )

        if (
            res_user.get("affected_rows") == 1
            and res_album.get("affected_rows") == 1
            and res_photo.get("affected_rows") == 1
        ):
            return JSONResponse({"message": "Usuario registrado.", "status": 200}, 200)
        else:
            return JSONResponse({"message": "Error en el registro", "status": 500}, 500)

    except Exception as e:
        print(e)
        return JSONResponse({"message": "Error en el registro", "status": 500}, 500)
