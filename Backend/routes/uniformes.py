# routes/uniformes.py

from flask import Blueprint, request, jsonify, abort
from models import db, Uniforme

# 1) Creamos el Blueprint para uniformes
uniformes_bp = Blueprint('uniformes_bp', __name__)

# 2) GET /api/uniformes/ => lista todos los uniformes
@uniformes_bp.route('/', methods=['GET'])
def listar_uniformes():
    uniformes = Uniforme.query.all()
    return jsonify([{
        'id': u.id,
        'prenda': u.prenda,
        'talla': u.talla,
        'precio_base': u.precio_base
    } for u in uniformes]), 200

# 2.1) GET /api/uniformes/<int:id> => obtiene un uniforme específico
@uniformes_bp.route('/<int:id>', methods=['GET'])
def obtener_uniforme(id):
    u = Uniforme.query.get_or_404(id)
    return jsonify({
        'id': u.id,
        'prenda': u.prenda,
        'talla': u.talla,
        'precio_base': u.precio_base
    }), 200

# 3) POST /api/uniformes/ => crea un uniforme nuevo
@uniformes_bp.route('/', methods=['POST'])
def crear_uniforme():
    data = request.get_json() or {}
    # Campos obligatorios
    required = ('prenda', 'talla', 'precio_base')
    for campo in required:
        if campo not in data:
            abort(400, description=f"Falta campo obligatorio: {campo}")
    # Crear y guardar
    u = Uniforme(
        prenda=data['prenda'],
        talla=data['talla'],
        precio_base=data['precio_base']
    )
    db.session.add(u)
    db.session.commit()
    return jsonify({'id': u.id}), 201

# 4) PUT /api/uniformes/<int:id> => actualiza un uniforme existente
@uniformes_bp.route('/<int:id>', methods=['PUT'])
def actualizar_uniforme(id):
    u = Uniforme.query.get_or_404(id)
    data = request.get_json() or {}
    # Campos seguros de actualizar
    updatable = ('prenda', 'talla', 'precio_base')
    for campo in updatable:
        if campo in data:
            setattr(u, campo, data[campo])
    db.session.commit()
    return jsonify({'mensaje': 'Actualizado'}), 200

# 5) DELETE /api/uniformes/<int:id> => elimina un uniforme
@uniformes_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_uniforme(id):
    u = Uniforme.query.get_or_404(id)
    db.session.delete(u)
    db.session.commit()
    return jsonify({'mensaje': 'Eliminado'}), 200