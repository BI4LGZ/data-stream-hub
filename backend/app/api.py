from flask import request, jsonify
from app import db
from app.models import ApiKey, DataPoint
from flask import Blueprint

bp = Blueprint("api", __name__)


@bp.route("/data/<string:api_key_str>", methods=["POST"])
def receive_data(api_key_str):
    api_key = ApiKey.query.filter_by(key=api_key_str).first()
    if not api_key:
        return jsonify({"error": "Invalid API Key"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400

    defined_categories = set(api_key.categories)

    filtered_data = {
        key: value for key, value in data.items() if key in defined_categories
    }

    if not filtered_data:
        return (
            jsonify(
                {
                    "error": "No valid data categories received.",
                    "valid_categories": list(defined_categories),
                }
            ),
            400,
        )

    new_data_point = DataPoint(data=filtered_data, api_key_id=api_key.id)
    db.session.add(new_data_point)
    db.session.commit()

    return jsonify({"message": "Data received successfully"}), 201
