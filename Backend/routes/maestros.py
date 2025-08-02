# routes/maestros.py

from flask import Blueprint, request, jsonify, abort
from models import db, Maestro

# 1) Creamos el Blueprint para maestros
maestros_bp = Blueprint('maestros_bp', __name__)

# 2) GET /api/maestros/ => lista todos los maestros
@maestros_bp.route('/', methods=['GET'])
def listar_maestros():
    maestros = Maestro.query.all()
    return jsonify([{
        'id': m.id,
        'nombre': m.nombre,
        'apellido_paterno': m.apellido_paterno,
        'apellido_materno': m.apellido_materno,
        'telefono': m.telefono,
        'correo': m.correo
    } for m in maestros]), 200

# 2.1) GET /api/maestros/<int:id> => obtiene un maestro específico
@maestros_bp.route('/<int:id>', methods=['GET'])
def obtener_maestro(id):
    m = Maestro.query.get_or_404(id)
    return jsonify({
        'id': m.id,
        'nombre': m.nombre,
        'apellido_paterno': m.apellido_paterno,
        'apellido_materno': m.apellido_materno,
        'telefono': m.telefono,
        'correo': m.correo
    }), 200

# 3) POST /api/maestros/ => crea un maestro nuevo
@maestros_bp.route('/', methods=['POST'])
def crear_maestro():
    data = request.get_json() or {}
    # Campos obligatorios
    required = ('nombre', 'apellido_paterno', 'apellido_materno', 'telefono')
    for campo in required:
        if campo not in data:
            abort(400, description=f"Falta campo obligatorio: {campo}")
    # Crear y guardar
    m = Maestro(
        nombre=data['nombre'],
        apellido_paterno=data['apellido_paterno'],
        apellido_materno=data['apellido_materno'],
        telefono=data['telefono'],
        correo=data.get('correo')  # opcional
    )
    db.session.add(m)
    db.session.commit()
    return jsonify({'id': m.id}), 201

# 4) PUT /api/maestros/<int:id> => actualiza un maestro existente
@maestros_bp.route('/<int:id>', methods=['PUT'])
def actualizar_maestro(id):
    m = Maestro.query.get_or_404(id)
    data = request.get_json() or {}
    # Campos seguros de actualizar
    updatable = ('nombre', 'apellido_paterno', 'apellido_materno', 'telefono', 'correo')
    for campo in updatable:
        if campo in data:
            setattr(m, campo, data[campo])
    db.session.commit()
    return jsonify({'mensaje': 'Actualizado'}), 200

# 5) DELETE /api/maestros/<int:id> => elimina un maestro
@maestros_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_maestro(id):
    m = Maestro.query.get_or_404(id)
    db.session.delete(m)
    db.session.commit()
    return jsonify({'mensaje': 'Eliminado'}), 200
