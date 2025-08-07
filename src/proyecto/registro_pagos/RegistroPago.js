// src/componentes/RegistroPago.js
import React, { useEffect, useState } from 'react';
import './RegistroPago.css'; // crea este archivo para estilos si gustas
import { Link } from "react-router-dom";


const RegistroPago = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('');
  const [tipoPago, setTipoPago] = useState('');
  const [mes, setMes] = useState('');
  const [descuento, setDescuento] = useState(0);
  const [recargo, setRecargo] = useState(0);
  const [montoBase, setMontoBase] = useState(0);
  const [uniformes, setUniformes] = useState([]);
  const [nuevoUniforme, setNuevoUniforme] = useState({ prenda: '', talla: '', entregado: false });

  useEffect(() => {
    // Cargar alumnos
    fetch('/api/alumnos')
      .then(res => res.json())
      .then(data => setAlumnos(data))
      .catch(err => console.error('Error al obtener alumnos', err));
  }, []);

  const calcularMontoFinal = () => {
    const desc = (descuento / 100) * montoBase;
    const rec = (recargo / 100) * montoBase;
    return montoBase - desc + rec;
  };

  const agregarUniforme = () => {
    if (nuevoUniforme.prenda && nuevoUniforme.talla) {
      setUniformes([...uniformes, nuevoUniforme]);
      setNuevoUniforme({ prenda: '', talla: '', entregado: false });
    }
  };

  const enviarPago = () => {
    // Aquí iría la lógica para enviar los datos al backend
    console.log({
      alumnoSeleccionado,
      tipoPago,
      mes,
      descuento,
      recargo,
      montoFinal: calcularMontoFinal(),
      uniformes
    });
    alert('Pago registrado (simulado)');
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

      <div className="registro-pago">
        <div className="form-container">
          <h2>Registro de Pago</h2>

          <div className="form-row">
            <select value={alumnoSeleccionado} onChange={(e) => setAlumnoSeleccionado(e.target.value)} required>
              <option value="">Selecciona un alumno</option>
              {alumnos.map((al) => (
                <option key={al.id} value={al.id}>
                  {al.nombre} {al.apellido_paterno}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <select value={tipoPago} onChange={(e) => setTipoPago(e.target.value)} required>
              <option value="">Tipo de pago</option>
              <option value="inscripcion">Inscripción</option>
              <option value="colegiatura">Colegiatura</option>
              <option value="material">Material</option>
              <option value="seguro">Seguro</option>
              <option value="uniformes">Uniformes</option>
              <option value="actividades">Actividades Extraescolares</option>
            </select>

            {tipoPago === 'colegiatura' && (
              <select value={mes} onChange={(e) => setMes(e.target.value)}>
                <option value="">Mes</option>
                {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            )}
          </div>

          <div className="form-row">
            <div className="input-block">
                <label> Monto base: </label>
                <input
                type="number"
                placeholder="Ej. 1000"
                value={montoBase}
                onChange={(e) => setMontoBase(Number(e.target.value))}
                />
            </div>

            <div className="input-block">
                <label>Descuento (%):</label>
                <span style={{ fontSize: '0.8rem', color: '#ccc' }}>(se descuenta del monto base)</span>
                <input
                type="number"
                value={descuento}
                onChange={(e) => setDescuento(Number(e.target.value))}
                />
            </div>

            <div className="input-block">
                <label>Recargo (%):</label>
                <span style={{ fontSize: '0.8rem', color: '#ccc' }}>(se suma al monto base)</span>
                <input
                type="number"
                value={recargo}
                onChange={(e) => setRecargo(Number(e.target.value))}
                />
            </div>
          </div>

          <div className="form-row monto-final">
            Monto Final: ${calcularMontoFinal().toFixed(2)}
          </div>

          <h3>Uniformes</h3>
          <div className="form-row">
            <input type="text" placeholder="Prenda" value={nuevoUniforme.prenda} onChange={(e) => setNuevoUniforme({ ...nuevoUniforme, prenda: e.target.value })} />
            <input type="text" placeholder="Talla" value={nuevoUniforme.talla} onChange={(e) => setNuevoUniforme({ ...nuevoUniforme, talla: e.target.value })} />
            <label>
              <input type="checkbox" checked={nuevoUniforme.entregado} onChange={(e) => setNuevoUniforme({ ...nuevoUniforme, entregado: e.target.checked })} />
              Entregado
            </label>
            <button className="btn btn-primary" type="button" onClick={agregarUniforme}>Agregar</button>
          </div>

          <ul>
            {uniformes.map((u, i) => (
              <li key={i}>{u.prenda} - {u.talla} - {u.entregado ? 'Entregado' : 'Pendiente'}</li>
            ))}
          </ul>

          <button className="btn btn-primary" onClick={enviarPago}>Registrar Pago</button>
        </div>
      </div>
            
            
    </div>
  );
};

export default RegistroPago;
