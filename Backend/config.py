# config.py

import os
from dotenv import load_dotenv

# 1. Carga automáticamente las variables definidas en un archivo .env
load_dotenv()

# 2. Determina la ruta base del proyecto para construir rutas relativas
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    """
    Clase de configuración para la aplicación Flask.
    Agrupa todas las variables que Flask y extensiones utilizan.
    """

    # Clave secreta para firmar sesiones y proteger formularios CSRF
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'cambia-esta-clave-por-una-segura'

    # URI de conexión a la base de datos.
    # Si existe DATABASE_URL en .env, lo usa (por ejemplo, para producción).
    # Si no, por defecto crea/usa cole_db.sqlite3 dentro de /instance.
    SQLALCHEMY_DATABASE_URI = (
        os.environ.get('DATABASE_URL') or
        f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'cole_db.sqlite3')}"
    )

    # Desactiva el tracking de cambios de objetos para ahorrar recursos
    SQLALCHEMY_TRACK_MODIFICATIONS = False

# Exportamos una instancia de Config para usar en app.py
config = Config()