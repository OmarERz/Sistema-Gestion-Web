# routes/gastos.py

from flask import Blueprint, request, jsonify, abort
from models import db, Gasto
from datetime import date

gastos_bp = Blueprint('gastos_bp', __name__)

# 1) GET /api/gastos/ => lista todos los gastos
@gastos_bp.route('/', methods=['GET'])
def listar_gastos():
    gastos = Gasto.query.order_by(Gasto.fecha.desc()).all()
    return jsonify([{
        'id': g.id,
        'descripcion': g.descripcion,
        'monto': g.monto,
        'categoria': g.categoria,
        'fecha': g.fecha.isoformat() if g.fecha else None
    } for g in gastos]), 200

# 2) GET /api/gastos/<int:id> => obtiene un gasto específico
@gastos_bp.route('/<int:id>', methods=['GET'])
def obtener_gasto(id):
    g = Gasto.query.get_or_404(id)
    return jsonify({
        'id': g.id,
        'descripcion': g.descripcion,
        'monto': g.monto,
        'categoria': g.categoria,
        'fecha': g.fecha.isoformat() if g.fecha else None
    }), 200

# 3) POST /api/gastos/ => crea un gasto nuevo
@gastos_bp.route('/', methods=['POST'])
def crear_gasto():
    data = request.get_json() or {}
    # Campos obligatorios
    required = ('descripcion', 'monto', 'categoria', 'fecha')
    for campo in required:
        if campo not in data:
            abort(400, description=f"Falta campo obligatorio: {campo}")

    # Parseamos fecha ISO -> date
    try:
        fecha = date.fromisoformat(data['fecha'])
    except ValueError:
        abort(400, description="Formato de fecha inválido. Debe ser YYYY-MM-DD")

    # Creamos y guardamos
    g = Gasto(
        descripcion=data['descripcion'],
        monto=data['monto'],
        categoria=data['categoria'],
        fecha=fecha
    )
    db.session.add(g)
    db.session.commit()
    return jsonify({'id': g.id}), 201

# 4) PUT /api/gastos/<int:id> => actualiza un gasto existente
@gastos_bp.route('/<int:id>', methods=['PUT'])
def actualizar_gasto(id):
    g = Gasto.query.get_or_404(id)
    data = request.get_json() or {}

    # Campos seguros de actualizar
    updatable = ('descripcion', 'monto', 'categoria', 'fecha')
    for campo in updatable:
        if campo in data:
            if campo == 'fecha':
                try:
                    setattr(g, campo, date.fromisoformat(data[campo]))
                except ValueError:
                    abort(400, description="Formato de fecha inválido. Debe ser YYYY-MM-DD")
            else:
                setattr(g, campo, data[campo])

    db.session.commit()
    return jsonify({'mensaje': 'Actualizado'}), 200

# 5) DELETE /api/gastos/<int:id> => elimina un gasto
@gastos_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_gasto(id):
    g = Gasto.query.get_or_404(id)
    db.session.delete(g)
    db.session.commit()
    return jsonify({'mensaje': 'Eliminado'}), 200
