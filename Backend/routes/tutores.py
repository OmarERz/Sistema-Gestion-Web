#routes/tutores.py

from flask import Blueprint, request, jsonify, abort
from models import db, Tutor

# 1) Creamos el Blueprint
tutores_bp = Blueprint('tutores_bp', __name__)

# 2) GET /api/tutor/ => lista de todos los tutores
@tutores_bp.route('/', methods=['GET'])
def listar_tutores():
    tutores = Tutor.query.all()
    return jsonify([{
        'id':t.id,
        'nombre': t.nombre,
        'apellido_paterno': t.apellido_paterno,
        'apellido_materno': t.apellido_materno,
        'telefono': t.telefono,
        'correo': t.correo,
        'relacion_con_alumno': t.relacion_con_alumno
    }for t in tutores]), 200

# 3) POST /api/tutor/ => crea un tutor nuevo
@tutores_bp.route('/', methods=['POST'])
def crear_tutor():
    data = request.get_json() or {}
    #Validaciones básicas
    for campo in ('nombre','apellido_paterno','apellido_materno','telefono','relacion_con_alumno'):
        if campo not in data:
            abort(400, description=f"Falta campo obligatorio: {campo}")
    #Crear y guardar
    t = Tutor(
        nombre=data['nombre'],
        apellido_paterno=data['apellido_paterno'],
        apellido_materno=data['apellido_materno'],
        telefono=data['telefono'],
        correo=data['correo'],
        relacion_con_alumno=data['relacion_con_alumno']
    )
    db.session.add(t)
    db.session.commit()
    return jsonify({'id': t.id}), 201

# 4) PUT /api/tutor/<int:id> => actualiza un tutor
@tutores_bp.route('/<int:id>', methods = ['PUT'])
def actualizar_tutor(id):
    t = Tutor.query.get_or_404(id)
    data = request.get_json() or{}
    #Solo se actualizamos los campos permitidos
    for campo in ('nombre','apellido_paterno','apellido_materno','telefono','correo','relacion_con_alumno'):
        if campo in data:
            setattr(t, campo, data[campo])
    db.session.commit()
    return jsonify({'mensaje':'Actualizado'}), 200

# 5) DELETE /api/tutor/<int:id> => baja fisica o logica
@tutores_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_tutor(id):
    t = Tutor.query.get_or_404(id)
    db.session.delete(t)
    db.session.commit()
    return jsonify({'mensaje':'Eliminado'}), 200