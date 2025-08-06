// Importa React y hooks para trabajar con estado y efectos
import React, { useEffect, useState } from "react";
// Importa componente Link para navegación interna
import { Link } from "react-router-dom";

// Importa el componente Registro Alumnos
import RegistroAlumno from "./gestion_alumnos_turores/RegistroAlumno";
import RegistroTutor from "./gestion_alumnos_turores/RegistroTutor";

// Importa el archivo de estilos
import "../proyecto/styles.css";

// Componente principal que muestra el dashboard
const Index = () => {
  // Se crea estado para almacenar la lista de alumnos traidos de la API
  const [alumnos, setAlumnos] = useState([]);


  // Función que consulta el endpoint de alumnos en la API
  const fetchAlumnos = async () => {
    try {
      // Realiza petición a la API en la URL dada
      // const API = process.env.REACT_APP_API_URL || "";
      // const res = await fetch(`${API}/alumno`);
      const res = await fetch("/api/alumnos");
      // Si la respuesta es correcta, convierte a JSON y actualiza el estado
      if (res.ok) {
        const data = await res.json();
        setAlumnos(data);
      }
    } catch (error) {
      // Muestra error en la consola si ocurre algún problema
      console.error("Error al obtener alumnos:", error);
    }
  };

  // Se ejecuta la consulta al montar el componente
  useEffect(() => {
    fetchAlumnos();
  }, []);

  return (
    <>
    {/*/ Encabezado de la página con navegación*/}
    <div className="layout">
      <nav className="sidebar">
        {/* Enlace que muestra el logo y lleva a la misma página de dashboard*/}
        <Link className="logo" to="/index">
          Inicio
        </Link>
        {/* Menú de navegación interno a diferentes secciones del dashboard*/}
        <Link className="nav-item" to="/">Gestión de Grupos</Link>
        <Link className="nav-item" to="/">Registro de Pagos</Link>
        <Link className="nav-item" to="/">Historial de Pagos</Link>
        <Link className="nav-item" to="/">Gestión de Bajas</Link>
        <Link className="nav-item" to="/descarga">Descarga de Reportes</Link>
      </nav>

        {/* Contenido principal de la página*/}
        <main className="main-content">
          {/* Sección para listar los alumnos obtenidos desde la API*/}
            <RegistroAlumno/>

            <RegistroTutor/>
                 
        </main>
      </div>
    </>
  );
};

export default Index;
