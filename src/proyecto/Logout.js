import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Elimina solo lo relacionado con autenticación
    localStorage.removeItem("token");

    // Redirige al login
    navigate("/", { replace: true });
  };

  return (
    <button 
      onClick={handleLogout} 
      className="btn btn-danger"
      style={{ marginTop: "1rem" }}
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
