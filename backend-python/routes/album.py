from fastapi import APIRouter, Form, UploadFile, File
from pydantic import BaseModel

router = APIRouter()


class AlbumData(BaseModel):
    name: str


@router.post("/album/{album_id}", response_model=dict, status_code=200)
async def create_album(
    album_id: int,
    data: AlbumData,
):
    print(f"Album ID: {album_id}")
    print(f"Album Name: {data.name}")
    
    return {
        "message": "Album created!",
        "status": 200,
    }
    
    
@router.put("/album/{album_id}", response_model=dict, status_code=200)
async def update_album(
    album_id: int,
    data: AlbumData,
):
    print(f"Album ID: {album_id}")
    print(f"Album Name: {data.name}")
    
    return {
        "message": "Album updated!",
        "status": 200,
    }
    

@router.get("/album/{album_id}", response_model=dict, status_code=200)
async def get_album(
    album_id: int,
):
    data = {
        "name": "Album Name",
        "id": album_id,
    }
    
    return {
        "message": "Album found!",
        "status": 200,
        "data": data,
    }
    

@router.delete("/album/{album_id}", response_model=dict, status_code=200)
async def delete_album(
    album_id: int,
):
    return {
        "message": "Album deleted!",
        "status": 200,
    }


@router.get("/albums", response_model=dict, status_code=200)
async def get_albums():
    
    return {
        "message": "Albums found!",
        "status": 200,
        "data": [
            {
                "name": "Album Name",
                "id": 1,
            },
            {
                "name": "Album Name 2",
                "id": 2,
            },
        ],
    }