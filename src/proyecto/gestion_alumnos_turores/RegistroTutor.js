// src/proyecto/RegistroAlumno.js
import React, { useState } from 'react';
import "../gestion_alumnos_turores/RegistroA.css";

function RegistroTutor() {
  const [tutor, setTutor] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    fecha_nacimiento: '',
  });

    const [mostrarFacturacion, setMostrarFacturacion] = useState(false);
    const [facturacion, setFacturacion] = useState({
        rfc: '',
        razon_social: '',
        domicilio: '',
        uso_cfdi: ''
    });



  const handleChange = (e) => {
    setTutor({ ...tutor, [e.target.name]: e.target.value });
  };

  const handleFacturacionChange = (e) => {
    setFacturacion({ ...facturacion, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...tutor,
      ...(mostrarFacturacion ? { facturacion } : {})  // incluye facturación solo si aplica
    };

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tutor),
      });

      if (res.ok) {
        alert('Tutor registrado con éxito');
        setTutor({ nombre: '', 
            apellido_paterno: '', 
            apellido_materno: '', 
            fecha_nacimiento: '',
        });
        setFacturacion({
          rfc: '',
          razon_social: '',
          domicilio: '',
          uso_cfdi: ''
        });
        setMostrarFacturacion(false);
      } else {
        const err = await res.json();
        alert('Error al registrar tutor: ' + (err.mensaje || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al registrar tutor:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  return (
    <div className="form-container">
        <form className="registro-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Registro de Tutor</h2>

            <div className="form-row">
                <input type="text" name="nombre" placeholder="Nombre" value={tutor.nombre} onChange={handleChange} required />
                <input type="text" name="apellido_paterno" placeholder="Apellido Paterno" value={tutor.apellido_paterno} onChange={handleChange} required />
            </div>

            <div className="form-row">
                <input type="text" name="apellido_materno" placeholder="Apellido Materno" value={tutor.apellido_materno} onChange={handleChange} required />
                <input type="date" name="fecha_nacimiento" value={tutor.fecha_nacimiento} onChange={handleChange} required />
            </div>
            
            {/* Sección de facturación */}
            <div className='form-row'>
                <label style={{color: "white"}}>
                    <input type='checkbox' checked={mostrarFacturacion}
                     onChange={(e)=> setMostrarFacturacion(e.target.checked)} >
                    </input>
                    &nbsp; ¿Requiere factura?
                </label>
            </div>

            {mostrarFacturacion && (
                <>
                    <div className="form-row">
                        <input
                        type="text"
                        name="rfc"
                        placeholder="RFC"
                        value={facturacion.rfc}
                        onChange={handleFacturacionChange}
                        />
                        <input
                        type="text"
                        name="razon_social"
                        placeholder="Razón Social"
                        value={facturacion.razon_social}
                        onChange={handleFacturacionChange}
                        />
                    </div>
                    <div className="form-row">
                        <input
                        type="text"
                        name="domicilio"
                        placeholder="Domicilio Fiscal"
                        value={facturacion.domicilio}
                        onChange={handleFacturacionChange}
                        />
                        <select
                        name="uso_cfdi"
                        value={facturacion.uso_cfdi}
                        onChange={handleFacturacionChange}
                        >
                        <option value="">Seleccione uso de CFDI</option>
                        <option value="G01">G01 - Adquisición de mercancías</option>
                        <option value="G03">G03 - Gastos en general</option>
                        <option value="P01">P01 - Por definir</option>
                        </select>
                    </div>
                </>
            )}
        
            <div className="form-actions">
                <button type="submit" className="btn btn-primary">Registrar RegistroTutor</button>
            </div>
        </form>
    </div>
  );
}

export default RegistroTutor;
