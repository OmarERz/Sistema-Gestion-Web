# routes/administradores_dp.py
from flask import Blueprint, request, jsonify
from models import db, Administrador

administradores_bp = Blueprint('administradores_bp', __name__)

# --------- Utilidad ---------
def validate_login_data(user, password):
    if not isinstance(user, str) or not isinstance(password, str):
        return False, "Datos en formato incorrecto."
    if len(user.strip()) == 0 or len(password.strip()) == 0:
        return False, "Los campos no pueden estar vacíos."
    if len(user) > 50 or len(password) > 50:
        return False, "Demasiados caracteres en uno de los campos."
    return True, ""

# --------- CRUD ---------
@administradores_bp.route('/', methods=['GET'])
def listar_administradores():
    admins = Administrador.query.all()
    return jsonify([{
        'id': a.id,
        'usuario': a.usuario,
        'nombre': a.nombre,
        'activo': a.activo,
        'creado_en': a.creado_en.isoformat()
    } for a in admins]), 200

@administradores_bp.route('/', methods=['POST'])
def crear_administrador():
    data = request.get_json() or {}
    usuario = data.get('usuario')
    contrasena = data.get('contrasena')
    nombre = data.get('nombre')
    activo = bool(data.get('activo', True))

    if not usuario or not contrasena or not nombre:
        return jsonify({"mensaje": "usuario, contrasena y nombre son obligatorios"}), 400

    admin = Administrador(usuario=usuario, contrasena=contrasena, nombre=nombre, activo=activo)
    db.session.add(admin)
    db.session.commit()
    return jsonify({"id": admin.id}), 201

@administradores_bp.route('/<int:id>', methods=['PUT'])
def actualizar_administrador(id):
    admin = Administrador.query.get_or_404(id)
    data = request.get_json() or {}
    for campo in ('usuario', 'contrasena', 'nombre', 'activo'):
        if campo in data:
            setattr(admin, campo, data[campo])
    db.session.commit()
    return jsonify({"mensaje": "Actualizado"}), 200

@administradores_bp.route('/<int:id>', methods=['DELETE'])
def eliminar_administrador(id):
    admin = Administrador.query.get_or_404(id)
    db.session.delete(admin)
    db.session.commit()
    return jsonify({"mensaje": "Eliminado"}), 200

# --------- Validación de login ---------
@administradores_bp.route('/validaAdmin', methods=['POST'])
def valida_admin():
    data = request.get_json() or {}
    user = data.get("usuario")
    password = data.get("contrasena")

    valido, mensaje = validate_login_data(user, password)
    if not valido:
        return jsonify({"valido": False, "mensaje": mensaje}), 400

    admin = Administrador.query.filter_by(usuario=user, contrasena=password).first()
    if admin:
        return jsonify({"valido": True})
    else:
        return jsonify({"valido": False, "mensaje": "Usuario o contraseña incorrectos"}), 401
