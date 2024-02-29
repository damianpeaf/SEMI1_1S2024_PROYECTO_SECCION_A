import time
from fastapi import APIRouter, Form, UploadFile, File, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from models.album_model import AlbumModel
from models.entities.photo import Photo
from models.photo_model import PhotoModel
from utils.file_uploader import FileUploader

# Models
from models.user_model import UserModel

# Utils
from utils.security import Security

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Description: This endpoint is used to update the user's information.
@router.put("/info", response_model=dict, status_code=200)
async def info(
    name: str = Form(None),
    username: str = Form(None),
    image: UploadFile = File(None),
    token: str = Depends(oauth2_scheme),
):
    # Validate token
    payload = Security.check_token(token)

    if payload:
        user_id = payload.get("id")
        file_url = None

        try:
            # Check if image is not None
            if image is not None:
                # Upload photo to S3 and get the file url
                timestamp = int(time.time())
                file_location = (
                    f"Fotos_Perfil/{image.filename}-{timestamp}-{user_id}.jpg"
                )
                file_url = FileUploader.upload_photo(image.file, file_location)
                
                # Register user photo url
                profile_album = UserModel.get_profile_album(user_id)
                profile_id = profile_album.get("id")
                res_photo = PhotoModel.add_photo(
                    Photo(0, image.filename, file_url, profile_id)
                )
                

            # Update user's info
            affected_rows = UserModel.update_user(user_id, name, username, file_url)
            
            # Check if the user's info was updated
            if affected_rows == 1:
                return JSONResponse({"message": "Info updated!", "status": 200}, 200)
            else:
                return JSONResponse({"message": "Error updating info", "status": 500}, 500)

        except Exception as e:
            print(e)
            return JSONResponse({"message": "Error updating info", "status": 500}, 500)

    else:
        return JSONResponse({"message": "No autorizado", "status": 401}, 401)


# Description: This endpoint is used to retrieve the user's information.
@router.get("/info", response_model=dict, status_code=200)
async def get_info(token: str = Depends(oauth2_scheme)):
    # Validate token
    payload = Security.check_token(token)

    if payload:
        user_id = payload.get("id")
        try:
            result = UserModel.get_user(user_id)
            
            data = {
                "userid": result[0],
                "username": result[1],
                "name": result[2],
                "imageUrl": result[4]
            }
            
            if result:
                return JSONResponse({"message": "Info retrieved!", "status": 200, "data": data}, 200)
            else:
                return JSONResponse({"message": "User not found", "status": 404}, 404)
        except Exception as e:
            print(e)
            return JSONResponse({"message": "Error getting info", "status": 500}, 500)
