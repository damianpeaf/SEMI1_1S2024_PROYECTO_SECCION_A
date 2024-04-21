import time

from typing import Optional
from fastapi import APIRouter, Depends, Form, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel


# Models
from models.project_model import ProjectModel
from models.user_project_model import UserProjectModel
from models.project_extra_model import ProjectExtraModel
from models.role_model import RoleModel
from models.role_model import Role


# Entitites
from models.entities.project import Project
from models.entities.user_project import UserProject

# Utils
from utils.security import Security
from services.s3 import upload_photo

class ProjectData(BaseModel):
    name: str
    description: str
    category: str
    location: str


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter()

@router.get("/projects", response_model=dict, status_code=200)
async def get_projects_by_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = Security.check_token(token)
        if payload is not None:
            user_id = payload["id"]
            projects = UserProjectModel.get_projects_by_user(user_id)
            return JSONResponse({"message": "Projects retrieved successfully", "status": 200, "data": projects}, 200)
        else:
            return JSONResponse({"message": "Unauthorized", "status": 401}, 401)
    except Exception as e:
        print(e)
    return JSONResponse({"message": "Error getting album", "status": 500}, 500)


@router.post("/projects", response_model=dict, status_code=201)
async def create_project(project_data: ProjectData, token: str = Depends(oauth2_scheme)):
    try:
        payload = Security.check_token(token)
        if payload is not None:
            user_id = payload["id"]
            new_project = ProjectModel.add_project(
                Project(
                    title=project_data.name,
                    description=project_data.description,
                    category=project_data.category,
                    location=project_data.location
                )
            )

            result_db = UserProjectModel.add_user_project(
                UserProject(
                    user_id=user_id,
                    project_id=new_project["project_id"],
                    role_id=RoleModel.get_role_by_name(Role.OWNER).id
                )
            )

            if result_db["affected_rows"] == 1:
                response = {
                    "message": "Project created successfully",
                    "status": 200,
                    "data": {
                        "id": result_db["user_project_id"],
                        "name": project_data.name,
                        "description": project_data.description,
                        "category": project_data.category,
                        "location": project_data.location
                    }
                }
                return JSONResponse(response, 200)
            else: 
                return JSONResponse(
                {
                    "error": "Error registering project",
                    "status": 500,
                    "message": "Error registering project on DB",
                },
                500,
            )
            
        else:
            return JSONResponse({"message": "Unauthorized", "status": 401}, 401)
    except Exception as e:
        print(e)
    return JSONResponse({"message": "Error creating project", "status": 500}, 500)

@router.put("/projects/{project_id}", response_model=dict, status_code=200)
async def update_project(project_id: int, project_data: ProjectData, token: str = Depends(oauth2_scheme)):
    try:
        payload = Security.check_token(token)

        if payload is None:
            return JSONResponse({"message": "Unauthorized", "status": 401}, 401)
        
        user_id = payload["id"]
        project = ProjectModel.get_project_by_id(project_id)
        if project is None:
            return JSONResponse({"message": "Project not found", "status": 404}, 404)

        user_project = UserProjectModel.get_user_project(user_id, project_id)

        if user_project is None:
            return JSONResponse(
                {
                    "error": "Unauthorized",
                    "status": 401,
                    "message": "User is not authorized to update this project",
                },
                401,
            )

        result_db = ProjectModel.update_project(
                project_id=project_id,
                category=project_data.category,
                description=project_data.description,
                location=project_data.location,
                title=project_data.name
        )

        if result_db["affected_rows"] != 1:
            return JSONResponse(
                {
                    "error": "Error updating project",
                    "status": 500,
                    "message": "Error updating project on DB",
                },
                500,
            )
        response = {
            "message": "Project updated successfully",
            "status": 200,
            "data": {
                "id": project_id,
                "name": project_data.name,
                "description": project_data.description,
                "category": project_data.category,
                "location": project_data.location
            }
        }
        return JSONResponse(response, 200)

    except Exception as e:
        print(e)
    return JSONResponse({"message": "Error updating project", "status": 500}, 500)

@router.delete("/projects/{project_id}", response_model=dict, status_code=200)
async def delete_project(project_id: int, token: str = Depends(oauth2_scheme)):
    try:
        payload = Security.check_token(token)

        if payload is None:
            return JSONResponse({"message": "Unauthorized", "status": 401}, 401)
        
        user_id = payload["id"]
        project = ProjectModel.get_project_by_id(project_id)
        if project is None:
            return JSONResponse({"message": "Project not found", "status": 404}, 404)

        user_project = UserProjectModel.get_user_project(user_id, project_id)

        if user_project is None:
            return JSONResponse(
                {
                    "error": "Unauthorized",
                    "status": 401,
                    "message": "User is not authorized to delete this project",
                },
                401,
            )

        result_db = ProjectModel.delete_project(project_id)

        if result_db["affected_rows"] != 1:
            return JSONResponse(
                {
                    "error": "Error deleting project",
                    "status": 500,
                    "message": "Error deleting project on DB",
                },
                500,
            )
        response = {
            "message": "Project deleted successfully",
            "status": 200,
            "data": {
                "id": project_id,
                "name": project.title,
                "description": project.description,
                "category": project.category,
                "location": project.location
            }
        }
        return JSONResponse(response, 200)

    except Exception as e:
        print(e)
    return JSONResponse({"message": "Error deleting project", "status": 500}, 500)

