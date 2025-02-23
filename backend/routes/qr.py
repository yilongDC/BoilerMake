from flask import Blueprint, request, jsonify, make_response
from flask_cors import CORS
from config.database import db
from models.scan import Scan
from utils.decorators import token_required
from datetime import datetime, timedelta
from bson import ObjectId

qr_bp = Blueprint('qr', __name__)

# Update CORS configuration for the blueprint
CORS(qr_bp, 
     resources={
         r"/*": {
             "origins": "http://localhost:3000",
             "methods": ["GET", "POST", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True
         }
     })

VALID_QR_CODES = {
    'yayayay': {
        'name': 'yayayay'
    },
    'QR1': {
        'name': 'Station 1'
    },
    'QR2': {
        'name': 'Station 2'
    },
    'QR3': {
        'name': 'Station 3'
    }
}
POINTS_PER_SCAN = 20
COOLDOWN_MINUTES = 20

@qr_bp.route('/scan', methods=['POST', 'OPTIONS'])
def scan_qr():
    print("Received QR scan request")
    print(f"Request method: {request.method}, request: {request.json}")
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

    from utils.decorators import token_required
    @token_required
    def handle_post(current_user):
        data = request.json
        qr_code = data.get('qr_code', '').strip()
        
        print(f"Received QR code: '{qr_code}'")
        print(f"Valid QR codes: {list(VALID_QR_CODES.keys())}")
        
        # Case-insensitive comparison
        qr_code_lower = qr_code.lower()
        valid_codes_lower = {k.lower(): v for k, v in VALID_QR_CODES.items()}
        
        if not qr_code or qr_code_lower not in valid_codes_lower:
            return jsonify({
                'error': 'Invalid QR code',
                'received': qr_code,
                'valid_codes': list(VALID_QR_CODES.keys())
            }), 400
        
        # Use the original case-sensitive key for further processing
        original_qr_code = next(k for k in VALID_QR_CODES.keys() if k.lower() == qr_code_lower)
        
        # Check cooldown
        scans = db.get_collection(Scan.collection_name)
        cooldown_time = datetime.utcnow() - timedelta(minutes=COOLDOWN_MINUTES)
        recent_scan = scans.find_one({
            'user_id': str(current_user['_id']),
            'qr_code': original_qr_code,
            'scanned_at': {'$gte': cooldown_time}
        })
        
        if recent_scan:
            return jsonify({'error': 'Please wait before scanning this QR code again'}), 429
        
        # Record the scan
        new_scan = Scan(str(current_user['_id']), original_qr_code)
        scans.insert_one(new_scan.to_dict())
        
        # Update user points
        users = db.get_collection('users')
        users.update_one(
            {'_id': ObjectId(current_user['_id'])},
            {'$inc': {'points': POINTS_PER_SCAN}}
        )
        
        return jsonify({
            'message': 'QR code scanned successfully',
            'points_earned': POINTS_PER_SCAN
        }), 200

    return handle_post()

@qr_bp.route('/leaderboard', methods=['GET', 'OPTIONS'])
def get_leaderboard():
    # if request.method == 'OPTIONS':
    #     response = make_response()
    #     response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    #     response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    #     response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
    #     return response

    from utils.decorators import token_required
    @token_required
    def handle_get(current_user):
        users = db.get_collection('users')
        leaderboard = users.find(
            {},
            {'name': 1, 'points': 1}
        ).sort('points', -1).limit(10)
        
        return jsonify([{
            'name': user['name'],
            'points': user.get('points', 0)
        } for user in leaderboard]), 200

    return handle_get()
