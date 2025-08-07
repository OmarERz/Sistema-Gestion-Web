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
      const res = await fetch("/api/grupos");
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
      const res = await fetch("/api/grupos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ grado, grupo, ciclo_escolar: cicloEscolar }),
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

  return (
    <div className="layout">
        <nav className="sidebar">
        <Link className="logo" to="/index">Inicio</Link>
        <Link className="nav-item" to="/gestionGrupos">Gestión de Grupos</Link>
        <Link className="nav-item" to="/registroPagos">Registro de Pagos</Link>
        <Link className="nav-item" to="/historialPagos">Historial de Pagos</Link>
        <Link className="nav-item" to="/">Gestión de Bajas</Link>
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
        </div>
    </div>
  );
};

export default GestionGrupos;