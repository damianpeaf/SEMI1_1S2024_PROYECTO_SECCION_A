
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel


# Models
from models.project_model import ProjectModel
from models.user_project_model import UserProjectModel
from models.project_extra_model import ProjectExtraModel
from models.role_model import RoleModel
from models.user_model import UserModel


# Entitites
from models.entities.project import Project

# Utils
from utils.security import Security

class ProjectData(BaseModel):
    name: str
    description: str


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter()

@router.get("/projects", response_model=dict, status_code=200)
async def get_projects_by_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = Security.check_token(token)
        if payload is not None:
            user_id = payload["id"]
            projects = UserProjectModel.get_projects_by_user(user_id)
        else:
            return JSONResponse({"message": "Unauthorized", "status": 401}, 401)
    except Exception as e:
        print(e)
    return JSONResponse({"message": "Error creating album", "status": 500}, 500)