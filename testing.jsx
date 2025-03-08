import React, { useState, useEffect } from 'react'
import './App.css'
import {
    PoseLandmarker,
    FilesetResolver,
    DrawingUtils
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";

<link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet">
    <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>
</link>

function App() {
    const [webcamRunning, setWebcamRunning] = useState(false);

    useEffect(() => {
        const video = document.getElementById("webcam");
        const canvasElement = document.getElementById("output_canvas");
        const canvasCtx = canvasElement.getContext("2d");

        const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

        if (hasGetUserMedia()) {
            const enableWebcamButton = document.getElementById("webcamButton");
            enableWebcamButton.addEventListener("click", toggleWebcam);
        } else {
            console.warn("getUserMedia() is not supported by your browser");
        }

        async function predictWebcam() {
            if (!webcamRunning) return;

            console.log("predictWebcam function started");

            try {
                const predictions = await getPredictions(video);
                console.log("Predictions received:", predictions);

                canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

                predictions.forEach(prediction => {
                    console.log("Drawing prediction:", prediction);
                    // Your drawing logic here
                });
            } catch (error) {
                console.error("Error during prediction:", error);
            }

            if (webcamRunning) {
                window.requestAnimationFrame(predictWebcam);
            }
        }

        function toggleWebcam(event) {
            if (!webcamRunning) {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                        video.srcObject = stream;
                        video.addEventListener("loadeddata", () => {
                            setWebcamRunning(true);
                            predictWebcam();
                        });
                    })
                    .catch(err => {
                        console.error("Error accessing webcam:", err);
                    });
            }
        }
    }, [webcamRunning]);

    return (
        <div>
            <h2>Demo: Webcam continuous pose landmarks detection</h2>
            <p>Stand in front of your webcam to get real-time pose landmarker detection.
                Click <b>{webcamRunning ? "disable webcam" : "enable webcam"}</b> below and grant access to the webcam if prompted.</p>

            <div id="liveView" className="videoView">
                <button id="webcamButton" className="mdc-button mdc-button--raised" style={{ marginBottom: '20px' }}>
                    <span className="mdc-button__ripple"></span>
                    <span className="mdc-button__label">{webcamRunning ? "WEBCAM ENABLED" : "ENABLE WEBCAM"}</span>
                </button>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <video id="webcam" style={{ width: '1280px', height: '720px' }} autoPlay playsInline></video>
                        <canvas className="output_canvas" id="output_canvas" width="1280" height="720" style={{ position: 'absolute', left: '0px', top: '0px' }}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
}

async function getPredictions(video) {
    // Simulate an asynchronous operation
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([{ label: "Example", score: 0.9 }]);
        }, 1000);
    });
}

export default App;
