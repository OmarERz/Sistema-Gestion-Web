# routes/grupos.py

from flask import Blueprint, request, jsonify, abort
from models import db, Grupo

# 1) Creamos el Blueprint para grupos
grupos_bp = Blueprint('grupos_bp', __name__)

# 2) GET /api/grupos/ => lista todos los grupos
@grupos_bp.route('/', methods=['GET'])
def listar_grupos():
    grupos = Grupo.query.all()
    return jsonify([{
        'id': g.id,
        'nombre': g.nombre,
        'grado': g.grado,
        'orden_promocion': g.orden_promocion
    } for g in grupos]), 200

# 2.1) GET /api/grupos/<int:id> => obtiene un grupo específico
@grupos_bp.route('/<int:id>', methods=['GET'])
def obtener_grupo(id):
    g = Grupo.query.get_or_404(id)
    return jsonify({
        'id': g.id,
        'nombre': g.nombre,
        'grado': g.grado,
        'orden_promocion': g.orden_promocion
    }), 200

# 3) POST /api/grupos/ => crea un grupo nuevo
@grupos_bp.route('/', methods=['POST'])
def crear_grupo():
    data = request.get_json() or {}
    required = ('nombre', 'grado', 'orden_promocion')
    for campo in required:
        if campo not in data:
            abort(400, description=f"Falta campo obligatorio: {campo}")
    g = Grupo(
        nombre=data['nombre'],
        grado=data['grado'],
        orden_promocion=data['orden_promocion']
    )
    db.session.add(g)
    db.session.commit()
    return jsonify({'id': g.id}), 201

# 4) PUT /api/grupos/<int:id> => actualiza un grupo existente
@grupos_bp.route('/<int:id>', methods=['PUT'])
def actualizar_grupo(id):
    g = Grupo.query.get_or_404(id)
    data = request.get_json() or {}
    updatable = ('nombre', 'grado', 'orden_promocion')
    for campo in updatable:
        if campo in data:
            setattr(g, campo, data[campo])
    db.session.commit()
    return jsonify({'mensaje': 'Actualizado'}), 200

# 5) DELETE /api/grupos/<int:id> => elimina un grupo
@grupos_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_grupo(id):
    g = Grupo.query.get_or_404(id)
    db.session.delete(g)
    db.session.commit()
    return jsonify({'mensaje': 'Eliminado'}), 200
