import { useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import "./styles.css";

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    uid: "",
    nombre: "",
    boleta: "",
    matriculaCarro: "",
    fotoVehiculo: null,
    fotoAlumno: null,
    qrCode: "", // Agregamos un campo para el código QR
    numTelefono: "",
    descripcion: "",
    color: "",
    modelo:""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Generar código QR basado en el UID
    const qrData = `${formData.uid}`;
    setFormData((prev) => ({ ...prev, qrCode: qrData }));

    const data = new FormData();
  
    Object.keys(formData).forEach((key) => {
      if (key === "fotoVehiculo" || key === "fotoAlumno") {
        data.append(key, formData[key]);
      } else {
        data.append(key, String(formData[key]));
      }
    });

    try {
      const response = await axios.post("http://localhost:5000/registro", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Alumno registrado");
    } catch (error) {
      console.error("Error en la solicitud:", error.response);
    }
  };

  return (
    <div className="admin-container">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <form onSubmit={handleSubmit} className="alumnoform">
        <input type="text" name="uid" placeholder="UID" onChange={handleChange} required className="admin-input" />
        <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required className="admin-input" />
        <input type="text" name="boleta" placeholder="Boleta" onChange={handleChange} required className="admin-input" />
        <input type="text" name="matriculaCarro" placeholder="Matrícula" onChange={handleChange} required className="admin-input" />
        <input type="text" name="descripcion" placeholder="Descripcion" onChange={handleChange} required className="admin-input" />
        <input type="text" name="color" placeholder="Color" onChange={handleChange} required className="admin-input" />
        <input type="text" name="modelo" placeholder="Modelo" onChange={handleChange} required className="admin-input" />
        <input type="text" name="numTelefono" placeholder="Numero de telefono" onChange={handleChange} required className="admin-input" />
        
        
        <label htmlFor="fotoVehiculo" className="upload-label">Subir foto del vehiculo</label>
        <input type="file" id="fotoVehiculo" name="fotoVehiculo" onChange={handleFileChange} required className="file-input" />

        <label htmlFor="fotoAlumno" className="upload-label">Subir foto del alumno</label>
        <input type="file" id="fotoAlumno" name="fotoAlumno" onChange={handleFileChange} required className="file-input" />

        <button type="submit" className="admin-button">Registrar Alumno</button>
      </form>

      {formData.uid && (
        <div className="qr-container">
          <h2>Código QR Generado</h2>
          <QRCodeSVG value={formData.uid} />
        </div>
      )}
    </div>
  );
}
