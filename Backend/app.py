# app.py

import os
from flask import Flask
from flask_migrate import Migrate
from config import config       # Importa la configuración centralizada
from models import db           # Importa la instancia de SQLAlchemy

# Importa los Blueprints de cada módulo de rutas
from routes.alumnos import alumnos_bp
from routes.tutores import tutores_bp
from routes.grupos import grupos_bp
from routes.ciclos import ciclos_bp
from routes.pagos import pagos_bp
from routes.maestros import maestros_bp
from routes.reportes import reportes_bp
from routes.conceptos_pago         import conceptos_pago_bp
from routes.alumnos_baja           import alumnos_baja_bp
from routes.uniformes              import uniformes_bp
from routes.uniformes_pendientes   import uniformes_pendientes_bp
from routes.pagos_maestros         import pagos_maestros_bp
from routes.asistencias_maestros   import asistencias_maestros_bp

def create_app():
    """
    Crea y configura la aplicación Flask:
    1. Carga la configuración (SECRET_KEY, URI de la DB, etc.).
    2. Inicializa la extensión SQLAlchemy.
    3. Inicializa Flask-Migrate (para migraciones Alembic).
    4. Registra todos los Blueprints bajo sus prefijos de ruta.
    """
    # Crea la aplicación, indicando que existe carpeta 'instance' para configuraciones locales
    app = Flask(__name__, instance_relative_config=True)

    # Carga los parámetros de configuración de config.py
    app.config.from_object(config)

    # Inicializa la base de datos y migraciones
    db.init_app(app)
    Migrate(app, db)

    # Registra los Blueprints, separando rutas por funcionalidad
    app.register_blueprint(alumnos_bp,   url_prefix='/api/alumnos')
    app.register_blueprint(tutores_bp,   url_prefix='/api/tutores')
    app.register_blueprint(grupos_bp,    url_prefix='/api/grupos')
    app.register_blueprint(ciclos_bp,    url_prefix='/api/ciclos')
    app.register_blueprint(pagos_bp,     url_prefix='/api/pagos')
    app.register_blueprint(maestros_bp,  url_prefix='/api/maestros')
    app.register_blueprint(reportes_bp,  url_prefix='/api/reportes')
    app.register_blueprint(conceptos_pago_bp,       url_prefix='/api/conceptos_pago')
    app.register_blueprint(alumnos_baja_bp,         url_prefix='/api/alumnos_baja')
    app.register_blueprint(uniformes_bp,            url_prefix='/api/uniformes')
    app.register_blueprint(uniformes_pendientes_bp, url_prefix='/api/uniformes_pendientes')
    app.register_blueprint(pagos_maestros_bp,       url_prefix='/api/pagos_maestros')
    app.register_blueprint(asistencias_maestros_bp, url_prefix='/api/asistencias_maestros')


    return app

# Instancia global de la aplicación
app = create_app()

if __name__ == '__main__':
    # Lee el puerto desde la variable de entorno o usa 5000 por defecto
    port = int(os.environ.get('PORT', 5000))
    # Arranca el servidor en modo debug para desarrollo
    app.run(host='0.0.0.0', port=port, debug=True)
