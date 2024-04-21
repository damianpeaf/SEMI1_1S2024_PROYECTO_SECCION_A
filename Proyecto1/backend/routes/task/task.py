from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

from models.task_model import TaskModel

from utils.security import Security

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter()

class TaskData(BaseModel):
    id: int
    state: str
    image_url: str
    notes: str


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
async def put_task(token: str = Depends(oauth2_scheme), data: TaskData = None):

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

        task = TaskModel.put_task(data)

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
async def post_task(token: str = Depends(oauth2_scheme), data: TaskData = None):
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

        task = TaskModel.post_task(data)

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