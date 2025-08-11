// Importa React para usar JSX y componentes
import React from "react";
// Importa los componentes necesarios para la gestión de rutas desde react-router-dom
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Importa el componente Login desde la carpeta "proyecto"
import Login from "./proyecto/Login";
// Importa el componente Registro desde la carpeta "proyecto"
import Registro from "./proyecto/Registro";

// Importa el componente index desde la carpeta "proyecto"
import Menu from "./proyecto/Index";


import Gestion_Grupos from "./proyecto/gestion_grupos/GestionGrupos";


import Resgistro_Pagos from "./proyecto/registro_pagos/RegistroPago";


import Historial_Pagos from "./proyecto/historial_pagos/HistorialAlumno";

import Baja_Alumno from "./proyecto/gestion_bajas/BajaAlumno";

import Gastos from "./proyecto/gastos/gastos";

import Maestros from "./proyecto/maestros/Maestros";


// Importa el componente descarag desde la carpeta "proyecto"
import Descarga from "./proyecto/reporte/descarga"


// Define el componente principal de la aplicación
function App() {
  return (
    // Envuelve la aplicación en un Router para manejar la navegación
    <Router>
      {/* Define las rutas disponibles en la aplicación */}
      <Routes>
        {/* Ruta raíz que carga el componente Login */}
        <Route path="/" element={<Login />} />
        {/* Ruta "/registro" que carga el componente de dash board*/}
        <Route path="/registro" element={<Registro/>}/>
        {/* Ruta '/Index' que carga el componente de dashboard
        <Route path="/" element={<Menu />}/> */}
        <Route path="/index" element={<Menu/>}/>

        {/* Ruta "/gestionGrupos" que carga el componente de dash board*/}
        <Route path="/gestionGrupos" element={<Gestion_Grupos/>}/>

        {/* Ruta "/registroPagos" que carga el componente de dash board*/}
        <Route path="/registroPagos" element={<Resgistro_Pagos/>}/>

        {/* Ruta "/HistorialPagos" que carga el componente de dash board*/}
        <Route path="/historialPagos" element={<Historial_Pagos/>}/>

        {/* Ruta "/bajaAlumno" que carga el componente de dash board*/}
        <Route path="/bajaAlumno" element={<Baja_Alumno/>}/>

        {/* Ruta "/gastos" que carga el componente de dash board*/}
        <Route path="/gastos" element={<Gastos/>}/>

        {/* Ruta "/maestros" que carga el componente de dash board*/}
        <Route path="/maestros" element={<Maestros/>}/>

        {/* Ruta "/crud" que carga el componente de dash board*/}
        <Route path="/descarga" element={<Descarga/>}/>
       

        

      </Routes>
    </Router>
  );
}

// Exporta el componente App para que pueda ser importado en otros módulos
export default App;
