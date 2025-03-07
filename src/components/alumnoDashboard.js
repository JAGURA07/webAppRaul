import React, { useEffect, useState } from "react";
import "./styles.css";
import profilePic from "./profilePic.jpg";
import qrCode from "./qr.png";
import axios from "axios";

export default function AlumnoDashboard({ uid }) {
  const [bgGradient, setBgGradient] = useState("");
  const [student, setStudent] = useState(null);

  useEffect(() => {
    // Generar colores aleatorios para el fondo
    const randomColor1 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const randomColor2 = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setBgGradient(`linear-gradient(135deg, ${randomColor1}, ${randomColor2})`);

    if (uid) {
      // Obtener la información del alumno desde el backend
      axios.get(`http://localhost:5000/busqueda/${uid}`)
        .then((response) => {
          setStudent(response.data);
        })
        .catch(() => {
          setStudent(null);
        });
    }
  }, [uid]);

  return (
    <div className="alumno-container" style={{ background: bgGradient }}>
      <div className="student-card">
        <div className="profile-section">
        <img
            src={student?.fotoAlumno ? student.fotoAlumno : profilePic}
            alt="Foto de perfil"
            className="profile-pic"
        />
        </div>
        <div className="info-section">
          <h2 className="student-name">{student?.nombre || "Nombre no disponible"}</h2>
          <p className="student-id">Boleta: {student?.boleta || "Sin boleta"}</p>
        </div>
        <div className="qr-section">
          <img src={qrCode} alt="Código QR" className="qr-code" />
        </div>
      </div>
    </div>
  );
}
