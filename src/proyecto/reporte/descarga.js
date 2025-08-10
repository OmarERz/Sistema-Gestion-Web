// src/components/DownloadGame.js
import React from 'react';
import { Link } from 'react-router-dom';
// Importa tu exe; Webpack lo copiará a build/static/media y te devolverá su URL
import Archivopdf from './Archivo_alumno.pdf';

export default function DownloadGame() {
  return (
    <>
      {/* Encabezado de la página con navegación */}
      <div className="layout">
            <nav className="sidebar">
              {/* Enlace que muestra el logo y lleva a la misma página de dashboard*/}
              <Link className="logo" to="/index">
                Inicio
              </Link>
              {/* Menú de navegación interno a diferentes secciones del dashboard*/}
                  <Link className="nav-item" to="/gestionGrupos">Gestión de Grupos</Link>
                  <Link className="nav-item" to="/registroPagos">Registro de Pagos</Link>
                  <Link className="nav-item" to="/historialPagos">Historial de Pagos</Link>
                  <Link className="nav-item" to="/bajaAlumno">Gestión de Bajas</Link>
                  <Link className="nav-item" to="/descarga">Descarga de Reportes</Link>
            </nav>

          {/* Botón de descarga */}
          <div style={{display: 'flex', justifyContent: 'center', margin: '8rem auto'}}>
            <a href={Archivopdf} download="Documento.pdf">
              <button
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  backgroundColor: '#007bff',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                📥 Descargar Documento
              </button>
            </a>
          </div>

      </div>
    </>
  );
}
