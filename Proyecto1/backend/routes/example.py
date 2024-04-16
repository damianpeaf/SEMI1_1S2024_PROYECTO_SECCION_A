from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()


@router.post("/example", response_model=dict, status_code=200)
async def example():
    return JSONResponse(content={"msg": "example"}, status_code=200)
