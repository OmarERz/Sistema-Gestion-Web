// Importa React para usar JSX y componentes
import React from "react";
// Importa los componentes necesarios para la gestión de rutas desde react-router-dom
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Importa el componente Login desde la carpeta "proyecto"
import Login from "./proyecto/Login";
// Importa el componente index desde la carpeta "proyecto"
import Index from "./proyecto/index";
// Importa el componente crud desde la carpeta "proyecto"
import Crud from "./proyecto/crud";

//Importa el componente Exito desde la carpeta "proyecto"
//import ExitoF from "../src/proyecto/GraficaEF";


// Importa el componente Registro desde la carpeta "proyecto"
import Registro from "./proyecto/Registro";

// Define el componente principal de la aplicación
function App() {
  return (
    // Envuelve la aplicación en un Router para manejar la navegación
    <Router>
      {/* Define las rutas disponibles en la aplicación */}
      <Routes>
        {/* Ruta raíz que carga el componente Login */}
        <Route path="/" element={<Login />} />
        {/* Ruta '/Index' que carga el componente de dashboard
        <Route path="/" element={<Menu />}/> */}
        <Route path="/index" element={<Index/>}/>
        {/* Ruta "/crud" que carga el componente de dash board*/}
        <Route path="/crud" element={<Crud/>}/>
       

        {/* Ruta "/registro" que carga el componente de dash board*/}
        <Route path="/registro" element={<Registro/>}/>

      </Routes>
    </Router>
  );
}

// Exporta el componente App para que pueda ser importado en otros módulos
export default App;
