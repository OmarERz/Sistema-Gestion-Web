// Importa React para usar JSX y componentes
import React from "react";
// Importa los componentes necesarios para la gestión de rutas desde react-router-dom
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Importa el componente Login desde la carpeta "proyecto"
import Login from "./proyecto/Login";
// Importa el componente ProtectedRoute desde la carpeta "proyecto"
import ProtectedRoute from "./proyecto/ProtectedRoute";
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
        <Route path="/registro" element={<ProtectedRoute> <Registro/> </ProtectedRoute>}/>
        {/* Ruta '/Index' que carga el componente de dashboard
        <Route path="/" element={<Menu />}/> */}
        <Route path="/index" element={<ProtectedRoute> <Menu/> </ProtectedRoute>}/>

        {/* Ruta "/gestionGrupos" que carga el componente de dash board*/}
        <Route path="/gestionGrupos" element={<ProtectedRoute><Gestion_Grupos/></ProtectedRoute>}/>

        {/* Ruta "/registroPagos" que carga el componente de dash board*/}
        <Route path="/registroPagos" element={<ProtectedRoute><Resgistro_Pagos/></ProtectedRoute>}/>

        {/* Ruta "/HistorialPagos" que carga el componente de dash board*/}
        <Route path="/historialPagos" element={<ProtectedRoute><Historial_Pagos/></ProtectedRoute>}/>

        {/* Ruta "/bajaAlumno" que carga el componente de dash board*/}
        <Route path="/bajaAlumno" element={<ProtectedRoute><Baja_Alumno/></ProtectedRoute>}/>

        {/* Ruta "/gastos" que carga el componente de dash board*/}
        <Route path="/gastos" element={<ProtectedRoute><Gastos/></ProtectedRoute>}/>

        {/* Ruta "/maestros" que carga el componente de dash board*/}
        <Route path="/maestros" element={<ProtectedRoute><Maestros/></ProtectedRoute>}/>

        {/* Ruta "/crud" que carga el componente de dash board*/}
        <Route path="/descarga" element={<ProtectedRoute><Descarga/></ProtectedRoute>}/>
       

        

      </Routes>
    </Router>
  );
}

// Exporta el componente App para que pueda ser importado en otros módulos
export default App;
