import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./GestionGrupos.css";
import "../styles.css";

const GestionGrupos = () => {
  const [grado, setGrado] = useState("");
  const [grupo, setGrupo] = useState("");
  const [cicloEscolar, setCicloEscolar] = useState("");
  const [grupos, setGrupos] = useState([
  ]);

  const obtenerGrupos = async () => {
    try {
      const res = await fetch("/api/grupos/");
      if (res.ok) {
        const data = await res.json();
        setGrupos(data);
      }
    } catch (error) {
      console.error("Error al obtener grupos:", error);
    }
  };

  useEffect(() => {
    obtenerGrupos();
  }, []);

  const agregarGrupo = async () => {
    if (!grado || !grupo || !cicloEscolar) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    try {
      const res = await fetch("/api/grupos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
         nombre: grupo,          
         grado: grado,
         orden_promocion: 1      
       })
,
      });

      if (res.ok) {
        setGrado("");
        setGrupo("");
        setCicloEscolar("");
        obtenerGrupos();
      } else {
        alert("Error al agregar grupo.");
      }
    } catch (err) {
      console.error("Error al agregar grupo:", err);
    }
  };

  const eliminarGrupo = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este grupo?")) return;

    try {
      const res = await fetch(`/api/grupos/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setGrupos(grupos.filter((g) => g.id !== id));
      } else {
        alert("No se pudo eliminar el grupo.");
      }
    } catch (err) {
      console.error("Error al eliminar grupo:", err);
    }
  };

  // ---------- CICLOS ESCOLARES ----------
  const [ciclos, setCiclos] = useState([]);
  const [cicloNombre, setCicloNombre] = useState("");        // Ej. 2025-2026
  const [cicloInicio, setCicloInicio] = useState("");
  const [cicloFin, setCicloFin] = useState("");

  const obtenerCiclos = async () => {
    try {
      const res = await fetch("/api/ciclos/");
      if (res.ok) {
        const data = await res.json();
        setCiclos(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Error al obtener ciclos:", e);
    }
  };

  const agregarCiclo = async () => {
    if (!cicloNombre.trim() || !cicloInicio || !cicloFin) {
      alert("Completa nombre, fecha de inicio y fecha de fin.");
      return;
    }
    if (new Date(cicloFin) < new Date(cicloInicio)) {
      alert("La fecha de fin no puede ser menor a la de inicio.");
      return;
    }
    // Validación rápida de duplicados por nombre
    const existe = ciclos.some(
      (c) => (c.nombre || "").toLowerCase() === cicloNombre.trim().toLowerCase()
    );
    if (existe) {
      alert("Ya existe un ciclo con ese nombre.");
      return;
    }

    try {
      const res = await fetch("/api/ciclos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: cicloNombre,
          fecha_inicio: cicloInicio,
          fecha_fin: cicloFin,
          activo: 1,
        }),
      });

      if (res.ok) {
        setCicloNombre("");
        setCicloInicio("");
        setCicloFin("");
        obtenerCiclos();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err?.mensaje || "No se pudo crear el ciclo.");
      }
    } catch (e) {
      console.error(e);
      alert("Error de red al crear ciclo.");
    }
  };

  const eliminarCiclo = async (id) => {
    if (!window.confirm("¿Eliminar este ciclo escolar?")) return;
    try {
      const res = await fetch(`/api/ciclos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCiclos(ciclos.filter((c) => c.id !== id));
      } else {
        alert("No se pudo eliminar el ciclo (verifica dependencias).");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ---------- EFECTO INICIAL ----------
  useEffect(() => {
    obtenerGrupos();
    obtenerCiclos();
  }, []);

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

        <div className="main-content">
        <h2 className="section-title">Gestión de Grupos</h2>

        <div className="form-grid">
            <input
            type="text"
            placeholder="Grado"
            value={grado}
            onChange={(e) => setGrado(e.target.value)}
            />
            <input
            type="text"
            placeholder="Grupo"
            value={grupo}
            onChange={(e) => setGrupo(e.target.value)}
            />
            <input
            type="text"
            placeholder="Ciclo Escolar"
            value={cicloEscolar}
            onChange={(e) => setCicloEscolar(e.target.value)}
            />
        </div>

        <button className="btn btn-success" onClick={agregarGrupo}>
            Agregar Grupo
        </button>

        <table className="table">
            <thead>
            <tr>
                <th>Grado</th>
                <th>Grupo</th>
                <th>Ciclo Escolar</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
                {grupos.length > 0 ? (
                    grupos.map((g) => (
                    <tr key={g.id}>
                        <td>{g.grado}</td>
                        <td>{g.grupo}</td>
                        <td>{g.ciclo_escolar}</td>
                        <td>
                            <button className="btn btn-danger" onClick={() => eliminarGrupo(g.id)}>
                                🗑️ Eliminar
                            </button>
                        </td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="4">No hay grupos registrados.</td>
                    </tr>
                )}
            </tbody>
        </table>

          {/* ====== Sección Ciclos Escolares (NUEVA) ====== */}
          <h2 className="section-title" style={{ marginTop: "2rem" }}>
            Ciclos Escolares
          </h2>

          <div className="ciclos-grid">
            <div className="ciclos-card">
              <h3 className="ciclos-title">Agregar ciclo</h3>
              <div className="ciclos-form">
                <div className="ciclos-block">
                  <label className="ciclos-label">Nombre del ciclo</label>
                  <input
                    type="text"
                    className="ciclos-input"
                    placeholder="Ej. 2025-2026"
                    value={cicloNombre}
                    onChange={(e) => setCicloNombre(e.target.value)}
                  />
                </div>
                <div className="ciclos-block">
                  <label className="ciclos-label">Fecha de inicio</label>
                  <input
                    type="date"
                    className="ciclos-input"
                    value={cicloInicio}
                    onChange={(e) => setCicloInicio(e.target.value)}
                  />
                </div>
                <div className="ciclos-block">
                  <label className="ciclos-label">Fecha de fin</label>
                  <input
                    type="date"
                    className="ciclos-input"
                    value={cicloFin}
                    onChange={(e) => setCicloFin(e.target.value)}
                  />
                </div>
              </div>

              <button className="btn btn-success" onClick={agregarCiclo}>
                Agregar ciclo
              </button>
            </div>

            <div className="ciclos-card">
              <h3 className="ciclos-title">Ciclos registrados</h3>
              <table className="table ciclos-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {ciclos.length ? (
                    ciclos.map((c) => (
                      <tr key={c.id}>
                        <td>{c.nombre}</td>
                        <td>{c.fecha_inicio}</td>
                        <td>{c.fecha_fin}</td>
                        <td>
                          <button className="btn btn-danger" onClick={() => eliminarCiclo(c.id)}>
                            🗑️ Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4">No hay ciclos registrados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
    </div>
  );
};

export default GestionGrupos;