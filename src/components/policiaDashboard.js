import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";

export default function PoliciaDashboard() {
  const webcamRef = useRef(null);
  const [qrData, setQrData] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      scanQRCode();
    }, 1000); // Escanea cada segundo

    return () => clearInterval(interval);
  }, []);

  const scanQRCode = () => {
    if (!webcamRef.current) return;

    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

    if (qrCode) {
      setQrData(qrCode.data);
      console.log("QR Detectado:", qrCode.data);
    }
  };

  return (
    <div className="policia-dashboard">
      <h2>Escáner de Código QR</h2>
      <Webcam ref={webcamRef} width={400} height={300} />
      <p><strong>QR Detectado:</strong> {qrData || "Esperando código..."}</p>
    </div>
  );
}
