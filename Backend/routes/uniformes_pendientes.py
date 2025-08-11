# routes/uniformes_pendientes.py

from flask import Blueprint, request, jsonify, abort
from models import db, UniformePendiente

# 1) Creamos el Blueprint para uniformes pendientes
uniformes_pendientes_bp = Blueprint('uniformes_pendientes_bp', __name__)

# 2) GET /api/uniformes_pendientes/ => lista todos los uniformes pendientes
@uniformes_pendientes_bp.route('/', methods=['GET'])
def listar_uniformes_pendientes():
    ups = UniformePendiente.query.all()
    return jsonify([{
        'id': u.id,
        'alumno_id': u.alumno_id,
        'uniforme_id': u.uniforme_id,
        'entregado': u.entregado
    } for u in ups]), 200

# 2.1) GET /api/uniformes_pendientes/<int:id> => obtiene un uniforme pendiente específico
@uniformes_pendientes_bp.route('/<int:id>', methods=['GET'])
def obtener_uniforme_pendiente(id):
    u = UniformePendiente.query.get_or_404(id)
    return jsonify({
        'id': u.id,
        'alumno_id': u.alumno_id,
        'uniforme_id': u.uniforme_id,
        'entregado': u.entregado
    }), 200

# 3) POST /api/uniformes_pendientes/ => crea un uniforme pendiente nuevo
@uniformes_pendientes_bp.route('/', methods=['POST'])
def crear_uniforme_pendiente():
    data = request.get_json() or {}
    # Campos obligatorios
    required = ('alumno_id', 'uniforme_id')
    for campo in required:
        if campo not in data:
            abort(400, description=f"Falta campo obligatorio: {campo}")
    u = UniformePendiente(
        alumno_id=data['alumno_id'],
        uniforme_id=data['uniforme_id'],
        entregado=data.get('entregado', False)
    )
    db.session.add(u)
    db.session.commit()
    return jsonify({'id': u.id}), 201

# 4) PUT /api/uniformes_pendientes/<int:id> => actualiza un uniforme pendiente existente
@uniformes_pendientes_bp.route('/<int:id>', methods=['PUT'])
def actualizar_uniforme_pendiente(id):
    u = UniformePendiente.query.get_or_404(id)
    data = request.get_json() or {}
    # Campos seguros de actualizar
    updatable = ('alumno_id', 'uniforme_id', 'entregado')
    for campo in updatable:
        if campo in data:
            setattr(u, campo, data[campo])
    db.session.commit()
    return jsonify({'mensaje': 'Actualizado'}), 200

# 5) DELETE /api/uniformes_pendientes/<int:id> => elimina un uniforme pendiente
@uniformes_pendientes_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_uniforme_pendiente(id):
    u = UniformePendiente.query.get_or_404(id)
    db.session.delete(u)
    db.session.commit()
    return jsonify({'mensaje': 'Eliminado'}), 200