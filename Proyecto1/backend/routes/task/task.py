import time

from typing import Optional
from fastapi import APIRouter, Depends, Form, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer

from models.entities.task import Task

from models.task_model import TaskModel

from utils.security import Security

from services.s3 import upload_photo

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter()

@router.get("/tasks", response_model=dict, status_code=200)
async def get_tasks(token: str = Depends(oauth2_scheme), project_id: int = None):
    try:
        payload = Security.check_token(token)

        if payload is None:
            return JSONResponse(
                {
                    "message": "Invalid token",
                    "status": 401,
                },
                401,
            )

        response = TaskModel.get_tasks(project_id)

        if response is None:
            return JSONResponse(
                {
                    "message": "Tasks not found",
                    "status": 404,
                },
                404,
            )

        return JSONResponse(
            {
                "tasks": response,
                "message": "Tasks found",
                "status": 200,
            },
            200,
        )

    except Exception as e:
        print(e)

    return JSONResponse(
        {
            "message": "Error getting tasks",
            "status": 500,
        },
        500,
    )


@router.put("/task", response_model=dict, status_code=200)
async def put_task(
    token: Optional[str] = Depends(oauth2_scheme),
    task_id: str = Form(None),
    state: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    ):

    try:
        payload = Security.check_token(token)

        if payload is None:
            return JSONResponse(
                {
                    "message": "Invalid token",
                    "status": 401,
                },
                401,
            )
        
        project_id = int(project_id)

        file_url = None

        # upload file to s3

        if image is not None:
            timestamp = int(time.time())
            file_location = f"Fotos_Publicadas/{project_id}/{timestamp}.jpg"
            file_url = upload_photo(image.file, file_location)

        task = TaskModel.put_task(
            task_id=task_id,
            state=state,
            image_url=file_url,
            notes=notes,
        )

        if task is None:
            return JSONResponse(
                {
                    "message": "Task not found",
                    "status": 404,
                },
                404,
            )

        return JSONResponse(
            {
                "message": "Task updated",
                "status": 200,
            },
            200,
        )
    
    except Exception as e:
        print(e)

    return JSONResponse(
        {
            "message": "Error updating task",
            "status": 500,
        },
        500,
    )

@router.delete("/task/{task_id}", response_model=dict, status_code=200)
async def delete_task(token: str = Depends(oauth2_scheme), task_id: int = None):
    try:
        payload = Security.check_token(token)

        if payload is None:
            return JSONResponse(
                {
                    "message": "Invalid token",
                    "status": 401,
                },
                401,
            )

        task = TaskModel.delete_task(task_id)

        if task is None:
            return JSONResponse(
                {
                    "message": "Task not found",
                    "status": 404,
                },
                404,
            )

        return JSONResponse(
            {
                "message": "Task deleted",
                "status": 200,
            },
            200,
        )

    except Exception as e:
        print(e)

    return JSONResponse(
        {
            "message": "Error deleting task",
            "status": 500,
        },
        500,
    )

@router.post("/task", response_model=dict, status_code=200)
async def post_task(
    token: str = Depends(oauth2_scheme),
    project_id: int = Form(None),
    state: str = Form(None),
    notes: str = Form(None),
    image: UploadFile = File(None),
    ):
    try:
        payload = Security.check_token(token)
        file_url = None

        if payload is None:
            return JSONResponse(
                {
                    "message": "Invalid token",
                    "status": 401,
                },
                401,
            )
        
        # upload file to s3
        if image is not None:
            timestamp = int(time.time())
            file_location = f"Fotos_Publicadas/{project_id}/{timestamp}.jpg"
            file_url = upload_photo(image.file, file_location) if image is not None else ''


        task = TaskModel.post_task(
            Task(
                project_id=project_id,
                state=state,
                notes=notes,
                image_url=file_url
            )
        )

        if task is None:
            return JSONResponse(
                {
                    "message": "Task not found",
                    "status": 404,
                },
                404,
            )

        return JSONResponse(
            {
                "message": "Task added",
                "status": 200,
            },
            200,
        )

    except Exception as e:
        print(e)

    return JSONResponse(
        {
            "message": "Error adding task",
            "status": 500,
        },
        500,
    )