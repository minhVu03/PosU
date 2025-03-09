from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import pandas as pd
import json

router = APIRouter(tags=["pose"])

@router.post("/check_pose0")
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

    success = 0
    #extract x and y from df
    rightElbowPoint = np.array((df[13][0], df[13][1]))
    rightWrist = np.array((df[15][0], df[15][1]))

    point1 = np.array((0.8, 0.2)) #remember this for front end
    point2 = np.array((0.8, 0.7)) #remember this for front end

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


@router.post("/check_pose1")
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

    success = 0
    #extract x and y from df
    rightElbowPoint = np.array((df[13][0], df[13][1]))
    rightWrist = np.array((df[15][0], df[15][1]))

    point1 = np.array((0.8, 0.2)) #remember this for front end
    point2 = np.array((0.5, 0.6)) #remember this for front end

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

@router.post("/check_pose2")
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

    success = 0
    #extract x and y from df
    rightElbowPoint = np.array((df[13][0], df[13][1]))
    rightWrist = np.array((df[15][0], df[15][1]))

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
