
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
from models.role_model import Role


# Entitites
from models.entities.project import Project
from models.entities.user_project import UserProject

# Utils
from utils.security import Security

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
        else:
            return JSONResponse({"message": "Unauthorized", "status": 401}, 401)
    except Exception as e:
        print(e)
    return JSONResponse({"message": "Error creating album", "status": 500}, 500)


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