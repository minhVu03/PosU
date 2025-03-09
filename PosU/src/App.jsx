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
                numPoses: 1 //NUMBER OF PEOPLE IT WILL DETECT
            });
        }
        createPoseLandmarker();
    }, []);

    useEffect(() => {
        if (webcamRunning) {
            startWebcam();
        } else {
            stopWebcam();   
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
            video.onloadeddata = () => {
                video.width = video.videoWidth;
                video.height = video.videoHeight;
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                predictWebcam();
            };
        } catch (error) {
            console.error("Error accessing webcam:", error);
        }
    }

    function stopWebcam() {
        const video = videoRef.current;
        if (video && video.srcObject) {
            const stream = video.srcObject;
            const tracks = stream.getTracks();

            tracks.forEach(track => {
                track.stop();
            });

            video.srcObject = null;
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
                    radius: (data) => DrawingUtils.lerp(data.from?.z, -0.15, 0.1, 0.5, 0.2) // circles setup
                });
                drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS, {lineWidth: 0.5}); //initialize line thickness
            });

            // Send results to backend
            if(!results || Object.keys(results).length === 0){
                console.log("Nothing to detect!")
            } else {
                if (sendPoseData(results, posen) == 1) posen++;
            }

            if (webcamRunning) {
                requestAnimationFrame(detect);
            }
        }

        detect();
    }

    return (
        <div>
            <h2 className="raleway-bold-700 fade-text has-logo-bgd"
            style = {{display: 'flex',         // Use flexbox to align content
                    justifyContent: 'center',  // Horizontally center the content
                    alignItems: 'center',      // Vertically center the content
                    letterSpacing: '10px',
                    margin: 0,}}>PosU!</h2>
            <p>{webcamRunning ? "" : "Ready to play?"} </p>
            <button onClick={() => setWebcamRunning(!webcamRunning)} className="mdc-button mdc-button--raised" >
                {webcamRunning ? "DISABLE WEBCAM" : "ENABLE WEBCAM"}
            </button>
    
            <div className="video-container" style={{ position: 'relative', margin:'20px auto 0', width: '1280px', height: '720px'}}>
                <video ref={videoRef} autoPlay playsInline className="video" style={{width: '1280px', margin:'auto', height: '720px', position: 'absolute', top:'0px', left:'0px'}} />
                <canvas ref={canvasRef} className="canvas" style={{width: '1280px', margin:'auto', height: '720px', position: 'absolute', top:'0px', left:'0px'}}/>
            </div>
        </div>
    );

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
    
        return 0;
    }
}

export default App;
