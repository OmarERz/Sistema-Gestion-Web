# routes/__init__.py

# Importa aquí todos los Blueprints definidos en este paquete
from .alumnos                import alumnos_bp
from .tutores                import tutores_bp
from .grupos                 import grupos_bp
from .ciclos                 import ciclos_bp
from .pagos                  import pagos_bp
from .maestros               import maestros_bp
from .reportes               import reportes_bp

# Blueprints adicionales para recursos secundarios
from .conceptos_pago         import conceptos_pago_bp
from .alumnos_baja           import alumnos_baja_bp
from .uniformes              import uniformes_bp
from .uniformes_pendientes   import uniformes_pendientes_bp
from .pagos_maestros         import pagos_maestros_bp
from .asistencias_maestros   import asistencias_maestros_bp

# Exporta los nombres para facilitar imports con *
__all__ = [
    "alumnos_bp",
    "tutores_bp",
    "grupos_bp",
    "ciclos_bp",
    "pagos_bp",
    "maestros_bp",
    "reportes_bp",
    "conceptos_pago_bp",
    "alumnos_baja_bp",
    "uniformes_bp",
    "uniformes_pendientes_bp",
    "pagos_maestros_bp",
    "asistencias_maestros_bp",
]