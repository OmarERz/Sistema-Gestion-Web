from datetime import date
from flask_sqlalchemy import SQLAlchemy

#Inicializar el ORM
db = SQLAlchemy()





# Modelo Grupo:

class Grupo(db.Model):
    __tablename__='grupos'

    # Atributos:
    id = db.Column(db.Integer, primary_key = True)                          # PK
    nombre = db.Column(db.String, nullable = False)                         # Nombre (Ej. "A", "B")
    grado = db.Column(db.String, nullable = False)                          # Grado del grupo (1, 2, 3)
    orden_promocion = db.Column(db.Integer, nullable = False)               # Orden para la promocion automatica

    # Relaciones
    alumnos = db.relationship('Alumno', back_populates = 'grupo')           # Relacion 1:N Para Grupo.alumnos


# Modelo Tutor:

class Tutor(db.Model):
    __tablename__='tutor'

    # Atributos:
    id = db.Column(db.Integer, primary_key = True)                          # PK
    nombre = db.Column(db.String, nullable = False)                         # Nombre del tutor
    apellido_paterno = db.Column(db.String, nullable = False)               # Apellido Paterno
    apellido_materno = db.Column(db.String, nullable = False)               # Apellido Materno
    telefono = db.Column(db.String(10), nullable = False)                   # Telefono (Maximo de 10 digitos)
    correo = db.Column(db.String, nullable = True)                          # Correo (Opcional)
    relacion_con_alumno = db.Column(db.String, nullable = False)            # Relacion (Padre, Madre, Tio)

    # Relaciones
    alumnos = db.relationship('Alumno', back_populates = 'tutor')           # Relacion 1:N Para Tutor.alumnos


# Modelo CicloEscolar:

class CicloEscolar(db.Model):
    __tablename__='ciclos_escolares'
    
    # Atributos:
    id = db.Column(db.Integer, primary_key = True)                          # PK
    nombre = db.Column(db.String, nullable = False)                         # Ej. "2025-2026"
    fecha_inicio = db.Column(db.Date, nullable = False)                     # Fecha de inicio
    fecha_fin = db.Column(db.Date, nullable = False)                        # Fecha de fin
    activo = db.Column(db.Boolean, nullable = False, default = False)

    # Relaciones
    alumnos = db.relationship('Alumno', back_populates = 'ciclo')           # Relacion 1:N Para CicloEscolar.alumnos


# Modelo Alumno:
class Alumno(db.Model):
    __tablename__ = 'alumnos'

    # Columnas y atributos
    id = db.Column(db.Integer, primary_key = True)
    nombre = db.Column(db.String, nullable = False)
    apellido_paterno = db.Column(db.String, nullable = False)
    apellido_materno = db.Column(db.String, nullable = False)
    fecha_nacimiento = db.Column(db.Date, nullable = False)
    grado = db.Column(db.String, nullable = False)
    activo = db.Column(db.Boolean, nullable = False, default = True)

    # Claves Foraneas
    grupo_id = db.Column(db.Integer, db.ForeignKey('grupos.id'), nullable = False)
    tutor_id = db.Column(db.Integer, db.ForeignKey('tutor.id'), nullable = False)
    ciclo_id = db.Column(db.Integer, db.ForeignKey('ciclos_escolares.id'), nullable = False)

    # Relaciones Inversas
    grupo = db.relationship('Grupo', back_populates = 'alumnos')
    tutor = db.relationship('Tutor', back_populates = 'alumnos')
    ciclo = db.relationship('CicloEscolar', back_populates = 'alumnos')
    pagos = db.relationship('Pago', back_populates = 'alumnos')
    bajas = db.relationship('AlumnoBaja', back_populates = 'alumnos')
    uniformes = db.relationship('UniformePendiente', back_populates = 'alumnos')


#Modelo AlumnoBaja:

class AlumnoBaja(db.Model):
    __tablename__ = 'alumnos_baja'
    id = db.Column(db.Integer, primary_key=True)                        # PK
    alumno_id = db.Column(db.Integer, db.ForeignKey('alumnos.id'), nullable=False)
    fecha_baja = db.Column(db.Date, nullable=False)                     # Fecha de baja
    motivo = db.Column(db.String, nullable=False)                       # Motivo de la baja
    monto_adeudo = db.Column(db.Float, nullable=False)                  # Adeudo al momento de la baja

    # Relación inversa
    alumno = db.relationship('Alumno', back_populates='bajas')

#Modelo ConceptoPago:

class ConceptoPago(db.Model):
    __tablename__ = 'conceptos_pago'
    id = db.Column(db.Integer, primary_key=True)                        # PK
    nombre = db.Column(db.String(100), nullable=False)                  # Ej. "Colegiatura"
    obligatorio = db.Column(db.Boolean, nullable=False)                 # Si es pago obligatorio
    aplica_descuento = db.Column(db.Boolean, nullable=False)            # Permite descuento
    aplica_recargo = db.Column(db.Boolean, nullable=False)              # Permite recargo
    tipo = db.Column(db.String(50), nullable=True)                      # Categoría o tipo de pago

    # Relaciones
    pagos = db.relationship('Pago', back_populates='concepto')          # Relación 1:N → ConceptoPago.pagos


