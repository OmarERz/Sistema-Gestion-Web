// src/componentes/gastos.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Gastos.css";

const Gastos = () => {
  const [gastos, setGastos] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fecha, setFecha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarGastos = async () => {
    try {
      const res = await fetch("/api/gastos/");
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setGastos(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar los gastos.");
    }
  };

  useEffect(() => {
    cargarGastos();
  }, []);

  const limpiarForm = () => {
    setDescripcion("");
    setMonto("");
    setCategoria("");
    setFecha("");
    setError("");
  };

  const crearGasto = async (e) => {
    e.preventDefault();
    setError("");

    if (!descripcion.trim()) return setError("Escribe una descripción.");
    if (!monto || Number(monto) <= 0) return setError("Ingresa un monto válido.");
    if (!categoria.trim()) return setError("Escribe una categoría.");
    if (!fecha) return setError("Selecciona una fecha.");

    try {
      setLoading(true);
      const res = await fetch("/api/gastos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion: descripcion.trim(),
          monto: Number(monto),
          categoria: categoria.trim(),
          fecha, // YYYY-MM-DD
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      await res.json();
      limpiarForm();
      cargarGastos();
    } catch (e) {
      console.error(e);
      setError("No se pudo guardar el gasto.");
    } finally {
      setLoading(false);
    }
  };

  const eliminarGasto = async (id) => {
    if (!window.confirm("¿Eliminar este gasto?")) return;
    try {
      const res = await fetch(`/api/gastos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setGastos((prev) => prev.filter((g) => g.id !== id));
    } catch (e) {
      console.error(e);
      setError("No se pudo eliminar el gasto.");
    }
  };

  const moneda = (n) =>
    (Number(n) || 0).toLocaleString("es-MX", { style: "currency", currency: "MXN" });

  const total = gastos.reduce((acc, g) => acc + Number(g.monto || 0), 0);

  return (
    <div className="layout">
      <nav className="sidebar">
        <Link className="logo" to="/index">Inicio</Link>
        <Link className="nav-item" to="/gestionGrupos">Gestión de Grupos</Link>
        <Link className="nav-item" to="/registroPagos">Registro de Pagos</Link>
        <Link className="nav-item" to="/historialPagos">Historial de Pagos</Link>
        <Link className="nav-item" to="/bajaAlumno">Gestión de Bajas</Link>
        <Link className="nav-item" to="/descarga">Descarga de Reportes</Link>
        <Link className="nav-item" to="/gastos">Gastos</Link>
        <Link className="nav-item" to="/maestros">Maestros</Link>
      </nav>

      <main className="main-content-gastos">
        <div className="center-gastos">
                <div className="card-gastos">
                <h2 className="title-gastos">Registro de Gastos</h2>

                {error && <div className="alert-gastos error-gastos">{error}</div>}
                {loading && <div className="alert-gastos info-gastos">Guardando...</div>}

                <form onSubmit={crearGasto} className="form-gastos">
                    <div className="row-gastos">
                    <div className="field-gastos">
                        <label className="label-gastos">Descripción</label>
                        <input
                        className="input-gastos"
                        type="text"
                        placeholder="Ej. Compra de marcadores"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        />
                    </div>

                    <div className="field-gastos">
                        <label className="label-gastos">Monto</label>
                        <input
                        className="input-gastos"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        />
                    </div>
                    </div>

                    <div className="row-gastos">
                    <div className="field-gastos">
                        <label className="label-gastos">Categoría</label>
                        <input
                        className="input-gastos"
                        type="text"
                        placeholder="La decides tú (ej. Papelería)"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        />
                    </div>

                    <div className="field-gastos">
                        <label className="label-gastos">Fecha</label>
                        <input
                        className="input-gastos"
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        />
                    </div>
                    </div>

                    <div className="actions-gastos">
                    <button type="submit" className="btn-primary-gastos">Guardar gasto</button>
                    </div>

                    <div className="total-gastos">
                    <strong>Total:</strong> {moneda(total)}
                    </div>
                </form>
                </div>

                <div className="card-gastos">
                <h3 className="subtitle-gastos">Listado de Gastos</h3>
                <table className="table-gastos">
                    <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Descripción</th>
                        <th>Categoría</th>
                        <th style={{ textAlign: "right" }}>Monto</th>
                        <th style={{ width: 120 }}>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {gastos.length ? (
                        gastos.map((g) => (
                        <tr key={g.id}>
                            <td>{g.fecha}</td>
                            <td>{g.descripcion}</td>
                            <td>{g.categoria}</td>
                            <td style={{ textAlign: "right" }}>{moneda(g.monto)}</td>
                            <td>
                            <button
                                className="btn-danger-gastos"
                                onClick={() => eliminarGasto(g.id)}
                                type="button"
                            >
                                Eliminar
                            </button>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="5" style={{ textAlign: "center", opacity: 0.8 }}>
                            No hay gastos registrados.
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </div>
        </main>
        </div>
    );
    };

    export default Gastos;
