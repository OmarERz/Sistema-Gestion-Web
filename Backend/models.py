from datetime import date
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import CheckConstraint

# Inicialización del ORM
db = SQLAlchemy()


# -------------------------------
# Modelo Grupo
# -------------------------------
class Grupo(db.Model):
    __tablename__ = 'grupos'
    id = db.Column(db.Integer, primary_key=True)                        # ID único del grupo
    nombre = db.Column(db.String(100), nullable=False)                  # Nombre descriptivo (ej. "A", "B")
    grado = db.Column(db.String(50), nullable=False)                    # Grado académico (ej. "Primaria")
    orden_promocion = db.Column(db.Integer, nullable=False)             # Secuencia para promoción automática

    # Relación 1:N → un Grupo tiene muchos Alumnos
    alumnos = db.relationship('Alumno', back_populates='grupo')


# -------------------------------
# Modelo Tutor
# -------------------------------
class Tutor(db.Model):
    __tablename__ = 'tutores'
    id = db.Column(db.Integer, primary_key=True)                        # ID único del tutor
    nombre = db.Column(db.String(100), nullable=False)                  # Nombre del tutor
    apellido_paterno = db.Column(db.String(100), nullable=False)        # Apellido paterno
    apellido_materno = db.Column(db.String(100), nullable=False)        # Apellido materno
    telefono = db.Column(db.String(15), nullable=False)                 # Teléfono (10–15 dígitos)
    correo = db.Column(db.String(150), nullable=True)                   # Correo electrónico (opcional)
    relacion_con_alumno = db.Column(db.String(50), nullable=False)      # Relación (padre, madre, etc.)

    # Relación 1:N → un Tutor puede tener varios Alumnos
    alumnos = db.relationship('Alumno', back_populates='tutor')


# -------------------------------
# Modelo CicloEscolar
# -------------------------------
class CicloEscolar(db.Model):
    __tablename__ = 'ciclos_escolares'
    id = db.Column(db.Integer, primary_key=True)                        # ID único del ciclo
    nombre = db.Column(db.String(50), nullable=False)                   # Nombre (ej. "2025-2026")
    fecha_inicio = db.Column(db.Date, nullable=False)                   # Fecha de inicio
    fecha_fin = db.Column(db.Date, nullable=False)                      # Fecha de fin
    activo = db.Column(db.Boolean, nullable=False, default=False)       # Marca ciclo activo

    # Relación 1:N → un CicloEscolar tiene muchos Alumnos
    alumnos = db.relationship('Alumno', back_populates='ciclo')


# -------------------------------
# Modelo Alumno
# -------------------------------
class Alumno(db.Model):
    __tablename__ = 'alumnos'
    id = db.Column(db.Integer, primary_key=True)                        # ID único del alumno
    nombre = db.Column(db.String(100), nullable=False)                  # Nombre del alumno
    apellido_paterno = db.Column(db.String(100), nullable=False)        # Apellido paterno
    apellido_materno = db.Column(db.String(100), nullable=False)        # Apellido materno
    fecha_nacimiento = db.Column(db.Date, nullable=False)               # Fecha de nacimiento
    grado = db.Column(db.String(50), nullable=False)                    # Grado (ej. "3ro Primaria")
    activo = db.Column(db.Boolean, nullable=False, default=True)        # Si el alumno está activo

    # Claves foráneas
    grupo_id = db.Column(db.Integer, db.ForeignKey('grupos.id'), nullable=False)
    tutor_id = db.Column(db.Integer, db.ForeignKey('tutores.id'), nullable=False)
    ciclo_id = db.Column(db.Integer, db.ForeignKey('ciclos_escolares.id'), nullable=False)

    # Relaciones inversas
    grupo = db.relationship('Grupo', back_populates='alumnos')
    tutor = db.relationship('Tutor', back_populates='alumnos')
    ciclo = db.relationship('CicloEscolar', back_populates='alumnos')
    pagos = db.relationship('Pago', back_populates='alumno')
    bajas = db.relationship('AlumnoBaja', back_populates='alumno')
    uniformes = db.relationship('UniformePendiente', back_populates='alumno')


# -------------------------------
# Modelo AlumnoBaja
# -------------------------------
class AlumnoBaja(db.Model):
    __tablename__ = 'alumnos_baja'
    id = db.Column(db.Integer, primary_key=True)                        # ID único de la baja
    alumno_id = db.Column(db.Integer, db.ForeignKey('alumnos.id'), nullable=False)
    fecha_baja = db.Column(db.Date, nullable=False)                     # Fecha en que se da la baja
    motivo = db.Column(db.String(200), nullable=False)                  # Motivo de la baja
    monto_adeudo = db.Column(db.Float, nullable=False)                  # Adeudo al momento de la baja

    # Relación inversa
    alumno = db.relationship('Alumno', back_populates='bajas')


# -------------------------------
# Modelo ConceptoPago
# -------------------------------
class ConceptoPago(db.Model):
    __tablename__ = 'conceptos_pago'
    id = db.Column(db.Integer, primary_key=True)                        # ID único del concepto
    nombre = db.Column(db.String(100), nullable=False)                  # Nombre (ej. "Colegiatura")
    obligatorio = db.Column(db.Boolean, nullable=False)                 # Si es obligatorio
    aplica_descuento = db.Column(db.Boolean, nullable=False)            # Permite descuento
    aplica_recargo = db.Column(db.Boolean, nullable=False)              # Permite recargo
    tipo = db.Column(db.String(50), nullable=True)                      # Categoría de pago

    # Relación 1:N → un ConceptoPago tiene muchos Pagos
    pagos = db.relationship('Pago', back_populates='concepto')


