import './App.css';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

import LoginScreen from './components/login';
import AdminDashboard from './components/adminDashboard';
import PoliciaDashboard from './components/policiaDashboard';
import AlumnoDashboard from './components/alumnoDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const app = getApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();

  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (userCred) => {
        if (userCred) {
          const user = userCred.user;
          setIsAuthenticated(true);

          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists() && userSnap.data().rol) {
            setRole(userSnap.data().rol);
          }
        }
      })
      .catch((error) => {
        console.error("Error en la autenticación:", error);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().rol) {
          setRole(userSnap.data().rol);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <h1 className="loading-text">
        {"Cargando...".split("").map((char, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
            {char}
          </span>
        ))}
      </h1>
    );
  }

  return (
    <div className="App">
      {!isAuthenticated ? (
        <LoginScreen onLogin={loginWithGoogle} />
      ) : role === "admin" ? (
        <AdminDashboard />
      ) : role === "policia" ? (
        <PoliciaDashboard />
      ) : role === "alumno" ? (
        <AlumnoDashboard uid={auth.currentUser?.uid}/>
      ) : (
        <h1>Obteniendo rol...</h1>
      )}
    </div>
  );
}

export default App;
