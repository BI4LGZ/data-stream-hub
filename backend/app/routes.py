from flask import request, jsonify
from app import db
from app.models import User, ApiKey, DataPoint
from app.utils import generate_api_key
from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

bp = Blueprint("routes", __name__)


@bp.route("/apikeys", methods=["GET"])
@jwt_required()
def get_api_keys():
    current_user_id = int(get_jwt_identity())
    user = db.session.get(User, current_user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    keys = [
        {"id": key.id, "name": key.name, "key": key.key, "categories": key.categories}
        for key in user.api_keys
    ]
    return jsonify(keys)


@bp.route("/apikeys", methods=["POST"])
@jwt_required()
def create_api_key():
    current_user_id = int(get_jwt_identity())
    data = request.get_json()
    if not data or not "name" in data or not "categories" in data:
        return jsonify({"msg": "Missing name or categories"}), 400

    if not isinstance(data["categories"], list):
        return jsonify({"msg": "Categories must be a list of strings"}), 400

    new_key = ApiKey(
        name=data["name"],
        key=generate_api_key(),
        categories=data["categories"],
        user_id=current_user_id,
    )
    db.session.add(new_key)
    db.session.commit()
    return (
        jsonify(
            {
                "id": new_key.id,
                "name": new_key.name,
                "key": new_key.key,
                "categories": new_key.categories,
            }
        ),
        201,
    )


@bp.route("/apikeys/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_api_key(id):
    current_user_id = int(get_jwt_identity())
    key_to_delete = db.session.get(ApiKey, id)
    if not key_to_delete or key_to_delete.user_id != current_user_id:
        return jsonify({"msg": "API Key not found or you don't have permission"}), 404

    db.session.delete(key_to_delete)
    db.session.commit()
    return jsonify({"msg": "API Key deleted successfully"}), 200


@bp.route("/data/<int:api_key_id>", methods=["GET"])
@jwt_required()
def get_data_for_key(api_key_id):
    current_user_id = int(get_jwt_identity())
    api_key = db.session.get(ApiKey, api_key_id)
    if not api_key or api_key.user_id != current_user_id:
        return jsonify({"msg": "API Key not found or you don't have permission"}), 404

    start_date_str = request.args.get("start")
    end_date_str = request.args.get("end")

    query = DataPoint.query.filter_by(api_key_id=api_key.id)

    if start_date_str:
        start_date = datetime.fromisoformat(start_date_str.replace("Z", "+00:00"))
        query = query.filter(DataPoint.timestamp >= start_date)
    if end_date_str:
        end_date = datetime.fromisoformat(end_date_str.replace("Z", "+00:00"))
        query = query.filter(DataPoint.timestamp <= end_date)

    data_points = query.order_by(DataPoint.timestamp.asc()).all()

    result = [
        {"timestamp": dp.timestamp.isoformat(), "data": dp.data} for dp in data_points
    ]

    return jsonify(result)
