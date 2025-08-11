# routes/pagos_maestros.py

from flask import Blueprint, request, jsonify, abort
from models import db, PagoMaestro  # Ajusta el path si tu módulo está en otro paquete
from datetime import date

# 1) Creamos el Blueprint para pagos a maestros
pagos_maestros_bp = Blueprint('pagos_maestros_bp', __name__)

# 2) GET /api/pagos_maestros/ => lista todos los pagos a maestros
@pagos_maestros_bp.route('/', methods=['GET'])
def listar_pagos_maestros():
    pagos = PagoMaestro.query.all()
    return jsonify([{
        'id': p.id,
        'maestro_id': p.maestro_id,
        'fecha_pago': p.fecha_pago.isoformat() if p.fecha_pago else None,
        'monto_base': p.monto_base,
        'descuento': p.descuento,
        'monto_final': p.monto_final
    } for p in pagos]), 200

# 2.1) GET /api/pagos_maestros/<int:id> => obtiene un pago específico
@pagos_maestros_bp.route('/<int:id>', methods=['GET'])
def obtener_pago_maestro(id):
    p = PagoMaestro.query.get_or_404(id)
    return jsonify({
        'id': p.id,
        'maestro_id': p.maestro_id,
        'fecha_pago': p.fecha_pago.isoformat() if p.fecha_pago else None,
        'monto_base': p.monto_base,
        'descuento': p.descuento,
        'monto_final': p.monto_final
    }), 200

# 3) POST /api/pagos_maestros/ => crea un pago nuevo
@pagos_maestros_bp.route('/', methods=['POST'])
def crear_pago_maestro():
    data = request.get_json() or {}
    required = ('maestro_id', 'fecha_pago', 'monto_base', 'descuento', 'monto_final')
    for campo in required:
        if campo not in data:
            abort(400, description=f"Falta campo obligatorio: {campo}")
    # Parsear fecha ISO -> date
    try:
        fp = date.fromisoformat(data['fecha_pago'])
    except ValueError:
        abort(400, description="Formato de fecha_pago inválido. Debe ser YYYY-MM-DD")
    p = PagoMaestro(
        maestro_id=data['maestro_id'],
        fecha_pago=fp,
        monto_base=data['monto_base'],
        descuento=data['descuento'],
        monto_final=data['monto_final']
    )
    db.session.add(p)
    db.session.commit()
    return jsonify({'id': p.id}), 201

# 4) PUT /api/pagos_maestros/<int:id> => actualiza un pago existente
@pagos_maestros_bp.route('/<int:id>', methods=['PUT'])
def actualizar_pago_maestro(id):
    p = PagoMaestro.query.get_or_404(id)
    data = request.get_json() or {}
    updatable = ('maestro_id', 'fecha_pago', 'monto_base', 'descuento', 'monto_final')
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

# 5) DELETE /api/pagos_maestros/<int:id> => elimina un pago
@pagos_maestros_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_pago_maestro(id):
    p = PagoMaestro.query.get_or_404(id)
    db.session.delete(p)
    db.session.commit()
    return jsonify({'mensaje': 'Eliminado'}), 200