from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

# Import the routers
from routes.example import router as example_router
from routes.auth.login import router as login_router
from routes.auth.register import router as register_router
from routes.translate.translate_text import router as translate_router
from routes.rekognition.ocr import router as ocr_router
 
# Create the FastAPI app
app = FastAPI()


# Exception handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )


# Set CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root
@app.get("/")
def read_root():
    return {"msg": "root"}

# Check
@app.get("/check")
def read_root():
    return {"msg": "OK"}

# Set the routers
app.include_router(example_router, prefix="/api")
app.include_router(register_router, prefix="/auth")
app.include_router(login_router, prefix="/auth")
app.include_router(translate_router)
app.include_router(ocr_router)


# Run the app
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
