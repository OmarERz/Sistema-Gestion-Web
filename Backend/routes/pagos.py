# routes/pagos.py

from flask import Blueprint, request, jsonify, abort
from models import db, Pago
from datetime import date

# Helpers de estado (alineado al CHECK de la BD)
VALIDOS_ESTADO = {'Pendiente', 'Pagado', 'Cancelado', 'En revisión'}

def normaliza_estado(valor):
    """
    Convierte cualquier variante común a uno de los 4 valores válidos del CHECK.
    """
    s = (str(valor) or '').strip().lower()
    if s in {'pendiente', 'pend', 'p'}:
        return 'Pendiente'
    if s in {'pagado', 'pago'}:
        return 'Pagado'
    if s in {'cancelado', 'canc'}:
        return 'Cancelado'
    if s in {'en revision', 'en revisión', 'revision', 'revisión', 'en_rev', 'en-revision'}:
        return 'En revisión'
    # por defecto
    return 'Pendiente'

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

    #  Normalizar/validar estado_pago
    estado = normaliza_estado(data.get('estado_pago'))
    if estado not in VALIDOS_ESTADO:
        estado = 'Pendiente'

    #  Sincronizar booleano pagado con estado (consistencia)
    pagado_bool = (estado == 'Pagado')

    # Crear y guardar el pago
    p = Pago(
        fecha_pago=fp,
        monto=data['monto'],
        descuento=data['descuento'],
        recargo=data['recargo'],
        pagado=pagado_bool,
        estado_pago=estado,         
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
                    p.fecha_pago = date.fromisoformat(str(data[campo]))
                except ValueError:
                    abort(400, description="Formato de fecha_pago inválido. Debe ser YYYY-MM-DD")

            elif campo == 'estado_pago':
                estado_norm = normaliza_estado(data[campo])
                if estado_norm not in VALIDOS_ESTADO:
                    abort(400, description="estado_pago inválido (usa: Pendiente, Pagado, Cancelado o En revisión)")
                p.estado_pago = estado_norm
                p.pagado = (estado_norm == 'Pagado')

            elif campo == 'pagado':
                p.pagado = bool(data['pagado'])
                # Si marcan pagado True/False, sincroniza el estado
                p.estado_pago = 'Pagado' if p.pagado else 'Pendiente'
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