import uvicorn
from fastapi import FastAPI
from pose_api import router as pose_router  # Adjust based on your actual file structure
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Pose Detection API")
app.include_router(pose_router)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from this origin
    allow_credentials=True,  # Allow cookies and credentials
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5001, reload=True)
