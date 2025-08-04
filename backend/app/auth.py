from flask import request, jsonify
from app import db
from app.models import User
from flask import Blueprint
from flask_jwt_extended import create_access_token

bp = Blueprint("auth", __name__)


@bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if (
        not data
        or not "username" in data
        or not "email" in data
        or not "password" in data
    ):
        return jsonify({"msg": "Missing username, email, or password"}), 400
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"msg": "Username already exists"}), 400
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "Email already exists"}), 400

    user = User(username=data["username"], email=data["email"])
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User created successfully"}), 201


@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not "email" in data or not "password" in data:
        return jsonify({"msg": "Missing email or password"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if user is None or not user.check_password(data["password"]):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token, username=user.username)
