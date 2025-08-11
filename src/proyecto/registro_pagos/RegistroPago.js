// src/componentes/RegistroPago.js
import React, { useEffect, useState, useMemo } from 'react';
import './RegistroPago.css';
import { Link } from "react-router-dom";

const RegistroPago = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState('');

  // tipoPago ahora es el ID REAL del concepto (string o number)
  const [tipoPago, setTipoPago] = useState(''); // concepto_id seleccionado
  const [conceptos, setConceptos] = useState([]);

  const [mes, setMes] = useState('');
  const [descuento, setDescuento] = useState(0);
  const [recargo, setRecargo] = useState(0);
  const [montoBase, setMontoBase] = useState(0);

  const [fechaLimite, setFechaLimite] = useState('');

  // Uniformes
  const [uniformes, setUniformes] = useState([]);
  const [nuevoUniforme, setNuevoUniforme] = useState({ prenda: '', talla: '', entregado: false });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helpers
  const normalize = (s = '') =>
    s.toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  // Concepto seleccionado (objeto) a partir del ID
  const conceptoSeleccionado = useMemo(() => {
    if (!tipoPago) return null;
    const idNum = Number(tipoPago);
    return conceptos.find(c => Number(c.id) === idNum) || null;
  }, [tipoPago, conceptos]);

  // Mostrar sección de uniformes si el nombre del concepto contiene “uniforme”
  const esUniformes = useMemo(() => {
    const nombre = conceptoSeleccionado?.nombre || '';
    return normalize(nombre).includes('uniforme');
  }, [conceptoSeleccionado]);

  // Mostrar selector de mes solo si el concepto contiene “colegiatura”
  const esColegiatura = useMemo(() => {
    const nombre = conceptoSeleccionado?.nombre || '';
    return normalize(nombre).includes('colegiatura') || normalize(nombre).includes('mensualidad');
  }, [conceptoSeleccionado]);

  // Cargar alumnos y conceptos
  useEffect(() => {
    fetch('/api/alumnos/')
      .then(res => res.json())
      .then(setAlumnos)
      .catch(err => console.error('Error alumnos:', err));

    fetch('/api/conceptos_pago/')
      .then(res => res.json())
      .then(setConceptos)
      .catch(err => console.error('Error conceptos:', err));
  }, []);

  const calcularMontoFinal = () => {
    const base = Number(montoBase) || 0;
    const desc = (Number(descuento) / 100) * base;
    const rec  = (Number(recargo) / 100) * base;
    return base - desc + rec;
  };

  const agregarUniforme = () => {
    if (nuevoUniforme.prenda.trim() && nuevoUniforme.talla.trim()) {
      setUniformes(prev => [...prev, nuevoUniforme]);
      setNuevoUniforme({ prenda: '', talla: '', entregado: false });
    }
  };

  const resetFormulario = () => {
    setAlumnoSeleccionado('');
    setTipoPago('');
    setMes('');
    setDescuento(0);
    setRecargo(0);
    setMontoBase(0);
    setUniformes([]);
    setNuevoUniforme({ prenda: '', talla: '', entregado: false });
    setFechaLimite('');
    setError('');
  };

  const enviarPago = async () => {
    setError('');

    // Validaciones mínimas
    if (!alumnoSeleccionado) return setError('Selecciona un alumno.');
    if (!tipoPago) return setError('Selecciona un tipo de pago.');
    if (!montoBase || Number.isNaN(Number(montoBase))) return setError('Ingresa un monto base válido.');
    if (!fechaLimite) return setError('Selecciona la fecha límite de pago.');
    if (esColegiatura && !mes) return setError('Selecciona el mes para colegiatura.');
    if (esUniformes && uniformes.length === 0) return setError('Agrega al menos una prenda de uniforme.');

    // Construir payload del pago
    const hoyISO = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const montoFinal = Number(calcularMontoFinal().toFixed(2));

    const pagoPayload = {
      fecha_pago: hoyISO,               // el endpoint de pagos espera la fecha de registro
      monto: montoFinal,
      descuento: Number(descuento),
      recargo: Number(recargo),
      pagado: false,
      estado_pago: 'Pendiente',
      alumno_id: Number(alumnoSeleccionado),
      concepto_id: Number(tipoPago)     // usar el ID real del select
      
    };

    try {
      setLoading(true);

      // 1) Crear el pago
      const resPago = await fetch('/api/pagos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pagoPayload)
      });
      if (!resPago.ok) {
        const txt = await resPago.text();
        throw new Error(txt || 'No se pudo registrar el pago');
      }
      const pagoCreado = await resPago.json();
      const pagoId = pagoCreado?.id;
      console.log('Pago creado:', pagoId);

      // 2) Si es uniformes: crear cada uniforme y vincularlo como pendiente
      if (esUniformes && uniformes.length > 0) {
        for (const item of uniformes) {
          // 2.1) Crear prenda en catálogo (si ya tienes catálogo con IDs, usa el existente y omite este paso)
          const resUni = await fetch('/api/uniformes/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prenda: item.prenda,
              talla: item.talla,
              precio_base: 0
            })
          });
          if (!resUni.ok) {
            const txtU = await resUni.text();
            throw new Error(txtU || 'Falló crear el uniforme');
          }
          const uniCreado = await resUni.json(); // { id: ... }

          // 2.2) Vincular alumno-uniforme (pendiente/entregado)
          const resUP = await fetch('/api/uniformes_pendientes/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              alumno_id: Number(alumnoSeleccionado),
              uniforme_id: Number(uniCreado.id),
              entregado: !!item.entregado
            })
          });
          if (!resUP.ok) {
            const txtUP = await resUP.text();
            throw new Error(txtUP || 'Falló crear el uniforme pendiente');
          }
        }
      }

      alert('¡Pago registrado correctamente!');
      resetFormulario();
    } catch (e) {
      console.error(e);
      setError(e.message || 'Error desconocido al registrar el pago');
    } finally {
      setLoading(false);
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

      <div className="registro-pago">
        <div className="form-container">
          <h2>Registro de Pago</h2>

          {error && <div className="alert error">{error}</div>}
          {loading && <div className="alert info">Guardando...</div>}

          <div className="form-row">
            <select
              value={alumnoSeleccionado}
              onChange={(e) => setAlumnoSeleccionado(e.target.value)}
              required
            >
              <option value="">Selecciona un alumno</option>
              {alumnos.map((al) => (
                <option key={al.id} value={al.id}>
                  {al.nombre} {al.apellido_paterno}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            {/* Tipo de pago = concepto_id real */}
            <select
              value={tipoPago}
              onChange={(e) => setTipoPago(e.target.value)}
              required
            >
              <option value="">Tipo de pago</option>
              {conceptos.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>

            {esColegiatura && (
              <select value={mes} onChange={(e) => setMes(e.target.value)}>
                <option value="">Mes</option>
                {[
                  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
                  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
                ].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            )}
          </div>

          <div className="form-row">
            <div className="input-block">
              <label>Monto base:</label>
              <input
                type="number"
                placeholder="Ej. 1000"
                value={montoBase}
                onChange={(e) => setMontoBase(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label>Descuento (%):</label>
              <span style={{ fontSize: '0.8rem', color: '#ccc' }}>
                (se descuenta del monto base)
              </span>
              <input
                type="number"
                value={descuento}
                onChange={(e) => setDescuento(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label>Recargo (%):</label>
              <span style={{ fontSize: '0.8rem', color: '#ccc' }}>
                (se suma al monto base)
              </span>
              <input
                type="number"
                value={recargo}
                onChange={(e) => setRecargo(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-block">
              <label>Fecha límite de pago:</label>
              <input
                type="date"
                value={fechaLimite}
                onChange={(e) => setFechaLimite(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row monto-final">
            Monto Final: ${calcularMontoFinal().toFixed(2)}
          </div>

          {esUniformes && (
            <>
              <h3>Uniformes</h3>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Prenda"
                  value={nuevoUniforme.prenda}
                  onChange={(e) => setNuevoUniforme({ ...nuevoUniforme, prenda: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Talla"
                  value={nuevoUniforme.talla}
                  onChange={(e) => setNuevoUniforme({ ...nuevoUniforme, talla: e.target.value })}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={nuevoUniforme.entregado}
                    onChange={(e) => setNuevoUniforme({ ...nuevoUniforme, entregado: e.target.checked })}
                  />
                  Entregado
                </label>
                <button className="btn btn-primary" type="button" onClick={agregarUniforme}>
                  Agregar
                </button>
              </div>

              <ul>
                {uniformes.map((u, i) => (
                  <li key={i}>
                    {u.prenda} - {u.talla} - {u.entregado ? 'Entregado' : 'Pendiente'}
                  </li>
                ))}
              </ul>
            </>
          )}

          <button className="btn btn-primary" onClick={enviarPago}>
            Registrar Pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistroPago;
