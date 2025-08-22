# routes/alumnos.py

from flask import Blueprint, request, jsonify, abort
from models import db, Alumno
from datetime import date

alumnos_bp = Blueprint('alumnos_bp', __name__)

# 1) GET /api/alumnos/ => lista todos los alumnos
@alumnos_bp.route('/', methods=['GET'])
def listar_alumnos():
    alumnos = Alumno.query.all()
    return jsonify([{
        'id': a.id,
        'nombre': a.nombre,
        'apellido_paterno': a.apellido_paterno,
        'apellido_materno': a.apellido_materno,
        'fecha_nacimiento': a.fecha_nacimiento.isoformat() if a.fecha_nacimiento else None,
        'grado': a.grado,
        'activo': a.activo,
        'grupo_id': a.grupo_id,
        'tutor_id': a.tutor_id,
        'ciclo_id': a.ciclo_id,
        "adeudo_total": float(a.adeudo_total or 0.0)
    } for a in alumnos]), 200

# 2) GET /api/alumnos/<int:id> => obtiene un alumno específico
@alumnos_bp.route('/<int:id>', methods=['GET'])
def obtener_alumno(id):
    a = Alumno.query.get_or_404(id)
    return jsonify({
        'id': a.id,
        'nombre': a.nombre,
        'apellido_paterno': a.apellido_paterno,
        'apellido_materno': a.apellido_materno,
        'fecha_nacimiento': a.fecha_nacimiento.isoformat() if a.fecha_nacimiento else None,
        'grado': a.grado,
        'activo': a.activo,
        'grupo_id': a.grupo_id,
        'tutor_id': a.tutor_id,
        'ciclo_id': a.ciclo_id,
        "adeudo_total": float(a.adeudo_total or 0.0)
    }), 200

# 3) POST /api/alumnos/ => crea un alumno nuevo
@alumnos_bp.route('/', methods=['POST'])
def crear_alumno():
    data = request.get_json() or {}
    # Campos obligatorios
    required = (
        'nombre','apellido_paterno','apellido_materno',
        'fecha_nacimiento','grado','activo',
        'grupo_id','tutor_id','ciclo_id'
    )
    for campo in required:
        if campo not in data:
            abort(400, description=f"Falta campo obligatorio: {campo}")

    # Parseamos fecha ISO -> date
    try:
        fn = date.fromisoformat(data['fecha_nacimiento'])
    except ValueError:
        abort(400, description="Formato de fecha_nacimiento inválido. Debe ser YYYY-MM-DD")

    # Creamos y guardamos
    a = Alumno(
        nombre=data['nombre'],
        apellido_paterno=data['apellido_paterno'],
        apellido_materno=data['apellido_materno'],
        fecha_nacimiento=fn,
        grado=data['grado'],
        activo=data['activo'],
        grupo_id=data['grupo_id'],
        tutor_id=data['tutor_id'],
        ciclo_id=data['ciclo_id']
    )
    db.session.add(a)
    db.session.commit()
    return jsonify({'id': a.id}), 201

# 4) PUT /api/alumnos/<int:id> => actualiza un alumno existente
@alumnos_bp.route('/<int:id>', methods=['PUT'])
def actualizar_alumno(id):
    a = Alumno.query.get_or_404(id)
    data = request.get_json() or {}

    # Campos seguros de actualizar
    updatable = ('nombre','apellido_paterno',
                 'apellido_materno','grado',
                 'activo','fecha_nacimiento')
    for campo in updatable:
        if campo in data:
            if campo == 'fecha_nacimiento':
                # Parseamos la fecha si viene
                try:
                    setattr(a, campo, date.fromisoformat(data[campo]))
                except ValueError:
                    abort(400, description="Formato de fecha_nacimiento inválido. Debe ser YYYY-MM-DD")
            else:
                setattr(a, campo, data[campo])

    db.session.commit()
    return jsonify({'mensaje': 'Actualizado'}), 200

# 5) DELETE /api/alumnos/<int:id> => elimina un alumno
@alumnos_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_alumno(id):
    a = Alumno.query.get_or_404(id)
    db.session.delete(a)
    db.session.commit()
    return jsonify({'mensaje': 'Eliminado'}), 200