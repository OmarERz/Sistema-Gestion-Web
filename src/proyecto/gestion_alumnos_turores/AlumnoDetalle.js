// AlumnoDetalle.js
import React from "react";

const AlumnoDetalle = ({ alumno, pagos, uniformes, grupos = [], onBack }) => {
  if (!alumno) return null;

  const getGrupoNombre = (id) =>
    grupos.find((g) => g.id === id)?.nombre || "Sin grupo";

  return (
    <div className="main-content">
      <h2 className="section-title">
        Detalle de {alumno.nombre} {alumno.apellido_paterno}
      </h2>
      <p>
        <strong>Grado:</strong> {alumno.grado}
      </p>
      <p>
        <strong>Grupo:</strong> {getGrupoNombre(alumno.grupo_id)}
      </p>

      <hr />
      <h3>Historial de Pagos</h3>
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
      ) : (
        <p>No hay pagos registrados.</p>
      )}

      <hr />
      <h3>Uniformes</h3>
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
      ) : (
        <p>No hay uniformes registrados.</p>
      )}

      <div className="form-actions">
        <button className="btn btn-primary" onClick={onBack}>
          ⬅️ Volver
        </button>
      </div>
    </div>
  );
};

export default AlumnoDetalle;
