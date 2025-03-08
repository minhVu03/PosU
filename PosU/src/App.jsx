import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import {
    PoseLandmarker,
    FilesetResolver,
    DrawingUtils
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";

function App() {
    const [webcamRunning, setWebcamRunning] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const poseLandmarkerRef = useRef(null);

    useEffect(() => {
        async function createPoseLandmarker() {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
            );
            poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numPoses: 1 //NUMBER OF PEOPLE IT WILL DETECT
            });
        }
        createPoseLandmarker();
    }, []);

    useEffect(() => {
        if (webcamRunning) {
            startWebcam();
        }
    }, [webcamRunning]);

    async function startWebcam() {
        if (!navigator.mediaDevices?.getUserMedia) {
            console.warn("getUserMedia() is not supported by your browser");
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext("2d");
        const drawingUtils = new DrawingUtils(canvasCtx);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.onloadeddata = () => predictWebcam();
        } catch (error) {
            console.error("Error accessing webcam:", error);
        }
    }

    async function predictWebcam() {
        if (!poseLandmarkerRef.current || !webcamRunning) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext("2d");
        const drawingUtils = new DrawingUtils(canvasCtx);

        async function detect() {
            const startTimeMs = performance.now();
            const results = await poseLandmarkerRef.current.detectForVideo(video, startTimeMs);
            
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            results.landmarks.forEach(landmark => {
                drawingUtils.drawLandmarks(landmark, {
                    radius: (data) => DrawingUtils.lerp(data.from?.z, -0.15, 0.1, 5, 1)
                });
                drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
            });

            if (webcamRunning) {
                requestAnimationFrame(detect);
            }
        }

        detect();
    }

    return (
        <div>
            <h2>Demo: Webcam Continuous Pose Detection</h2>
            <p>Click the button below to {webcamRunning ? "disable" : "enable"} the webcam.</p>
            <button onClick={() => setWebcamRunning(!webcamRunning)} className="mdc-button mdc-button--raised">
                {webcamRunning ? "DISABLE WEBCAM" : "ENABLE WEBCAM"}
            </button>
            <div className="video-container" style={{ position: 'relative', width: '640px', height: '480px' }}>
                <video ref={videoRef} autoPlay playsInline className="video" style={{width: '1280px', height: '720px', position: 'absolute'}} />
                <canvas ref={canvasRef} className="canvas" style={{width: '1280px', height: '720px', position: 'absolute'}}/>
            </div>
        </div>
    );
}

export default App;
