# routes/asistencias_maestros.py

from flask import Blueprint, request, jsonify, abort
from datetime import date
from models import db, AsistenciaMaestro

# 1) Creamos el Blueprint para asistencias de maestros
asistencias_maestros_bp = Blueprint('asistencias_maestros_bp', __name__)

# 2) GET /api/asistencias_maestros/ => lista todas las asistencias
@asistencias_maestros_bp.route('/', methods=['GET'])
def listar_asistencias_maestros():
    asistencias = AsistenciaMaestro.query.all()
    return jsonify([{
        'id': a.id,
        'maestro_id': a.maestro_id,
        'fecha': a.fecha.isoformat() if a.fecha else None,
        'estado': a.estado
    } for a in asistencias]), 200

# 2.1) GET /api/asistencias_maestros/<int:id> => obtiene una asistencia específica
@asistencias_maestros_bp.route('/<int:id>', methods=['GET'])
def obtener_asistencia_maestro(id):
    a = AsistenciaMaestro.query.get_or_404(id)
    return jsonify({
        'id': a.id,
        'maestro_id': a.maestro_id,
        'fecha': a.fecha.isoformat() if a.fecha else None,
        'estado': a.estado
    }), 200

# 3) POST /api/asistencias_maestros/ => crea una asistencia nueva
@asistencias_maestros_bp.route('/', methods=['POST'])
def crear_asistencia_maestro():
    data = request.get_json() or {}
    required = ('maestro_id', 'fecha', 'estado')
    for campo in required:
        if campo not in data:
            abort(400, description=f"Falta campo obligatorio: {campo}")
    try:
        fecha = date.fromisoformat(data['fecha'])
    except ValueError:
        abort(400, description="Formato de fecha inválido. Debe ser YYYY-MM-DD")
    a = AsistenciaMaestro(
        maestro_id=data['maestro_id'],
        fecha=fecha,
        estado=data['estado']
    )
    db.session.add(a)
    db.session.commit()
    return jsonify({'id': a.id}), 201

# 4) PUT /api/asistencias_maestros/<int:id> => actualiza una asistencia existente
@asistencias_maestros_bp.route('/<int:id>', methods=['PUT'])
def actualizar_asistencia_maestro(id):
    a = AsistenciaMaestro.query.get_or_404(id)
    data = request.get_json() or {}
    updatable = ('maestro_id', 'fecha', 'estado')
    for campo in updatable:
        if campo in data:
            if campo == 'fecha':
                try:
                    setattr(a, campo, date.fromisoformat(data[campo]))
                except ValueError:
                    abort(400, description="Formato de fecha inválido. Debe ser YYYY-MM-DD")
            else:
                setattr(a, campo, data[campo])
    db.session.commit()
    return jsonify({'mensaje': 'Actualizado'}), 200

# 5) DELETE /api/asistencias_maestros/<int:id> => elimina una asistencia
@asistencias_maestros_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_asistencia_maestro(id):
    a = AsistenciaMaestro.query.get_or_404(id)
    db.session.delete(a)
    db.session.commit()
    return jsonify({'mensaje': 'Eliminado'}), 200