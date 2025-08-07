import React from 'react';
import "../gestion_alumnos_turores/RegistroA.css";

function TutorForm({ tutor, setTutor, titulo = "Tutor", requerido = false }) {
  const handleChange = (e) => {
    setTutor({ ...tutor, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h3 className="form-title">{titulo}</h3>

      <div className="form-row">
        <input type="text" name="nombre" placeholder="Nombre" value={tutor.nombre} onChange={handleChange} required={requerido} />
        <input type="text" name="apellido_paterno" placeholder="Apellido Paterno" value={tutor.apellido_paterno} onChange={handleChange} required={requerido} />
      </div>

      <div className="form-row">
        <input type="text" name="apellido_materno" placeholder="Apellido Materno" value={tutor.apellido_materno} onChange={handleChange} required={requerido} />
        <input type="text" name="telefono" placeholder="Teléfono" value={tutor.telefono} onChange={handleChange} required={requerido} />
      </div>

      <div className="form-row">
        <input type="email" name="correo" placeholder="Correo (opcional)" value={tutor.correo} onChange={handleChange} />
        <select name="relacion_con_alumno" value={tutor.relacion_con_alumno} onChange={handleChange} required={requerido}>
          <option value="">Relación</option>
          <option value="Padre">Padre</option>
          <option value="Madre">Madre</option>
          <option value="Tutor">Tutor</option>
        </select>
      </div>
    </>
  );
}

export default TutorForm;
