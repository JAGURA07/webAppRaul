import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// 🔹 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC-7RaS3uyDgSWOjJHNaXf-LA8its7-HbM",
  authDomain: "entrada-salida-ff2ee.firebaseapp.com",
  projectId: "entrada-salida-ff2ee",
  storageBucket: "entrada-salida-ff2ee.appspot.com", 
  messagingSenderId: "964565607176",
  appId: "1:964565607176:web:0e5cab3d297181c2ce42bd",
  measurementId: "G-3HHZMXLHB8"
};

// 🔹 Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 🔹 Inicializar Firestore y Authentication
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