# -------------------------------
# Modelo Pago
# -------------------------------
class Pago(db.Model):
    __tablename__ = 'pagos'
    __table_args__ = (
        CheckConstraint(
            "estado_pago IN ('Pendiente','Pagado','Cancelado','En revisión')",
            name='chk_estado_pago'
        ),
    )
    id = db.Column(db.Integer, primary_key=True)                        # ID único del pago
    fecha_pago = db.Column(db.Date, nullable=True)                      # Fecha de realización
    monto = db.Column(db.Float, nullable=True)                          # Importe pagado
    descuento = db.Column(db.Float, nullable=False, default=0.0)        # Descuento aplicado
    recargo = db.Column(db.Float, nullable=False, default=0.0)          # Recargo aplicado
    pagado = db.Column(db.Boolean, nullable=False, default=False)       # Marca si se pagó
    estado_pago = db.Column(db.String(20), nullable=False, default='Pendiente')  # Estado

    # Claves foráneas
    alumno_id = db.Column(db.Integer, db.ForeignKey('alumnos.id'), nullable=False)
    concepto_id = db.Column(db.Integer, db.ForeignKey('conceptos_pago.id'), nullable=False)

    # Relaciones inversas
    alumno = db.relationship('Alumno', back_populates='pagos')
    concepto = db.relationship('ConceptoPago', back_populates='pagos')


# -------------------------------
# Modelo Maestro
# -------------------------------
class Maestro(db.Model):
    __tablename__ = 'maestros'
    id = db.Column(db.Integer, primary_key=True)                        # ID único del maestro
    nombre = db.Column(db.String(100), nullable=False)                  # Nombre del maestro
    apellido_paterno = db.Column(db.String(100), nullable=False)        # Apellido paterno
    apellido_materno = db.Column(db.String(100), nullable=False)        # Apellido materno
    telefono = db.Column(db.String(15), nullable=False)                 # Teléfono (10–15 dígitos)
    correo = db.Column(db.String(150), nullable=True)                   # Correo electrónico

    # Relaciones 1:N
    asistencias = db.relationship('AsistenciaMaestro', back_populates='maestro')
    pagos = db.relationship('PagoMaestro', back_populates='maestro')


# -------------------------------
# Modelo AsistenciaMaestro
# -------------------------------
class AsistenciaMaestro(db.Model):
    __tablename__ = 'asistencias_maestros'
    id = db.Column(db.Integer, primary_key=True)                        # ID único de la asistencia
    maestro_id = db.Column(db.Integer, db.ForeignKey('maestros.id'), nullable=False)
    fecha = db.Column(db.Date, nullable=False)                          # Fecha de asistencia
    estado = db.Column(db.String(20), nullable=False)                   # "Presente" o "Falta"

    # Relación inversa
    maestro = db.relationship('Maestro', back_populates='asistencias')


# -------------------------------
# Modelo PagoMaestro
# -------------------------------
class PagoMaestro(db.Model):
    __tablename__ = 'pagos_maestros'
    id = db.Column(db.Integer, primary_key=True)                        # ID único del pago
    maestro_id = db.Column(db.Integer, db.ForeignKey('maestros.id'), nullable=False)
    fecha_pago = db.Column(db.Date, nullable=True)                      # Fecha de pago
    monto_base = db.Column(db.Float, nullable=True)                     # Sueldo base quincenal
    descuento = db.Column(db.Float, nullable=True)                      # Descuento por faltas
    monto_final = db.Column(db.Float, nullable=True)                    # Monto neto a pagar

    # Relación inversa
    maestro = db.relationship('Maestro', back_populates='pagos')


# -------------------------------
# Modelo Uniforme
# -------------------------------
class Uniforme(db.Model):
    __tablename__ = 'uniformes'
    id = db.Column(db.Integer, primary_key=True)                        # ID único de la prenda
    prenda = db.Column(db.String(100), nullable=False)                  # Nombre de la prenda
    talla = db.Column(db.String(20), nullable=False)                    # Talla (ej. "2-4")
    precio_base = db.Column(db.Float, nullable=False)                   # Precio unitario base

    # Relación 1:N → un Uniforme puede generar varios pendientes
    pendientes = db.relationship('UniformePendiente', back_populates='uniforme')


# -------------------------------
# Modelo UniformePendiente
# -------------------------------
class UniformePendiente(db.Model):
    __tablename__ = 'uniformes_pendientes'
    id = db.Column(db.Integer, primary_key=True)                        # ID único del registro
    alumno_id = db.Column(db.Integer, db.ForeignKey('alumnos.id'), nullable=False)
    uniforme_id = db.Column(db.Integer, db.ForeignKey('uniformes.id'), nullable=False)
    entregado = db.Column(db.Boolean, nullable=False, default=False)    # Si la prenda ya fue entregada

    # Relaciones inversas
    alumno = db.relationship('Alumno', back_populates='uniformes')
    uniforme = db.relationship('Uniforme', back_populates='pendientes')


# -------------------------------
# Modelo Reporte
# -------------------------------
class Reporte(db.Model):
    __tablename__ = 'reportes'
    id = db.Column(db.Integer, primary_key=True)                        # ID único del reporte
    tipo = db.Column(db.String(50), nullable=False)                     # Tipo de reporte (ej. "Financiero")
    descripcion = db.Column(db.String(300), nullable=False)             # Descripción breve
    fecha_creacion = db.Column(db.Date, nullable=False, default=date.today)  
                                                                        # Fecha de generación
    url_archivo = db.Column(db.String(300), nullable=False)             # Ruta o URL del archivo generado
