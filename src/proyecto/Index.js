import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RegistroAlumno from "./gestion_alumnos_turores/RegistroAlumno";
import AlumnoDetalle from "./gestion_alumnos_turores/AlumnoDetalle";

import "../proyecto/styles.css";

const Index = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [vistaDetalle, setVistaDetalle] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [uniformes, setUniformes] = useState([]);

  const fetchAlumnos = async () => {
    try {
      const res = await fetch("/api/alumnos/");
          if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setAlumnos(data);
      }
      catch (error) {
      console.error("Error al obtener alumnos:", error);
    }
  };

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const mostrarDetalleAlumno = async (id) => {
    try {
      const res = await fetch(`/api/alumnos/${id}/detalle`);
      if (res.ok) {
        const data = await res.json();
        setAlumnoSeleccionado(data.alumno);
        setPagos(data.pagos);
        setUniformes(data.uniformes);
        setVistaDetalle(true);
      } else {
        alert("No se pudo cargar el detalle del alumno.");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const alumnosFiltrados = alumnos.filter((a) =>
    `${a.nombre} ${a.apellido_paterno} ${a.apellido_materno}`
      .toLowerCase()
      .includes(filtro.toLowerCase())
  );


  return (
    <div className="layout">
      <nav className="sidebar">
        <Link className="logo" to="/index">Inicio</Link>
        <Link className="nav-item" to="/gestionGrupos">Gestión de Grupos</Link>
        <Link className="nav-item" to="/registroPagos">Registro de Pagos</Link>
        <Link className="nav-item" to="/historialPagos">Historial de Pagos</Link>
        <Link className="nav-item" to="/bajaAlumno">Gestión de Bajas</Link>
        <Link className="nav-item" to="/descarga">Descarga de Reportes</Link>
      </nav>

      <main className="main-content">
        {!vistaDetalle ? (
          <>
            <RegistroAlumno />
            <h2 className="section-title">Lista de Alumnos</h2>

            <input
              type="text"
              placeholder="Buscar alumno por nombre..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
            />

            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Grado</th>
                  <th>Grupo</th>
                  <th>Adeudo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {alumnosFiltrados.length > 0 ? (
                  alumnosFiltrados.map((a) => (
                    <tr key={a.id}>
                      <td>{a.nombre} {a.apellido_paterno} {a.apellido_materno}</td>
                      <td>{a.grado}</td>
                      <td>{a.grupo_id}</td>
                      <td style={{ color: a.adeudo_total > 0 ? 'red' : 'green' }}>
                        ${a.adeudo_total}
                      </td>
                      <td>
                        <button className="btn btn-primary" onClick={() => mostrarDetalleAlumno(a.id)}>
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5">No hay alumnos disponibles.</td></tr>
                )}
              </tbody>
            </table>
          </>
        ) : (
          <AlumnoDetalle
            alumno={alumnoSeleccionado}
            pagos={pagos}
            uniformes={uniformes}
            onBack={() => setVistaDetalle(false)}
          />
          
        )}
      </main>
    </div>
  );
};

export default Index;
