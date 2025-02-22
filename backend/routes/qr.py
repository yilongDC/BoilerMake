from flask import Blueprint, request, jsonify
from flask_cors import cross_origin, CORS
from config.database import db
from models.scan import Scan
from utils.decorators import token_required
from datetime import datetime, timedelta
from bson import ObjectId

qr_bp = Blueprint('qr', __name__)
CORS(qr_bp, origins="http://localhost:3000")

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
@cross_origin(origins=["http://localhost:3000"], methods=['POST', 'OPTIONS'])
@token_required
def scan_qr(current_user):
    if request.method == 'OPTIONS':
        return '', 204

    data = request.json
    qr_code = data.get('qr_code')
    
    if not qr_code or qr_code not in VALID_QR_CODES:
        return jsonify({'error': 'Invalid QR code'}), 400
    
    # Check cooldown
    scans = db.get_collection(Scan.collection_name)
    cooldown_time = datetime.utcnow() - timedelta(minutes=COOLDOWN_MINUTES)
    recent_scan = scans.find_one({
        'user_id': str(current_user['_id']),
        'qr_code': qr_code,
        'scanned_at': {'$gte': cooldown_time}
    })
    
    if recent_scan:
        return jsonify({'error': 'Please wait before scanning this QR code again'}), 429
    
    # Record the scan
    new_scan = Scan(str(current_user['_id']), qr_code)
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

@qr_bp.route('/leaderboard', methods=['GET', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], methods=['GET', 'OPTIONS'])
@token_required
def get_leaderboard(current_user):
    if request.method == 'OPTIONS':
        return '', 204

    users = db.get_collection('users')
    leaderboard = users.find(
        {},
        {'name': 1, 'points': 1}
    ).sort('points', -1).limit(10)
    
    return jsonify([{
        'name': user['name'],
        'points': user.get('points', 0)
    } for user in leaderboard]), 200
