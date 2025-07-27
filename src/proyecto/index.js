// Importa React y hooks para trabajar con estado y efectos
import React, { useEffect, useState } from "react";
// Importa componente Link para navegación interna
import { Link } from "react-router-dom";


//import GraficaBarra from "../Graficas/GraficaBarra";
// Importa el archivo de estilos
import "../proyecto/styles.css";

// Componente principal que muestra el dashboard
const Index = () => {
  // Se crea estado para almacenar la lista de alumnos traidos de la API
  const [alumnos, setAlumnos] = useState([]);
  const [intentos,setIntentos] = useState([]);


  // Función que consulta el endpoint de alumnos en la API
  const fetchAlumnos = async () => {
    try {
      // Realiza petición a la API en la URL dada
      // const API = process.env.REACT_APP_API_URL || "";
      // const res = await fetch(`${API}/alumno`);
      const res = await fetch("/alumno");
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

  // Función que consulta el endpoint de intentos en la API
  const fetchIntentos = async () =>{
    // petición a al aAPI
    try{
      const res = await fetch("http://localhost:3000/intento");
      if (res.ok){
        const data = await res.json();
        setIntentos(data);
      }
    } catch (error) {
      // Muestra error en la consola si ocurre algún problema
      console.error("Error al obtener alumnos:", error);
    }
    
  };
  useEffect(()=>{
    fetchIntentos();
  },[]);

  // Se ejecuta la consulta al montar el componente
  useEffect(() => {
    fetchAlumnos();
  }, []);

  return (
    <>
    {/*/ Encabezado de la página con navegación*/}
      <header className="header">
        <div className="header-container">
          {/* Enlace que muestra el logo y lleva a la misma página de dashboard*/}
          <Link className="logo" to="/index">
            Dashboard Estudiantes
          </Link>
          {/* Menú de navegación interno a diferentes secciones del dashboard*/}
          <nav className="nav">
            <Link className="nav-item" to="/topalto">
              Top Estudiantes
            </Link>
            <Link className="nav-item" to="/topbajos">
              Top Estudiantes más bajos
            </Link>
            <Link className="nav-item" to="/exitofallo">
              Éxito y Fallo
            </Link>
            <Link className="nav-item" to="/puntajemax">
              Puntaje Máximo
            </Link>
            
            <Link className="nav-item" to="/crud">
              CRUD
            </Link>

            <Link className="nav-item" to="/descarga">
              Descarga
            </Link>
          </nav>
        </div>
      </header>

      {/* Contenido principal de la página*/}
      <main className="main-content">
        {/* Sección para listar los alumnos obtenidos desde la API*/}
        <section id="topEstudiantes">
          <h2 className="section-title">Listado de Alumnos</h2>
          <table className="table">
            <thead>
              <tr>
                
                <th>ID</th>
                <th>Número de Lista</th>
                <th>Grupo</th>
                <th>Género</th>
                <th>XP</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.length > 0
                ? alumnos.map((a) => (
                    <tr key={a[0]}>
                      <td>{a[0]}</td>
                      <td>{a[1]}</td>
                      <td>{a[2]}</td>
                      <td>{a[3]}</td>
                      <td>{a[4]}</td>
                    </tr>
                  ))
                : 
                  <tr>
                    <td colSpan="5">No hay alumnos disponibles</td>
                  </tr>
              }
            </tbody>
          </table>
        </section>

        <section id="exitoFallo" style={{ marginTop: "2rem" }}>
          <h2 className="section-title">Éxito y Fallo por Nivel</h2>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nivel</th>
                <th>Puntuación</th>
                <th>Tiempo</th>
                <th>Completado</th>
                <th>Alumno</th>
              </tr>
            </thead>
            <tbody>
              {intentos.length > 0
                ? intentos.map((a) => (
                    <tr key={a[0]}>
                      <td>{a[0]}</td>
                      <td>{a[1]}</td>
                      <td>{a[2]}</td>
                      <td>{a[3]}</td>
                      <td>{a[4]}</td>
                      <td>{a[5]}</td>
                    </tr>
                  ))
                : 
                  <tr>
                    <td colSpan="6">No hay intentos disponibles</td>
                  </tr>
              }
            </tbody>
          </table>
        </section>
  

      </main>
    </>
  );
};

export default Index;
