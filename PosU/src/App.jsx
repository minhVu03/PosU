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
    let posen = 0;

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
                numPoses: 5 //NUMBER OF PEOPLE IT WILL DETECT
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
                    radius: (data) => DrawingUtils.lerp(data.from?.z, -0.15, 0.1, 0.5, 0.2) 
                });
                drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS, { lineWidth: 0.5 });
            });
    
            // Send results to backend
            if (sendPoseData(results, posen) == 1) posen++;
    
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
            <div className="video-container" style={{ position: 'relative', margin:'auto', width: '1280px', height: '720px' }}>
                <video ref={videoRef} autoPlay playsInline className="video" style={{width: '1280px', margin:'auto', height: '720px', position: 'absolute', top:'0px', left:'0px'}} />
                <canvas ref={canvasRef} className="canvas" style={{width: '1280px', margin:'auto', height: '720px', position: 'absolute', top:'0px', left:'0px'}}/>
            </div>
        </div>
    );
}

async function sendPoseData(results, posen) {
    let response;
    let data;

    if (posen == 0) {
        response = await fetch("http://localhost:5001/check_pose0", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                landmarks: results.landmarks[0],
                timestamp: performance.now()
            })
        });

        data = await response.json();
        //read data, determine return value 1 or 0
        if (data.success == 1) return 1;
    } 
    if (posen == 1) {
        response = await fetch("http://localhost:5001/check_pose1", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                landmarks: results.landmarks[0],
                timestamp: performance.now()
            })
        });

        data = await response.json();
        //read data, determine return value 1 or 0
        if (data.success == 1) return 1;
    }
    if (posen == 2) {
        response = await fetch("http://localhost:5001/check_pose2", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                landmarks: results.landmarks[0],
                timestamp: performance.now()
            })
        });

        data = await response.json();
        //read data, determine return value 1 or 0
        if (data.success == 1) return 1;
    }
}

export default App;
