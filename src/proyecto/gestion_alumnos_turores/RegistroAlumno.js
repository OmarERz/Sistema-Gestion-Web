import React, { useEffect, useState } from "react";
import "./RegistroA.css";
import TutorForm from "./TutorForm";

const RegistroAlumno = () => {
  // catálogos
  const [grupos, setGrupos] = useState([]);
  const [ciclos, setCiclos] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [rg, rc] = await Promise.all([fetch("/api/grupos/"), fetch("/api/ciclos/")]);
        if (!rg.ok) throw new Error(await rg.text());
        if (!rc.ok) throw new Error(await rc.text());
        setGrupos(await rg.json());
        setCiclos(await rc.json());
      } catch (e) {
        console.error("Catálogos:", e);
        alert("No se pudieron cargar grupos y ciclos.");
      }
    })();
  }, []);

  // alumno
  const [alumno, setAlumno] = useState({
    nombre: "", apellido_paterno: "", apellido_materno: "",
    fecha_nacimiento: "", grado: "", grupo_id: "", ciclo_id: ""
  });
  const onAlumno = (e) => setAlumno(p => ({ ...p, [e.target.name]: e.target.value }));

  // tutor principal
  const [tutor, setTutor] = useState({
    nombre: "", apellido_paterno: "", apellido_materno: "",
    telefono: "", correo: "", relacion_con_alumno: "Padre"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // crea tutor
      const rt = await fetch("/api/tutores/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: tutor.nombre.trim(),
          apellido_paterno: tutor.apellido_paterno.trim(),
          apellido_materno: tutor.apellido_materno.trim(),
          telefono: tutor.telefono.trim(),
          correo: tutor.correo?.trim() || null,
          relacion_con_alumno: tutor.relacion_con_alumno || "Tutor",
        }),
      });
      if (!rt.ok) throw new Error(`Tutor: ${await rt.text()}`);
      const { id: tutor_id } = await rt.json();

      // crea alumno
      const ra = await fetch("/api/alumnos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: alumno.nombre.trim(),
          apellido_paterno: alumno.apellido_paterno.trim(),
          apellido_materno: alumno.apellido_materno.trim(),
          fecha_nacimiento: alumno.fecha_nacimiento, // YYYY-MM-DD
          grado: alumno.grado.trim(),
          activo: true,
          grupo_id: Number(alumno.grupo_id),
          tutor_id,
          ciclo_id: Number(alumno.ciclo_id),
        }),
      });
      if (!ra.ok) throw new Error(`Alumno: ${await ra.text()}`);

      alert("Alumno registrado ✅");
      setAlumno({ nombre:"", apellido_paterno:"", apellido_materno:"", fecha_nacimiento:"", grado:"", grupo_id:"", ciclo_id:"" });
      setTutor({ nombre:"", apellido_paterno:"", apellido_materno:"", telefono:"", correo:"", relacion_con_alumno:"Padre" });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <section className="wrap-registroalumno">
      <h2 className="title-registroalumno">Registro de Alumno</h2>

      <form onSubmit={handleSubmit} className="card-registroalumno">
        <div className="grid-registroalumno">
          <input name="nombre" placeholder="Nombre" value={alumno.nombre} onChange={onAlumno} />
          <input name="apellido_paterno" placeholder="Apellido paterno" value={alumno.apellido_paterno} onChange={onAlumno} />
          <input name="apellido_materno" placeholder="Apellido materno" value={alumno.apellido_materno} onChange={onAlumno} />
          <input type="date" name="fecha_nacimiento" placeholder="Fecha de nacimiento" value={alumno.fecha_nacimiento} onChange={onAlumno} />
          <input name="grado" placeholder="Grado (ej. 2)" value={alumno.grado} onChange={onAlumno} />

          <select name="grupo_id" value={alumno.grupo_id} onChange={onAlumno}>
            <option value="">Grupo</option>
            {grupos.map(g => <option key={g.id} value={g.id}>{g.grado} - {g.nombre}</option>)}
          </select>

          <select name="ciclo_id" value={alumno.ciclo_id} onChange={onAlumno}>
            <option value="">Ciclo escolar</option>
            {ciclos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>

      
        <TutorForm tutor={tutor} setTutor={setTutor} requerido />

        <button type="submit" className="btn-registroalumno btn-primary-registroalumno">Registrar Alumno</button>
      </form>
    </section>
  );
};

export default RegistroAlumno;
