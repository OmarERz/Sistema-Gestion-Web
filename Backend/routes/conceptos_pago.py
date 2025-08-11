# routes/conceptos_pago.py

from flask import Blueprint, request, jsonify, abort
from models import db, ConceptoPago

# 1) Creamos el Blueprint para conceptos de pago
conceptos_pago_bp = Blueprint('conceptos_pago_bp', __name__)

# Inicializar conceptos por defecto si no existen

# 2) GET /api/conceptos_pago/ => lista todos los conceptos
@conceptos_pago_bp.route('/', methods=['GET'])
def listar_conceptos_pago():
    conceptos = ConceptoPago.query.all()
    return jsonify([{
        'id': c.id,
        'nombre': c.nombre,
        'obligatorio': c.obligatorio,
        'aplica_descuento': c.aplica_descuento,
        'aplica_recargo': c.aplica_recargo,
        'tipo': c.tipo
    } for c in conceptos]), 200

# 2.1) GET /api/conceptos_pago/<int:id> => obtiene un concepto específico
@conceptos_pago_bp.route('/<int:id>', methods=['GET'])
def obtener_concepto_pago(id):
    c = ConceptoPago.query.get_or_404(id)
    return jsonify({
        'id': c.id,
        'nombre': c.nombre,
        'obligatorio': c.obligatorio,
        'aplica_descuento': c.aplica_descuento,
        'aplica_recargo': c.aplica_recargo,
        'tipo': c.tipo
    }), 200

# 3) POST /api/conceptos_pago/ => crea un concepto nuevo
@conceptos_pago_bp.route('/', methods=['POST'])
def crear_concepto_pago():
    data = request.get_json() or {}
    # Campos obligatorios
    required = ('nombre', 'obligatorio', 'aplica_descuento', 'aplica_recargo')
    for campo in required:
        if campo not in data:
            abort(400, description=f"Falta campo obligatorio: {campo}")

    # Crear y guardar
    c = ConceptoPago(
        nombre=data['nombre'],
        obligatorio=data['obligatorio'],
        aplica_descuento=data['aplica_descuento'],
        aplica_recargo=data['aplica_recargo'],
        tipo=data.get('tipo')
    )
    db.session.add(c)
    db.session.commit()
    return jsonify({'id': c.id}), 201

# 4) PUT /api/conceptos_pago/<int:id> => actualiza un concepto existente
@conceptos_pago_bp.route('/<int:id>', methods=['PUT'])
def actualizar_concepto_pago(id):
    c = ConceptoPago.query.get_or_404(id)
    data = request.get_json() or {}
    # Campos seguros de actualizar
    updatable = ('nombre', 'obligatorio', 'aplica_descuento', 'aplica_recargo', 'tipo')
    for campo in updatable:
        if campo in data:
            setattr(c, campo, data[campo])
    db.session.commit()
    return jsonify({'mensaje': 'Actualizado'}), 200

# 5) DELETE /api/conceptos_pago/<int:id> => elimina un concepto
@conceptos_pago_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_concepto_pago(id):
    c = ConceptoPago.query.get_or_404(id)
    db.session.delete(c)
    db.session.commit()
    return jsonify({'mensaje': 'Eliminado'}), 200