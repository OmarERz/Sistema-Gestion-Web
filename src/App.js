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
        
        {/* Ruta "/crud" que carga el componente de dash board*/}
        <Route path="/descarga" element={<Descarga/>}/>
       

        

      </Routes>
    </Router>
  );
}

// Exporta el componente App para que pueda ser importado en otros módulos
export default App;
