import cv2
import mediapipe as mp
import numpy as np
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

print("imports worked")
#import model
model_path = 'C:\MY FOLDERS\PosU\PosU\server\App.py'
BaseOptions = mp.tasks.BaseOptions
PoseLandmarker = mp.tasks.vision.PoseLandmarker
PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions
PoseLandmarkerResult = mp.tasks.vision.PoseLandmarkerResult
VisionRunningMode = mp.tasks.vision.RunningMode
print("model imported and initialized")

# Create a pose landmarker instance with the live stream mode:
def print_result(result: PoseLandmarkerResult, output_image: mp.Image, timestamp_ms: int):
    print('pose landmarker result: {}'.format(result))

options = PoseLandmarkerOptions(
    base_options=BaseOptions(model_asset_path=model_path),
    running_mode=VisionRunningMode.LIVE_STREAM,
    result_callback=print_result)

#OpenCV VideoCapture
cap = cv2.VideoCapture(0)

#OPEN UP CAMERA WINDOW
while True:
    # pull frame
    ret, frame = cap.read()
    # mirror frame
    frame = cv2.flip(frame, 1)
    # display frame
    cv2.imshow('frame',frame)
    if cv2.waitKey(1) == ord('q'): #PRESS Q TO QUIT CAMERA
        break
# release everything
cap.release()
cv2.destroyAllWindows()

# with PoseLandmarker.create_from_options(options) as landmarker:
#     # The landmarker is initialized. Use it here.

#prepare data
mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=numpy_frame_from_opencv)
