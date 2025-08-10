// src/proyecto/HistorialPagos.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import html2pdf from "html2pdf.js";

const HistorialPagos = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [uniformes, setUniformes] = useState([]);

  useEffect(() => {
    fetch("/api/alumnos")
      .then((res) => res.json())
      .then((data) => setAlumnos(data))
      .catch((err) => console.error("Error al obtener alumnos:", err));
  }, []);

  const buscarHistorial = async (alumno) => {
    try {
      const res = await fetch(`/api/alumnos/${alumno.id}/detalle`);
      if (res.ok) {
        const data = await res.json();
        setAlumnoSeleccionado(data.alumno);
        setPagos(data.pagos);
        setUniformes(data.uniformes);
      } else {
        alert("No se pudo cargar el historial del alumno.");
      }
    } catch (err) {
      console.error("Error al cargar detalle:", err);
    }
  };

  const descargarPDF = () => {
    const elemento = document.getElementById("reporte-alumno");
    const opciones = {
      margin: 0.5,
      filename: `Historial_${alumnoSeleccionado.nombre}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opciones).from(elemento).save();
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
        <h2 className="section-title">Historial de Pagos por Alumno</h2>

        <input
          type="text"
          placeholder="Buscar alumno por nombre..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "1rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Grado</th>
              <th>Grupo</th>
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
                  <td>
                    <button className="btn btn-success" onClick={() => buscarHistorial(a)}>
                      Ver historial
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4">No hay alumnos encontrados.</td></tr>
            )}
          </tbody>
        </table>

        {alumnoSeleccionado && (
          <div id="reporte-alumno" style={{ marginTop: "2rem" }}>
            <hr />
            <h3>Historial de {alumnoSeleccionado.nombre} {alumnoSeleccionado.apellido_paterno}</h3>
            <p><strong>Grado:</strong> {alumnoSeleccionado.grado}</p>
            <p><strong>Grupo:</strong> {alumnoSeleccionado.grupo_id}</p>

            <h4>Pagos</h4>
            {pagos.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Concepto</th>
                    <th>Monto</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((p, i) => (
                    <tr key={i}>
                      <td>{p.fecha_pago}</td>
                      <td>{p.concepto}</td>
                      <td>${p.monto}</td>
                      <td>{p.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No hay pagos registrados.</p>}

            <h4>Uniformes</h4>
            {uniformes.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Prenda</th>
                    <th>Talla</th>
                    <th>Entregado</th>
                  </tr>
                </thead>
                <tbody>
                  {uniformes.map((u, i) => (
                    <tr key={i}>
                      <td>{u.prenda}</td>
                      <td>{u.talla}</td>
                      <td style={{ color: u.entregado ? "green" : "red" }}>
                        {u.entregado ? "Sí" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No hay uniformes registrados.</p>}

            <div className="form-actions" style={{ textAlign: "center", marginTop: "1rem" }}>
              <button className="btn btn-primary" onClick={descargarPDF}>
                📄 Descargar PDF
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistorialPagos;
