from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import pandas as pd
import numpy as np
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

    #extract x and y from df
    rightElbowPoint = np.array((df[13][0], df[13][1]))
    rightWrist = np.array((df[15][0], df[15][1]))

    point2 = np.array((0.8, 0.2)) #remember this for front end

    if inPose1 == 0: #inPose means you've successfully hit the pose
        dist = np.linalg.norm(rightElbowPoint - point2)
        if(dist < 0.05):
            inPose1 = 1
            score = score + 1
    

    
    # Example: Compute average visibility
    # avg_visibility = df["visibility"].mean()

    response_data = {
        "message": "Pose data received",
        # "avg_visibility": avg_visibility,
        "num_landmarks": len(df)
    }


    return JSONResponse(content=jsonable_encoder(response_data))
