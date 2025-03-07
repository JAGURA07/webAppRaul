import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [alumnos, setAlumnos] = useState([]);
  const [formData, setFormData] = useState({
    uid: "",
    nombre: "",
    boleta: "",
    matriculaCarro: "",
    fotoVehiculo: null,
    fotoAlumno: null,
  });

  useEffect(() => {
    axios.get("http://localhost:5000/alumnos").then((response) => {
      setAlumnos(response.data);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    await axios.post("http://localhost:5000/alumnos", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("Alumno registrado");
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="uid" placeholder="UID" onChange={handleChange} required className="block border p-2" />
        <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required className="block border p-2" />
        <input type="text" name="boleta" placeholder="Boleta" onChange={handleChange} required className="block border p-2" />
        <input type="text" name="matriculaCarro" placeholder="Matrícula" onChange={handleChange} required className="block border p-2" />
        <input type="file" name="fotoVehiculo" onChange={handleFileChange} required className="block border p-2" />
        <input type="file" name="fotoAlumno" onChange={handleFileChange} required className="block border p-2" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Registrar Alumno</button>
      </form>

      <h2 className="text-xl font-bold mt-5">Lista de Alumnos</h2>
      <ul>
        {alumnos.map((alumno) => (
          <li key={alumno.uid} className="border p-2 mt-2">
            {alumno.nombre} - {alumno.boleta}
          </li>
        ))}
      </ul>
    </div>
  );
}
