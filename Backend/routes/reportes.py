# routes/reportes.py

from flask import Blueprint, request, jsonify, abort
from models import db, Reporte
from datetime import date

# 1) Creamos el Blueprint para reportes
reportes_bp = Blueprint('reportes_bp', __name__)

# 2) GET /api/reportes/ => lista todos los reportes
@reportes_bp.route('/', methods=['GET'])
def listar_reportes():
    reportes = Reporte.query.all()
    return jsonify([{
        'id': r.id,
        'tipo': r.tipo,
        'descripcion': r.descripcion,
        'fecha_creacion': r.fecha_creacion.isoformat() if r.fecha_creacion else None,
        'url_archivo': r.url_archivo
    } for r in reportes]), 200

# 2.1) GET /api/reportes/<int:id> => obtiene un reporte específico
@reportes_bp.route('/<int:id>', methods=['GET'])
def obtener_reporte(id):
    r = Reporte.query.get_or_404(id)
    return jsonify({
        'id': r.id,
        'tipo': r.tipo,
        'descripcion': r.descripcion,
        'fecha_creacion': r.fecha_creacion.isoformat() if r.fecha_creacion else None,
        'url_archivo': r.url_archivo
    }), 200

# 3) POST /api/reportes/ => crea un reporte nuevo
@reportes_bp.route('/', methods=['POST'])
def crear_reporte():
    data = request.get_json() or {}
    required = ('tipo', 'descripcion', 'fecha_creacion', 'url_archivo')
    for campo in required:
        if campo not in data:
            abort(400, description=f"Falta campo obligatorio: {campo}")
    # Parsear fecha ISO -> date
    try:
        fc = date.fromisoformat(data['fecha_creacion'])
    except ValueError:
        abort(400, description="Formato de fecha_creacion inválido. Debe ser YYYY-MM-DD")
    # Crear y guardar
    r = Reporte(
        tipo=data['tipo'],
        descripcion=data['descripcion'],
        fecha_creacion=fc,
        url_archivo=data['url_archivo']
    )
    db.session.add(r)
    db.session.commit()
    return jsonify({'id': r.id}), 201

# 4) PUT /api/reportes/<int:id> => actualiza un reporte existente
@reportes_bp.route('/<int:id>', methods=['PUT'])
def actualizar_reporte(id):
    r = Reporte.query.get_or_404(id)
    data = request.get_json() or {}
    updatable = ('tipo', 'descripcion', 'fecha_creacion', 'url_archivo')
    for campo in updatable:
        if campo in data:
            if campo == 'fecha_creacion':
                try:
                    setattr(r, campo, date.fromisoformat(data[campo]))
                except ValueError:
                    abort(400, description="Formato de fecha_creacion inválido. Debe ser YYYY-MM-DD")
            else:
                setattr(r, campo, data[campo])
    db.session.commit()
    return jsonify({'mensaje': 'Actualizado'}), 200

# 5) DELETE /api/reportes/<int:id> => elimina un reporte
@reportes_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_reporte(id):
    r = Reporte.query.get_or_404(id)
    db.session.delete(r)
    db.session.commit()
    return jsonify({'mensaje': 'Eliminado'}), 200