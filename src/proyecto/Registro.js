// src/proyecto/RegisterProfesor.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Registro.css'; // Estilos opcionales para el formulario de registro

const MAX_LENGTH = 50;


function Register() {
  
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  
  // Formulario válido cuando:
  // - usuario y contraseña no están vacíos
  
  const isFormValid = 
                      usuario.trim().length > 0 &&
                      contrasena.trim().length > 0 &&
                      usuario.trim().length <= MAX_LENGTH &&
                      contrasena.trim().length <= MAX_LENGTH;
  
 
  
  const handleRegister = async () => {
    if (!isFormValid) {
      alert("Por favor, complete correctamente todos los campos.");
      return;
    }
    
    // Prepara el objeto a enviar
    const data = {
      usuario: usuario.trim(),
      contrasena: contrasena.trim()
    };
    
    console.log("Registrando datos:", data);
    
    try {
      const response = await fetch("/profesor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        alert("Registrado exitosamente.");
        // Opcional: redirecciona al dashboard o a otra ruta
        
      } else {
        const errorData = await response.json();
        alert("Error: " + (errorData.mensaje || "No se pudo registrar."));
      }
    } catch (error) {
      console.error("Error al registrarse:", error);
      alert("Error al conectar con el servidor.");
    }
  };
  
  return (
    <div className="register-container">
      <h2>Registrarse</h2>

      <div className="form-group">
        <label>Usuario (máx {MAX_LENGTH} caracteres):</label>
        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="Nombre de usuario"
        />
      </div>
      <div className="form-group">
        <label>Contraseña (máx {MAX_LENGTH} caracteres):</label>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="Contraseña"
        />
      </div>
      <button className="btn" onClick={handleRegister} disabled={!isFormValid}>
        Registrar
      </button>
      <p className="register-link">
           <Link to="/">Regresar</Link>
        </p>
    </div>
  );
    }


export default Register;