@router.post("/projects/{project_id}/members", response_model=dict, status_code=201)
async def add_member_to_project(project_id: int, user_id: int, role_id: int, token: str = Depends(oauth2_scheme)):
    try:
        payload = Security.check_token(token)
        if payload is not None:
            user_id = payload["id"]
            project = ProjectModel.get_project_by_id(project_id)
            if project is None:
                return JSONResponse({"message": "Project not found", "status": 404}, 404)

            user_project = UserProjectModel.get_user_project(user_id, project_id)

            if user_project is None:
                return JSONResponse(
                    {
                        "error": "Unauthorized",
                        "status": 401,
                        "message": "User is not authorized to add members to this project",
                    },
                    401,
                )

            result_db = UserProjectModel.add_user_project(
                UserProject(
                    user_id=user_id,
                    project_id=project_id,
                    role_id=role_id
                )
            )

            if result_db["affected_rows"] == 1:
                response = {
                    "message": "Member added successfully",
                    "status": 200,
                    "data": {
                        "id": result_db["user_project_id"],
                        "user_id": user_id,
                        "project_id": project_id,
                        "role_id": role_id
                    }
                }
                return JSONResponse(response, 200)
            else:
                return JSONResponse(
                {
                    "error": "Error adding member",
                    "status": 500,
                    "message": "Error adding member on DB",
                },
                500,
            )
        else:
            return JSONResponse({"message": "Unauthorized", "status": 401}, 401)
    except Exception as e:
        print(e)
    return JSONResponse({"message": "Error adding member", "status": 500}, 500)

@router.get("/projects/{project_id}/members", response_model=dict, status_code=200)
async def get_members_by_project(project_id: int, token: str = Depends(oauth2_scheme)):
    try:
        payload = Security.check_token(token)
        if payload is not None:
            user_id = payload["id"]
            project = ProjectModel.get_project_by_id(project_id)
            if project is None:
                return JSONResponse({"message": "Project not found", "status": 404}, 404)

            user_project = UserProjectModel.get_user_project(user_id, project_id)

            if user_project is None:
                return JSONResponse(
                    {
                        "error": "Unauthorized",
                        "status": 401,
                        "message": "User is not authorized to get members of this project",
                    },
                    401,
                )

            members = UserProjectModel.get_members_by_project(project_id)
            response = {
                "message": "Members retrieved successfully",
                "status": 200,
                "data": members
            }
            return JSONResponse(response, 200)
        else:
            return JSONResponse({"message": "Unauthorized", "status": 401}, 401)
    except Exception as e:
        print(e)
    return JSONResponse({"message": "Error getting members", "status": 500}, 500)


@router.post("/note", response_model=dict, status_code=201)
async def add_note_to_project(
    token: str = Depends(oauth2_scheme),
    project_id: str = Form(None), 
    notes: str = Form(None),
    image: Optional[UploadFile] = File(None),
    ):
    try:
        payload = Security.check_token(token)
        if payload is not None:
            user_id = payload["id"]
            project = ProjectModel.get_project_by_id(int(project_id))
            if project is None:
                return JSONResponse({"message": "Project not found", "status": 404}, 404)

            user_project = UserProjectModel.get_user_project(user_id, project_id)

            if user_project["role_id"] == RoleModel.get_role_by_name(Role.VIEWER).id:
                return JSONResponse(
                    {
                        "error": "Unauthorized",
                        "status": 401,
                        "message": "User is not authorized to add notes to this project",
                    },
                    401,
                )
            
            file_url = None

            # upload file to s3

            if image is not None:
                timestamp = int(time.time())
                file_location = f"Fotos_Publicadas/{project_id}/{timestamp}.jpg"
                file_url = upload_photo(image.file, file_location)

            result_db = ProjectExtraModel.post_project_extra(
                notes=notes,
                image_url=file_url,
                project_id=project_id
            )

            if result_db["affected_rows"] == 1:
                response = {
                    "message": "Note added successfully",
                    "status": 200,
                    "data": {
                        "id": result_db["project_extra_id"],
                        "project_id": project_id,
                        "notes": notes,
                        "image": image
                    }
                }
                return JSONResponse(response, 200)
            else:
                return JSONResponse(
                {
                    "error": "Error adding note",
                    "status": 500,
                    "message": "Error adding note on DB",
                },
                500,
            )
        else:
            return JSONResponse({"message": "Unauthorized", "status": 401}, 401)
    except Exception as e:
        print(e)
    return JSONResponse({"message": "Error adding note", "status": 500}, 500)
    