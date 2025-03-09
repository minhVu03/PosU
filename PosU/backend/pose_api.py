from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import pandas as pd
import json

router = APIRouter(tags=["pose"])

@router.post("/process_pose")
async def process_pose(request: Request):
    """
    Receives pose landmarks and processes them.
    Expected request format:
    {
        "landmarks": [ { "x": ..., "y": ..., "z": ..., "visibility": ... }, ... ],
        "timestamp": 123456789
    }
    """
    data = await request.json()
    
    # Convert pose landmarks to a DataFrame
    # df = pd.DataFrame(data["landmarks"])
    df = pd.DataFrame(data)

    print(df)
    
    # Example: Compute average visibility
    # avg_visibility = df["visibility"].mean()

    response_data = {
        "message": "Pose data received",
        # "avg_visibility": avg_visibility,
        "num_landmarks": len(df)
    }

    return JSONResponse(content=jsonable_encoder(response_data))
