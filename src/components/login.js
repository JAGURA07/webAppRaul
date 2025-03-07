import React from 'react';
import { FcGoogle } from "react-icons/fc";
import "./styles.css"; 

function LoginScreen({ onLogin }) {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">¡Bienvenido!</h1>
        <p className="login-subtitle">Inicia sesión para continuar</p>
        <button onClick={onLogin} className="login-button">
          <FcGoogle className="google-icon" />
          <span></span>
        </button>
      </div>
    </div>
  );
}

export default LoginScreen;



