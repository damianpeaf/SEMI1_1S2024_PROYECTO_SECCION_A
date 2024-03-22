from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

# Models
from models.album_model import AlbumModel
from models.photo_model import PhotoModel

# Entities
from models.entities.album import Album, AlbumType

# Utils
from utils.security import Security

# JWT
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter()


class AlbumData(BaseModel):
    name: str


@router.post("/album", response_model=dict, status_code=200)
async def create_album(data: AlbumData, token: str = Depends(oauth2_scheme)):
    try:
        # Get JWT token
        payload = Security.check_token(token)
        if payload:
            # Create album
            new_album = Album(0, data.name, payload.get("id"), AlbumType.STANDARD.value)
            result = AlbumModel.add_album(new_album)
            affected_rows = result.get("affected_rows")

            if affected_rows == 1:
                data = {"album_id": result.get("album_id")}
                return JSONResponse({"message": "Album created", "status": 200, "data": data}, 200)
        else:
            return JSONResponse({"message": "Unauthorized", "status": 401}, 401)

    except Exception as e:
        print(e)

    return JSONResponse({"message": "Error creating album", "status": 500}, 500)


@router.put("/album/{album_id}", response_model=dict, status_code=200)
async def update_album(
    album_id: int, data: AlbumData, token: str = Depends(oauth2_scheme)
):
    try:
        # Get JWT token
        payload = Security.check_token(token)

        if payload:
            # Create album
            new_album = Album(
                album_id, data.name, payload.get("id"), AlbumType.STANDARD.value
            )

            affected_rows = AlbumModel.update_album(new_album)

            if affected_rows == 1:
                return JSONResponse({"message": "Album updated", "status": 200}, 200)
        else:
            return JSONResponse({"message": "Unauthorized", "status": 401}, 401)

    except Exception as e:
        print(e)

    return JSONResponse({"message": "Error updating album", "status": 500}, 500)


@router.get("/album/{album_id}", response_model=dict, status_code=200)
async def get_album(album_id: int, token: str = Depends(oauth2_scheme)):
    try:
        # Get JWT token
        payload = Security.check_token(token)

        if payload:
            result = AlbumModel.get_album(album_id, payload.get("id"))
            if result:
                result = {"id": result.get("id"), "name": result.get("name"), "album_type": result.get("album_type")}
                return JSONResponse(
                    {"message": "Album found", "status": 200, "data": result},
                    200,
                )
            else:
                return JSONResponse({"message": "Album not found", "status": 404}, 404)
    except Exception as e:
        print(e)
        return JSONResponse({"message": "Error getting album", "status": 500}, 500)


# TODO: Delete only logical
@router.delete("/album/{album_id}", response_model=dict, status_code=200)
async def delete_album(album_id: int, token: str = Depends(oauth2_scheme)):
    try:
        # Get JWT token
        payload = Security.check_token(token)

        if payload:
            # Create album
            target_album = Album(
                album_id, "", payload.get("id"), AlbumType.STANDARD.value
            )

            affected_rows = AlbumModel.delete_album(target_album)

            if affected_rows == 1:
                return JSONResponse({"message": "Album deleted", "status": 200}, 200)
            else:
                return JSONResponse({"message": "Album not found", "status": 404}, 404)
        else:
            return JSONResponse({"message": "Unauthorized", "status": 401}, 401)

    except Exception as e:
        print(e)

    return JSONResponse({"message": "Error deleting album", "status": 500}, 500)


# TODO: Get albums with photos from query
@router.get("/album", response_model=dict, status_code=200)
async def get_albums(token: str = Depends(oauth2_scheme)):
    try:
        # Get JWT token
        payload = Security.check_token(token)

        if payload is not None:
            # Get albums
            albums = AlbumModel.get_all_albums(payload.get("id"))

            # Get photos for each album
            for album in albums:
                album["images"] = PhotoModel.get_all_photos(album["id"])

            return JSONResponse(
                {
                    "message": "Albums found",
                    "status": 200,
                    "data": {
                        "albums": albums, 
                    },
                },
                200,
            )
        else:
            return JSONResponse({"message": "Unauthorized", "status": 401}, 401)

    except Exception as e:
        print(e)

    return JSONResponse({"message": "Error getting albums", "status": 500}, 500)
