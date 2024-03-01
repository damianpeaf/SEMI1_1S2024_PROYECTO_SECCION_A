from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from routes.login import router as login_router
from routes.register import router as register_router
from routes.info import router as info_router
from routes.photo import router as album_photo_router
from routes.album import router as album_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"msg": "root"}

@app.get("/check")
def read_root():
    return {"msg": "OK"}

app.include_router(login_router, prefix="/auth")
app.include_router(register_router, prefix="/auth")
app.include_router(info_router, prefix="/user")
app.include_router(album_photo_router)
app.include_router(album_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)