from flask import Blueprint, request, jsonify
from config.database import db
from datetime import datetime
from data.properties import VALID_LOCATION_IDS  # Updated import

checkin_bp = Blueprint('checkin', __name__)

@checkin_bp.route('/checkin', methods=['POST', 'OPTIONS'])
def checkin():
    if request.method == 'OPTIONS':
        response = jsonify(success=True)
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response
        
    data = request.get_json()
    location_id = data.get('locationId')
    
    if not location_id or location_id not in VALID_LOCATION_IDS:
        return jsonify({'error': 'Invalid location ID'}), 400
        
    try:
        return jsonify({
            'message': 'Check-in successful!',
            'points_earned': 10,
            'location': location_id
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

