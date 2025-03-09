from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:5173",
    "localhost:5173"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class Landmark(BaseModel):
    x: float
    y: float
    z: float
    visibility: float
    presence: float

class Results(BaseModel):
    landmarks: list[list[Landmark]]


@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI backend"}

@app.post("/results")
def receive_results(results: Results):
    x_coordinates = [[landmark.x for landmark in landmark_list] for landmark_list in results.landmarks]
    # Process the x_coordinates here
    print(x_coordinates)
    return {"status": "received", "x_coordinates": x_coordinates}


