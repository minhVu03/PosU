from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import numpy as np
import pandas as pd
import json

router = APIRouter(tags=["pose"])

@router.post("/check_pose0")
async def check_pose0(request: Request):
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

    success = 0
    #extract x and y from df
    rightElbowPoint = np.array((df.iloc[13]["landmarks"]["x"], df.iloc[13]["landmarks"]["y"]))
    rightWrist = np.array((df.iloc[15]["landmarks"]["x"], df.iloc[15]["landmarks"]["y"]))

    point1 = np.array((0.8, 0.2)) #remember this for front end
    point2 = np.array((0.8, 0.7)) #remember this for front end

    dist1 = np.linalg.norm(rightElbowPoint - point1)
    dist2 = np.linalg.norm(rightElbowPoint - point2)
    if(dist1 < 0.05 and dist2 < 0.05):
        success = 1
        print("POSE 1 COMPLETED")
    
    # Example: Compute average visibility
    # avg_visibility = df["visibility"].mean()

    response_data = {
        "message": "Pose data received",
        # "avg_visibility": avg_visibility,
        "success": success
    }

    return JSONResponse(content=jsonable_encoder(response_data))


@router.post("/check_pose1")
async def check_pose1(request: Request):
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

    success = 0
    #extract x and y from df
    rightElbowPoint = np.array((df.iloc[13]["landmarks"]["x"], df.iloc[13]["landmarks"]["y"]))
    rightWrist = np.array((df.iloc[15]["landmarks"]["x"], df.iloc[15]["landmarks"]["y"]))

    point1 = np.array((0.8, 0.2)) #remember this for front end
    point2 = np.array((0.5, 0.6)) #remember this for front end

    dist1 = np.linalg.norm(rightElbowPoint - point1) #WRIST NOT ELBOW
    dist2 = np.linalg.norm(rightElbowPoint - point2)
    if(dist1 < 0.05 and dist2 < 0.05):
        success = 1
    
    # Example: Compute average visibility
    # avg_visibility = df["visibility"].mean()

    response_data = {
        "message": "Pose data received",
        # "avg_visibility": avg_visibility,
        "success": success
    }

    return JSONResponse(content=jsonable_encoder(response_data))

@router.post("/check_pose2")
async def check_pose2(request: Request):
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

    print(df.columns)

    success = 0
    #extract x and y from df
    rightElbowPoint = np.array((df.iloc[13]["landmarks"]["x"], df.iloc[13]["landmarks"]["y"]))
    rightWrist = np.array((df.iloc[15]["landmarks"]["x"], df.iloc[15]["landmarks"]["y"]))

    point1 = np.array((0.8, 0.2)) #remember this for front end
    point2 = np.array((0.3, 0.2)) #remember this for front end

    dist1 = np.linalg.norm(rightElbowPoint - point1)
    dist2 = np.linalg.norm(rightElbowPoint - point2)
    if(dist1 < 0.05 and dist2 < 0.05):
        success = 1
    
    # Example: Compute average visibility
    # avg_visibility = df["visibility"].mean()

    response_data = {
        "message": "Pose data received",
        # "avg_visibility": avg_visibility,
        "success": success
    }

    return JSONResponse(content=jsonable_encoder(response_data))
