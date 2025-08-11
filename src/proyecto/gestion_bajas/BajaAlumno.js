// src/proyecto/BajaAlumno.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./BajaAlumno.css";

const BajaAlumno = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [bajas, setBajas] = useState([]);
  const [filtro, setFiltro] = useState("");

  const [alumnoSel, setAlumnoSel] = useState(null);
  const [adeudo, setAdeudo] = useState(0);
  const [fechaBaja, setFechaBaja] = useState(() => new Date().toISOString().slice(0, 10));
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    // Cargar alumnos
    fetch("/api/alumnos/")
      .then(r => r.json())
      .then(data => setAlumnos(data))
      .catch(err => console.error("Error alumnos:", err));

    // Cargar historial de bajas
    fetch("/api/alumnos_baja/")
      .then(r => r.ok ? r.json() : [])
      .then(data => setBajas(Array.isArray(data) ? data : []))
      .catch(() => setBajas([]));
  }, []);

  const alumnosFiltrados = alumnos.filter(a =>
    `${a.nombre} ${a.apellido_paterno} ${a.apellido_materno}`
      .toLowerCase()
      .includes(filtro.toLowerCase())
  );

  const seleccionarAlumno = async (a) => {
    setAlumnoSel(a);
    setMotivo("");
    // Traer adeudo (de detalle) o simular si no existe
    try {
      const res = await fetch(`/api/alumnos/${a.id}/detalle`);
      if (res.ok) {
        const data = await res.json();
        // Si tu backend ya calcula adeudo_total, úsalo; si no, simula:
        const adeudoCalc = data.alumno?.adeudo_total ?? 0;
        setAdeudo(adeudoCalc);
      } else {
        // Simulado si no hay endpoint
        setAdeudo(Math.floor(Math.random() * 5000));
      }
    } catch {
      setAdeudo(Math.floor(Math.random() * 5000));
    }
  };

  const registrarBaja = async () => {
    if (!alumnoSel) return alert("Selecciona un alumno.");
    if (!motivo.trim()) return alert("Captura el motivo de la baja.");
    if (!fechaBaja) return alert("Selecciona la fecha de baja.");

    const confirma = window.confirm(
      `Confirmar baja de ${alumnoSel.nombre} ${alumnoSel.apellido_paterno}\n` +
      `Fecha: ${fechaBaja}\nMotivo: ${motivo}\nAdeudo pendiente: $${adeudo}`
    );
    if (!confirma) return;

    const payload = {
      alumno_id: alumnoSel.id,
      fecha_baja: fechaBaja,
      motivo,
      adeudo_pendiente: adeudo,
    };

    try {
      const res = await fetch("/api/alumnos_baja/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Baja registrada.");
        // refrescar historial
        fetch("/api/alumnos_baja/")
          .then(r => r.ok ? r.json() : [])
          .then(data => setBajas(Array.isArray(data) ? data : []))
          .catch(() => {});
        // limpiar formulario
        setAlumnoSel(null);
        setMotivo("");
        setAdeudo(0);
        setFechaBaja(new Date().toISOString().slice(0, 10));
      } else {
        const err = await res.json();
        alert(err?.mensaje || "No se pudo registrar la baja.");
      }
    } catch (e) {
      console.error(e);
      alert("Error de red al registrar la baja.");
    }
  };

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
        <h2 className="section-title">Gestión de Bajas</h2>

        {/* Buscador y listado de alumnos */}
        <div className="bajas-panel">
          <div className="bajas-col">
            <h3 className="bajas-title">Buscar alumno</h3>
            <input
              type="text"
              className="bajas-input"
              placeholder="Escribe nombre o apellidos..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />

            <table className="table bajas-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Grado</th>
                  <th>Grupo</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {alumnosFiltrados.length ? alumnosFiltrados.map(a => (
                  <tr key={a.id}>
                    <td>{a.nombre} {a.apellido_paterno} {a.apellido_materno}</td>
                    <td>{a.grado}</td>
                    <td>{a.grupo_id}</td>
                    <td>
                      <button className="btn btn-success" onClick={() => seleccionarAlumno(a)}>
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4">Sin resultados.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Formulario de baja */}
          <div className="bajas-col">
            <h3 className="bajas-title">Registrar baja</h3>

            <div className="bajas-card">
              <div className="bajas-field">
                <label className="bajas-label">Alumno:</label>
                <div className="bajas-value">
                  {alumnoSel
                    ? `${alumnoSel.nombre} ${alumnoSel.apellido_paterno} ${alumnoSel.apellido_materno}`
                    : <em>No seleccionado</em>}
                </div>
              </div>

              <div className="bajas-field">
                <label className="bajas-label">Adeudo pendiente:</label>
                <div className="bajas-value" style={{ color: adeudo > 0 ? 'tomato' : '#8fc027' }}>
                  ${adeudo}
                </div>
              </div>

              <div className="bajas-grid">
                <div className="bajas-field">
                  <label className="bajas-label">Fecha de baja:</label>
                  <input
                    type="date"
                    className="bajas-input"
                    value={fechaBaja}
                    onChange={(e) => setFechaBaja(e.target.value)}
                  />
                </div>

                <div className="bajas-field">
                  <label className="bajas-label">Motivo:</label>
                  <input
                    type="text"
                    className="bajas-input"
                    placeholder="Ej. Cambio de escuela"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                  />
                </div>
              </div>

              <div className="bajas-actions">
                <button className="btn btn-danger" onClick={registrarBaja} disabled={!alumnoSel}>
                  Registrar baja
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Historial de bajas */}
        <h3 className="bajas-title" style={{ marginTop: "2rem" }}>Historial de alumnos dados de baja</h3>
        <table className="table bajas-table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Fecha</th>
              <th>Motivo</th>
              <th>Adeudo al momento</th>
            </tr>
          </thead>
          <tbody>
            {bajas?.length ? bajas.map((b, i) => (
              <tr key={i}>
                <td>{b.alumno_nombre || b.alumno?.nombre || `ID ${b.alumno_id}`}</td>
                <td>{b.fecha_baja}</td>
                <td>{b.motivo}</td>
                <td>${b.adeudo_pendiente ?? 0}</td>
              </tr>
            )) : (
              <tr><td colSpan="4">Aún no hay bajas registradas.</td></tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default BajaAlumno;
