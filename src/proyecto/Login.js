// Login.js
import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate, Link } from 'react-router-dom';
import EscudoImg from '../proyecto/Logo.jpg';

function Login() {
  const [user, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const MAX_LENGTH = 30;
  
  const isFormValid = user.trim().length > 0 &&
                      password.trim().length > 0 &&
                      user.trim().length <= MAX_LENGTH &&
                      password.trim().length <= MAX_LENGTH;

  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('login-background');
    return () => {
      document.body.classList.remove('login-background');
    };
  }, []);

  const iniciarSesion = async () => {
    if (!isFormValid) {
      alert("Por favor, complete correctamente todos los campos.");
      return;
    }
    try {
      // const API = process.env.REACT_APP_API_URL || "";
      const response = await fetch('/validaAdmin', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ usuario: user, contrasena: password })
      });
      const data = await response.json();
      console.log("Respuesta del servidor", data);
      if (data.valido) {
        console.log("Inicio de sesión exitoso");
        navigate('/index');
      } else {
        alert(data.mensaje);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error al conectar con el servidor.");
    }
  };

  return (
    <>
      <div className="background-overlay"></div>

      <div className="login-container">
        <img src={EscudoImg} alt="Logo Tec" className="logo-" />
        <p>Iniciar sesión</p>

        <input 
          type="text" 
          placeholder="usuario" 
          className="input" 
          value={user} 
          onChange={(e) => setUsuario(e.target.value)}
          maxLength={MAX_LENGTH}
        />

        <input 
          type="password" 
          placeholder="password" 
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          maxLength={MAX_LENGTH}
        />

        <button className="btn" onClick={iniciarSesion} disabled={!isFormValid}>
          Ingresar
        </button>

        {/* Nuevo enlace para registrar profesor */}
        <p className="register-link">
          ¿No tienes una cuenta? <Link to="/registro">Registrar Profesor</Link>
        </p>
      </div>
    </>
  );
}

export default Login;
