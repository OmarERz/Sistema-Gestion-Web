// src/proyecto/RegistroAlumno.js
import React, { useEffect, useState } from 'react';
// import "./RegistroA.css";
import TutorForm  from './TutorForm';

function RegistroAlumno() {
    const [alumno, setAlumno] = useState({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        fecha_nacimiento: '',
        grado: '',
        grupo_id: '',
        ciclo_id: '',
    });
  
    const [mostrarFacturacion, setMostrarFacturacion] = useState(false);
    const [facturacion, setFacturacion] = useState({
        rfc: '',
        razon_social: '',
        domicilio: '',
        uso_cfdi: ''
    });

    const [tutor1, setTutor1] = useState({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        telefono: '',
        correo: '',
        relacion_con_alumno: ''
    });

    const [mostrarTutor2, setMostrarTutor2] = useState(false);
    const [tutor2, setTutor2] = useState({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        telefono: '',
        correo: '',
        relacion_con_alumno: ''
    });


  const [grupos, setGrupos] = useState([]);
  const [ciclos, setCiclos] = useState([]);

  useEffect(() => {
    // Cargar grupos desde la API
    fetch('/api/grupos')
      .then(res => res.json())
      .then(data => setGrupos(data))
      .catch(err => console.error('Error al cargar grupos:', err));

    // Cargar ciclos desde la API
    fetch('/api/ciclos')
      .then(res => res.json())
      .then(data => setCiclos(data))
      .catch(err => console.error('Error al cargar ciclos:', err));
  }, []);

  const handleChange = (e) => {
    setAlumno({ ...alumno, [e.target.name]: e.target.value });
  };

  const handleFacturacionChange = (e) => {
    setFacturacion({ ...facturacion, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
        ...alumno,
        tutor1,
        ...(mostrarTutor2 ? { tutor2 } : {}),
        ...(mostrarFacturacion ? { facturacion } : {})
    };


    try {
      const res = await fetch('/api/alumnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alumno),
      });

      if (res.ok) {
        alert('Alumno y tutores registrados con éxito');
        setAlumno({ nombre: '', 
            apellido_paterno: '', 
            apellido_materno: '', 
            fecha_nacimiento: '',
            grado: '',
            grupo_id: '',
            ciclo_id: '' 
        });
        setTutor1({ nombre: '',
            apellido_paterno: '',
            apellido_materno: '',
            telefono: '',
            correo: '',
            relacion_con_alumno: '' });
        setTutor2({ nombre: '',
            apellido_paterno: '',
            apellido_materno: '',
            telefono: '',
            correo: '',
            relacion_con_alumno: '' });
        
        setFacturacion({
          rfc: '',
          razon_social: '',
          domicilio: '',
          uso_cfdi: ''
        });
        setMostrarFacturacion(false);
      } else {
        const err = await res.json();
        alert('Error al registrar alumno: ' + (err.mensaje || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al registrar alumno:', error);
      alert('Error al conectar con el servidor.');
    }
  };

  return (
    <div className="form-container">
        <form className="registro-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Registro de Alumno</h2>

            <div className="form-row">
                <input type="text" name="nombre" placeholder="Nombre" value={alumno.nombre} onChange={handleChange} required />
                <input type="text" name="apellido_paterno" placeholder="Apellido Paterno" value={alumno.apellido_paterno} onChange={handleChange} required />
            </div>

            <div className="form-row">
                <input type="text" name="apellido_materno" placeholder="Apellido Materno" value={alumno.apellido_materno} onChange={handleChange} required />
                <input type="date" name="fecha_nacimiento" value={alumno.fecha_nacimiento} onChange={handleChange} required />
            </div>

            <div className="form-row">
                <input type="text" name="grado" placeholder="Grado (ej. 3ro Primaria)" value={alumno.grado} onChange={handleChange} required />
                <select name="grupo_id" value={alumno.grupo_id} onChange={handleChange} required>
                <option value="">Seleccione un grupo</option>
                {grupos.map((grupo) => (
                    <option key={grupo.id} value={grupo.id}>{grupo.nombre}</option>
                ))}
                </select>
            </div>

            <div className="form-row">
                <select name="ciclo_id" value={alumno.ciclo_id} onChange={handleChange} required>
                <option value="">Seleccione ciclo escolar</option>
                {ciclos.map((ciclo) => (
                    <option key={ciclo.id} value={ciclo.id}>{ciclo.nombre}</option>
                ))}
                </select>
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
            {/* Tutor Principal */}
            <TutorForm tutor={tutor1} setTutor={setTutor1} titulo="Tutor Principal" requerido={true} />

            {/* Segundo tutor opcional */}
            <div className="form-row">
            <label style={{ color: 'white' }}>
                <input type="checkbox" checked={mostrarTutor2} onChange={(e) => setMostrarTutor2(e.target.checked)} />
                &nbsp; Agregar segundo tutor
            </label>
            </div>

            {mostrarTutor2 && (
            <TutorForm tutor={tutor2} setTutor={setTutor2} titulo="Segundo Tutor (opcional)" requerido={false} />
            )}

        
            <div className="form-actions">
                <button type="submit" className="btn btn-primary">Registrar Alumno</button>
            </div>
        </form>
    </div>
  );
}

export default RegistroAlumno;