#Modelo Pago:

class Pago(db.Model):
    __tablename__ = 'pagos'
    id = db.Column(db.Integer, primary_key=True)                      # PK
    alumno_id = db.Column(db.Integer, db.ForeignKey('alumnos.id'), nullable=False)
    concepto_id = db.Column(db.Integer, db.ForeignKey('conceptos_pago.id'), nullable=False)
    fecha_pago = db.Column(db.Date, nullable=True)                    # Fecha de realización
    monto = db.Column(db.Float, nullable=True)                        # Importe del pago
    descuento = db.Column(db.Float, nullable=False, default=0.0)      # Descuento aplicado
    recargo = db.Column(db.Float, nullable=False, default=0.0)        # Recargo aplicado
    pagado = db.Column(db.Boolean, nullable=False, default=False)     # Marca si ya se pagó
    estado_pago = db.Column(db.String(20), nullable=False, default='Pendiente')  
    # CHECK (Pendiente, Pagado, Cancelado, En revisión) se implementa a nivel de lógica

    # Relaciones inversas
    alumno = db.relationship('Alumno', back_populates='pagos')
    concepto = db.relationship('ConceptoPago', back_populates='pagos')
    factura = db.relationship('Factura', back_populates='pago', uselist=False)


#Modelo Factura:

class Factura(db.Model):
    __tablename__ = 'facturas'
    id = db.Column(db.Integer, primary_key=True)                        # PK
    pago_id = db.Column(db.Integer, db.ForeignKey('pagos.id'), nullable=False)
    rfc = db.Column(db.String(13), nullable=True)                       # RFC del tutor
    razon_social = db.Column(db.String(200), nullable=True)             # Razón social
    uso_cfdi = db.Column(db.String(50), nullable=True)                  # Uso de CFDI
    domicilio_fiscal = db.Column(db.Text, nullable=True)                # Dirección fiscal
    codigo_postal = db.Column(db.String(10), nullable=True)             # CP fiscal

    # Relaciones
    pago = db.relationship('Pago', back_populates='factura')            # Relación inversa 1:1


#Modelo Maestro:

class Maestro(db.Model):
    __tablename__ = 'maestros'
    id = db.Column(db.Integer, primary_key=True)                        # PK
    nombre = db.Column(db.String, nullable=False)                       # Nombre del maestro
    apellido_paterno = db.Column(db.String, nullable=False)             # Apellido paterno
    apellido_materno = db.Column(db.String, nullable=False)             # Apellido materno
    telefono = db.Column(db.String(15), nullable=False)                 # Teléfono
    correo = db.Column(db.String, nullable=True)                        # Email (opcional)

    # Relaciones 1:N
    asistencias = db.relationship('AsistenciaMaestro', back_populates='maestro')
    inasistencias = db.relationship('InasistenciaMaestro', back_populates='maestro')
    pagos = db.relationship('PagoMaestro', back_populates='maestro')


#Modelo AsistenciaMaestro:

class AsistenciaMaestro(db.Model):
    __tablename__ = 'asistencias_maestros'
    id = db.Column(db.Integer, primary_key=True)                        # PK
    maestro_id = db.Column(db.Integer, db.ForeignKey('maestros.id'), nullable=False)
    fecha = db.Column(db.Date, nullable=False)                          # Fecha de asistencia
    estado = db.Column(db.String, nullable=False)                       # "Presente" o "Falta"

    # Relación inversa
    maestro = db.relationship('Maestro', back_populates='asistencias')


#Modelo InasistenciaMaestro

class InasistenciaMaestro(db.Model):
    __tablename__ = 'inasistencias_maestros'
    id = db.Column(db.Integer, primary_key=True)                        # PK
    maestro_id = db.Column(db.Integer, db.ForeignKey('maestros.id'), nullable=False)
    fecha = db.Column(db.Date, nullable=False)                          # Fecha de falta

    # Relación inversa
    maestro = db.relationship('Maestro', back_populates='inasistencias')


#Modelo PagoMaestro
class PagoMaestro(db.Model):
    __tablename__ = 'pagos_maestros'
    id = db.Column(db.Integer, primary_key=True)                        # PK
    maestro_id = db.Column(db.Integer, db.ForeignKey('maestros.id'), nullable=False)
    fecha_pago = db.Column(db.Date, nullable=True)                      # Fecha de pago quincenal
    monto_base = db.Column(db.Float, nullable=True)                     # Sueldo base
    descuento = db.Column(db.Float, nullable=True)                      # Descuento por faltas
    monto_final = db.Column(db.Float, nullable=True)                    # Monto neto a pagar

    # Relación inversa
    maestro = db.relationship('Maestro', back_populates='pagos')


#Modelo Reporte:
class Reporte(db.Model):
    __tablename__ = 'reportes'
    id = db.Column(db.Integer, primary_key=True)                        # PK
    tipo = db.Column(db.String, nullable=False)                         # Tipo de reporte
    descripcion = db.Column(db.String, nullable=False)                  # Descripción breve
    fecha_creacion = db.Column(db.Date, nullable=False, default=date.today)  
    url_archivo = db.Column(db.String, nullable=False)                  # Ruta/URL del archivo generado