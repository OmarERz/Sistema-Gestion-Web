# routes/alumnos_baja.py

from flask import Blueprint, request, jsonify, abort
from models import db, AlumnoBaja
from datetime import date

# 1) Creamos el Blueprint para bajas de alumnos
alumnos_baja_bp = Blueprint('alumnos_baja_bp', __name__)

# 2) GET /api/alumnos_baja/ => lista todas las bajas de alumnos
@alumnos_baja_bp.route('/', methods=['GET'])
def listar_alumnos_baja():
    bajas = AlumnoBaja.query.all()
    return jsonify([{
        'id': b.id,
        'alumno_id': b.alumno_id,
        'fecha_baja': b.fecha_baja.isoformat() if b.fecha_baja else None,
        'motivo': b.motivo,
        'monto_adeudo': b.monto_adeudo
    } for b in bajas]), 200

# 2.1) GET /api/alumnos_baja/<int:id> => obtiene una baja específica
@alumnos_baja_bp.route('/<int:id>', methods=['GET'])
def obtener_alumno_baja(id):
    b = AlumnoBaja.query.get_or_404(id)
    return jsonify({
        'id': b.id,
        'alumno_id': b.alumno_id,
        'fecha_baja': b.fecha_baja.isoformat() if b.fecha_baja else None,
        'motivo': b.motivo,
        'monto_adeudo': b.monto_adeudo
    }), 200

# 3) POST /api/alumnos_baja/ => crea una baja nueva
@alumnos_baja_bp.route('/', methods=['POST'])
def crear_alumno_baja():
    data = request.get_json() or {}
    # Campos obligatorios
    required = ('alumno_id', 'fecha_baja', 'motivo', 'monto_adeudo')
    for campo in required:
        if campo not in data:
            abort(400, description=f"Falta campo obligatorio: {campo}")
    # Parseamos fecha ISO -> date
    try:
        fb = date.fromisoformat(data['fecha_baja'])
    except ValueError:
        abort(400, description="Formato de fecha_baja inválido. Debe ser YYYY-MM-DD")
    # Crear y guardar
    b = AlumnoBaja(
        alumno_id=data['alumno_id'],
        fecha_baja=fb,
        motivo=data['motivo'],
        monto_adeudo=data['monto_adeudo']
    )
    db.session.add(b)
    db.session.commit()
    return jsonify({'id': b.id}), 201

# 4) PUT /api/alumnos_baja/<int:id> => actualiza una baja existente
@alumnos_baja_bp.route('/<int:id>', methods=['PUT'])
def actualizar_alumno_baja(id):
    b = AlumnoBaja.query.get_or_404(id)
    data = request.get_json() or {}
    # Campos seguros de actualizar
    updatable = ('alumno_id', 'fecha_baja', 'motivo', 'monto_adeudo')
    for campo in updatable:
        if campo in data:
            if campo == 'fecha_baja':
                try:
                    setattr(b, campo, date.fromisoformat(data[campo]))
                except ValueError:
                    abort(400, description="Formato de fecha_baja inválido. Debe ser YYYY-MM-DD")
            else:
                setattr(b, campo, data[campo])
    db.session.commit()
    return jsonify({'mensaje': 'Actualizado'}), 200

# 5) DELETE /api/alumnos_baja/<int:id> => elimina una baja
@alumnos_baja_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_alumno_baja(id):
    b = AlumnoBaja.query.get_or_404(id)
    db.session.delete(b)
    db.session.commit()
    return jsonify({'mensaje': 'Eliminado'}), 200
