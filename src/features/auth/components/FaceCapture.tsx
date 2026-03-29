"use client";

import { useRef, useState } from "react";
import * as faceapi from "face-api.js";

type Props = {
  onCapture: (descriptor: number[]) => void;
};

export default function FaceCapture({ onCapture }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  // Load models manually
  const loadModels = async () => {
    const MODEL_URL = "/models";

    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

    setModelsLoaded(true);
    alert("Models loaded ✅");
  };

  // Start camera manually
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      setCameraOn(true);
    }
  };

  // Capture face
  const captureFace = async () => {
    if (!videoRef.current) return;

    const detection = await faceapi
      .detectSingleFace(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("Face not detected ❌");
      return;
    }

    const descriptor = Array.from(detection.descriptor);
    onCapture(descriptor);

    alert("Face captured ✅");
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <video
        ref={videoRef}
        autoPlay
        muted
        className="w-64 h-48 border rounded"
      />

      {!modelsLoaded && (
        <button onClick={loadModels}>
          Load AI Models
        </button>
      )}

      {modelsLoaded && !cameraOn && (
        <button onClick={startCamera}>
          Start Camera
        </button>
      )}

      {cameraOn && (
        <button onClick={captureFace}>
          Capture Face
        </button>
      )}
    </div>
  );
}