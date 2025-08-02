# routes/pagos.py

from flask import Blueprint, request, jsonify, abort
from models import db, Pago
from datetime import date

# 1) Creamos el Blueprint para pagos
pagos_bp = Blueprint('pagos_bp', __name__)

# 2) GET /api/pagos/ => lista todos los pagos
@pagos_bp.route('/', methods=['GET'])
def listar_pagos():
    pagos = Pago.query.all()
    return jsonify([{
        'id': p.id,
        'fecha_pago': p.fecha_pago.isoformat() if p.fecha_pago else None,
        'monto': p.monto,
        'descuento': p.descuento,
        'recargo': p.recargo,
        'pagado': p.pagado,
        'estado_pago': p.estado_pago,
        'alumno_id': p.alumno_id,
        'concepto_id': p.concepto_id
    } for p in pagos]), 200

# 2.1) GET /api/pagos/<int:id> => obtiene un pago específico
@pagos_bp.route('/<int:id>', methods=['GET'])
def obtener_pago(id):
    p = Pago.query.get_or_404(id)
    return jsonify({
        'id': p.id,
        'fecha_pago': p.fecha_pago.isoformat() if p.fecha_pago else None,
        'monto': p.monto,
        'descuento': p.descuento,
        'recargo': p.recargo,
        'pagado': p.pagado,
        'estado_pago': p.estado_pago,
        'alumno_id': p.alumno_id,
        'concepto_id': p.concepto_id
    }), 200

# 3) POST /api/pagos/ => crea un pago nuevo
@pagos_bp.route('/', methods=['POST'])
def crear_pago():
    data = request.get_json() or {}
    required = (
        'fecha_pago', 'monto', 'descuento', 'recargo',
        'pagado', 'estado_pago', 'alumno_id', 'concepto_id'
    )
    # Validaciones básicas
    for campo in required:
        if campo not in data:
            abort(400, description=f"Falta campo obligatorio: {campo}")

    # Parseamos fecha ISO -> date
    try:
        fp = date.fromisoformat(data['fecha_pago'])
    except ValueError:
        abort(400, description="Formato de fecha_pago inválido. Debe ser YYYY-MM-DD")

    # Crear y guardar el pago
    p = Pago(
        fecha_pago=fp,
        monto=data['monto'],
        descuento=data['descuento'],
        recargo=data['recargo'],
        pagado=data['pagado'],
        estado_pago=data['estado_pago'],
        alumno_id=data['alumno_id'],
        concepto_id=data['concepto_id']
    )
    db.session.add(p)
    db.session.commit()
    return jsonify({'id': p.id}), 201

# 4) PUT /api/pagos/<int:id> => actualiza un pago existente
@pagos_bp.route('/<int:id>', methods=['PUT'])
def actualizar_pago(id):
    p = Pago.query.get_or_404(id)
    data = request.get_json() or {}

    # Campos seguros de actualizar
    updatable = ('fecha_pago', 'monto', 'descuento', 'recargo', 'pagado', 'estado_pago')
    for campo in updatable:
        if campo in data:
            if campo == 'fecha_pago':
                try:
                    setattr(p, campo, date.fromisoformat(data[campo]))
                except ValueError:
                    abort(400, description="Formato de fecha_pago inválido. Debe ser YYYY-MM-DD")
            else:
                setattr(p, campo, data[campo])

    db.session.commit()
    return jsonify({'mensaje': 'Actualizado'}), 200

# 5) DELETE /api/pagos/<int:id> => elimina un pago
@pagos_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_pago(id):
    p = Pago.query.get_or_404(id)
    db.session.delete(p)
    db.session.commit()
    return jsonify({'mensaje': 'Eliminado'}), 200
