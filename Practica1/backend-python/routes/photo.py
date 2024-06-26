from fastapi import APIRouter, Depends, Form, Security, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
import time

# Models
from models.photo_model import PhotoModel

# Entities
from models.entities.photo import Photo

# Utils
from utils.file_uploader import FileUploader
from utils.security import Security

# JWT
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter()

# TODO: Validate album_id
@router.post("/photo", response_model=dict, status_code=200)
async def upload_photo(
    token: str = Depends(oauth2_scheme),
    name: str = Form(None),
    album: str = Form(None),
    image: UploadFile = File(None),
):
    try:
        album = int(album)
        
        # Get JWT token
        payload = Security.check_token(token)

        if payload:
            userid = payload.get("id")

            # Upload photo to S3 and get the file url
            timestamp = int(time.time())
            file_location = f"Fotos_Publicadas/{name}-{timestamp}-{userid}.jpg"
            file_url = FileUploader.upload_photo(image.file, file_location)

            # Register photo in the database
            result = PhotoModel.add_photo(Photo(0, name, file_url, album))

            affected_rows = result.get("affected_rows")

            if affected_rows == 1:
                return JSONResponse({"message": "Photo uploaded", "status": 200}, 200)
            else:
                return JSONResponse(
                    {"message": "Error on photo register", "status": 500}, 500
                )

        else:
            return JSONResponse({"message": "Unauthorized", "status": 401}, 401)

    except Exception as e:
        print(e)
        return JSONResponse({"message": "Error uploading photo", "status": 500}, 500)
