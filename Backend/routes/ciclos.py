# routes/ciclos.py

from flask import Blueprint, request, jsonify, abort
from models import db, CicloEscolar
from datetime import date

# 1) Creamos el Blueprint
ciclos_bp = Blueprint('ciclos_bp', __name__)

# 2) GET /api/ciclos/ => lista todos los ciclos
@ciclos_bp.route('/', methods=['GET'])
def listar_ciclos():
    ciclos = CicloEscolar.query.all()
    return jsonify([{
        'id': c.id,
        'nombre': c.nombre,
        'fecha_inicio': c.fecha_inicio.isoformat() if c.fecha_inicio else None,
        'fecha_fin': c.fecha_fin.isoformat() if c.fecha_fin else None,
        'activo': c.activo
    } for c in ciclos]), 200

# 2.1) GET /api/ciclos/<int:id> => obtiene un ciclo específico
@ciclos_bp.route('/<int:id>', methods=['GET'])
def obtener_ciclo(id):
    c = CicloEscolar.query.get_or_404(id)
    return jsonify({
        'id': c.id,
        'nombre': c.nombre,
        'fecha_inicio': c.fecha_inicio.isoformat() if c.fecha_inicio else None,
        'fecha_fin': c.fecha_fin.isoformat() if c.fecha_fin else None,
        'activo': c.activo
    }), 200

# 3) POST /api/ciclos/ => crea un ciclo nuevo
@ciclos_bp.route('/', methods=['POST'])
def crear_ciclo():
    data = request.get_json() or {}
    # Validaciones básicas
    for campo in ('nombre','fecha_inicio','fecha_fin','activo'):
        if campo not in data:
            abort(400, description=f"Falta campo obligatorio: {campo}")
    # Parsear fechas ISO -> date
    try:
        fi = date.fromisoformat(data['fecha_inicio'])
        ff = date.fromisoformat(data['fecha_fin'])
    except ValueError:
        abort(400, description="Formato de fecha inválido. Debe ser YYYY-MM-DD")
    # Crear y guardar
    c = CicloEscolar(
        nombre=data['nombre'],
        fecha_inicio=fi,
        fecha_fin=ff,
        activo=data['activo']
    )
    db.session.add(c)
    db.session.commit()
    return jsonify({'id': c.id}), 201

# 4) PUT /api/ciclos/<int:id> => actualiza un ciclo existente
@ciclos_bp.route('/<int:id>', methods=['PUT'])
def actualizar_ciclo(id):
    c = CicloEscolar.query.get_or_404(id)
    data = request.get_json() or {}

    # Campos seguros de actualizar
    updatable = ('nombre', 'fecha_inicio', 
                 'fecha_fin', 'activo')
    for campo in updatable:
        if campo in data:
            if campo in ('fecha_inicio', 'fecha_fin'):
                # Parseamos la fecha si viene en formato ISO 8601
                try:
                    setattr(c, campo, date.fromisoformat(data[campo]))
                except ValueError:
                    abort(400, description=f"Formato inválido en {campo}. Debe ser YYYY-MM-DD")
            else:
                setattr(c, campo, data[campo])

    db.session.commit()
    return jsonify({'mensaje': 'Actualizado'}), 200


# 5) DELETE /api/ciclos/<int:id> => elimina un ciclo
@ciclos_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_ciclo(id):
    c = CicloEscolar.query.get_or_404(id)
    db.session.delete(c)
    db.session.commit()
    return jsonify({'mensaje':'Eliminado'}), 200