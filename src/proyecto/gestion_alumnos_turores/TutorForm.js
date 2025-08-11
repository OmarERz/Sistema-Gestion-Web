import React from "react";
import "./RegistroA.css";

function TutorForm({ tutor, setTutor, titulo = "Tutor", requerido = false }) {
  const on = (e) => setTutor({ ...tutor, [e.target.name]: e.target.value });

  return (
    <>
      <h4 className="subtitle-registroalumno">{titulo}</h4>
      <div className="grid-registroalumno">
        <input name="nombre" placeholder="Nombre" value={tutor.nombre} onChange={on} required={requerido} />
        <input name="apellido_paterno" placeholder="Apellido paterno" value={tutor.apellido_paterno} onChange={on} required={requerido} />
        <input name="apellido_materno" placeholder="Apellido materno" value={tutor.apellido_materno} onChange={on} required={requerido} />
        <input name="telefono" placeholder="Teléfono" value={tutor.telefono} onChange={on} required={requerido} />
        <input type="email" name="correo" placeholder="Correo (opcional)" value={tutor.correo} onChange={on} />
        <select name="relacion_con_alumno" value={tutor.relacion_con_alumno} onChange={on} required={requerido}>
          <option value="Padre">Padre</option>
          <option value="Madre">Madre</option>
          <option value="Tutor">Tutor</option>
          <option value="Abuelo(a)">Abuelo(a)</option>
          <option value="Otro">Otro</option>
        </select>
      </div>
    </>
  );
}

export default TutorForm;
