const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Carpeta donde se guardan los archivos


const app = express();
app.use(express.json());
app.use(cors());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/alumnosDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Definir el esquema y modelo de Alumno
const alumnoSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    nombre: String,
    boleta: String,
    numTelefono: String,
    matriculaCarro: String,
    fotoVehiculo: String,
    fotoAlumno: String, 
    color: String, 
    modelo: String, 
    descripcion: String, 
});

//Registro de accesos 
const registroSchema = new mongoose.Schema({
    uid: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    horaEntrada: { type: String, required: true },
    horaSalida: { type: String },
    tipoVehiculo: { type: String, enum: ["carro", "moto"], required: true }
});

//Registro de lugares
const estacionamientoSchema = new mongoose.Schema({
    totalCarros: { type: Number, default: 200 },
    ocupadosCarros: { type: Number, default: 0 },
    totalMotos: { type: Number, default: 80 },
    ocupadosMotos: { type: Number, default: 0 }
});

const Estacionamiento = mongoose.model('Estacionamiento', estacionamientoSchema);


const RegistroAccesos = mongoose.model('RegistroAccesos', registroSchema);


const Alumno = mongoose.model('Alumno', alumnoSchema);

// Ruta para obtener todos los alumnos
app.get('/getAll', async (req, res) => {
  try {
      const alumnos = await Alumno.find(); // Obtener todos los alumnos
      res.send(alumnos);
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
});


// Ruta para registrar un alumno
app.post("/registro", upload.fields([{ name: "fotoVehiculo" }, { name: "fotoAlumno" }]), async (req, res) => {
    try {
        const baseUrl = "http://localhost:5000/uploads/";

        const nuevoAlumno = new Alumno({
            uid: req.body.uid,
            nombre: req.body.nombre,
            boleta: req.body.boleta,
            matriculaCarro: req.body.matriculaCarro,
            fotoVehiculo: req.files["fotoVehiculo"] ? baseUrl + req.files["fotoVehiculo"][0].filename : "",
            fotoAlumno: req.files["fotoAlumno"] ? baseUrl + req.files["fotoAlumno"][0].filename : "",
        });

        await nuevoAlumno.save();
        res.status(201).send({ message: "Alumno registrado con éxito" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Ruta para obtener los datos de un alumno por UID
app.get('/busqueda/:uid', async (req, res) => {
    try {
        const alumno = await Alumno.findOne({ uid: req.params.uid });
        if (!alumno) return res.status(404).send({ message: 'Alumno no encontrado' });
        res.send(alumno);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

//Ruta para registrar la entrada 
app.post('/entrada', async (req, res) => {
    try {
        const { uid, tipoVehiculo } = req.body;

        // Verificar si el UID existe en la base de alumnos
        const alumno = await Alumno.findOne({ uid });
        if (!alumno) return res.status(404).send({ message: 'Alumno no encontrado' });

        // Registrar entrada
        const nuevoRegistro = new RegistroAccesos({
            uid,
            horaEntrada: new Date().toLocaleTimeString(),
            tipoVehiculo
        });

        await nuevoRegistro.save();

        // Actualizar disponibilidad del estacionamiento
        const estacionamiento = await Estacionamiento.findOne();
        if (!estacionamiento) {
            await Estacionamiento.create({});
        }
        
        if (tipoVehiculo === "carro") {
            await Estacionamiento.updateOne({}, { $inc: { ocupadosCarros: 1 } });
        } else {
            await Estacionamiento.updateOne({}, { $inc: { ocupadosMotos: 1 } });
        }

        res.status(201).send({ message: 'Entrada registrada', alumno });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

//Ruta para registrar la salida 
app.post('/salida', async (req, res) => {
    try {
        const { uid } = req.body;

        // Buscar el registro más reciente sin hora de salida
        const registro = await RegistroAccesos.findOne({ uid, horaSalida: null }).sort({ fecha: -1 });

        if (!registro) return res.status(404).send({ message: 'No se encontró una entrada activa' });

        // Marcar la salida
        registro.horaSalida = new Date().toLocaleTimeString();
        await registro.save();

        // Actualizar disponibilidad del estacionamiento
        const estacionamiento = await Estacionamiento.findOne();

        if (registro.tipoVehiculo === "carro") {
            await Estacionamiento.updateOne({}, { $inc: { ocupadosCarros: -1 } });
        } else {
            await Estacionamiento.updateOne({}, { $inc: { ocupadosMotos: -1 } });
        }

        res.send({ message: 'Salida registrada', registro });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


//obtener la disponibilidad del estacionamiento 
app.get('/disponibilidad', async (req, res) => {
    try {
        const estacionamiento = await Estacionamiento.findOne();
        if (!estacionamiento) return res.status(404).send({ message: 'No hay datos de estacionamiento' });

        res.send({
            lugaresCarroDisponibles: estacionamiento.totalCarros - estacionamiento.ocupadosCarros,
            lugaresMotoDisponibles: estacionamiento.totalMotos - estacionamiento.ocupadosMotos
        });

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


//borrar a TODOS
app.delete('/borrar-todos', async (req, res) => {
    try {
        await Alumno.deleteMany({});
        res.send({ message: 'Todos los registros han sido eliminados' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
