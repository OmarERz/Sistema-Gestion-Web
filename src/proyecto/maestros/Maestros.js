import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Maestros.css";

const Maestros = () => {
  const [maestros, setMaestros] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [maestroSel, setMaestroSel] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    telefono: "",
    correo: ""
  });

  const fetchMaestros = async () => {
    try {
      const res = await fetch("/api/maestros/");
      if (!res.ok) throw new Error(await res.text());
      setMaestros(await res.json());
    } catch (err) {
      console.error("Error maestros:", err);
    }
  };

  const fetchPagos = async (id) => {
    try {
      const res = await fetch("/api/pagos_maestros/");
      if (!res.ok) throw new Error(await res.text());
      const all = await res.json();
      setPagos(all.filter((p) => p.maestro_id === id));
    } catch (err) {
      console.error("Error pagos:", err);
    }
  };

  const fetchAsistencias = async (id) => {
    try {
      const res = await fetch("/api/asistencias_maestros/");
      if (!res.ok) throw new Error(await res.text());
      const all = await res.json();
      setAsistencias(all.filter((a) => a.maestro_id === id));
    } catch (err) {
      console.error("Error asistencias:", err);
    }
  };

  useEffect(() => {
    fetchMaestros();
  }, []);

  const seleccionarMaestro = (m) => {
    setMaestroSel(m);
    fetchPagos(m.id);
    fetchAsistencias(m.id);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const crearMaestro = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/maestros/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error(await res.text());
      setForm({
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        telefono: "",
        correo: ""
      });
      fetchMaestros();
    } catch (err) {
      console.error("Error creando maestro:", err);
    }
  };

  const eliminarMaestro = async (id) => {
    if (!window.confirm("¿Eliminar maestro?")) return;
    try {
      const res = await fetch(`/api/maestros/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      fetchMaestros();
      setMaestroSel(null);
      setPagos([]);
      setAsistencias([]);
    } catch (err) {
      console.error("Error eliminando maestro:", err);
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
        <Link className="nav-item" to="/gastos">Gastos</Link>
        <Link className="nav-item" to="/maestros">Maestros</Link>
      </nav>

      <main className="main-content-maestros">
        <div className="card-maestros">
          <h2 className="title-maestros">Gestión de Maestros</h2>
          <form onSubmit={crearMaestro} className="form-maestros">
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required className="input-maestros"/>
            <input name="apellido_paterno" value={form.apellido_paterno} onChange={handleChange} placeholder="Apellido paterno" required className="input-maestros"/>
            <input name="apellido_materno" value={form.apellido_materno} onChange={handleChange} placeholder="Apellido materno" required className="input-maestros"/>
            <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" required className="input-maestros"/>
            <input name="correo" value={form.correo} onChange={handleChange} placeholder="Correo" className="input-maestros"/>
            <button type="submit" className="btn-primary-maestros">Agregar Maestro</button>
          </form>
        </div>

        <div className="card-maestros">
          <h3 className="subtitle-maestros">Lista de Maestros</h3>
          <table className="table-maestros">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {maestros.map((m) => (
                <tr key={m.id}>
                  <td>{m.nombre} {m.apellido_paterno} {m.apellido_materno}</td>
                  <td>{m.telefono}</td>
                  <td>{m.correo}</td>
                  <td>
                    <button onClick={() => seleccionarMaestro(m)} className="btn-secondary-maestros">Ver</button>
                    <button onClick={() => eliminarMaestro(m.id)} className="btn-danger-maestros">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {maestroSel && (
          <div className="card-maestros">
            <h3 className="subtitle-maestros">Pagos de {maestroSel.nombre}</h3>
            <table className="table-maestros">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Monto Base</th>
                  <th>Descuento</th>
                  <th>Monto Final</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.fecha_pago}</td>
                    <td>{p.monto_base}</td>
                    <td>{p.descuento}</td>
                    <td>{p.monto_final}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="subtitle-maestros">Asistencias</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {asistencias.map((a) => (
                  <tr key={a.id}>
                    <td>{a.fecha}</td>
                    <td>{a.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Maestros;
