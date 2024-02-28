from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.login import router as login_router
from routes.register import router as register_router
from routes.info import router as info_router
from routes.album_photo import router as album_photo_router
from routes.album import router as album_router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# uvicorn main:app --reload


@app.get("/")
def read_root():
    return {"msg": "root"}


app.include_router(login_router, prefix="/auth")
app.include_router(register_router)
app.include_router(info_router)
app.include_router(album_photo_router)
app.include_router(album_router)
