from flask import Blueprint, request, jsonify, make_response
from flask_bcrypt import Bcrypt
from config.database import db
from models.user import User
import jwt
import datetime
import os
from flask_cors import CORS, cross_origin
from utils.decorators import token_required
from bson import ObjectId
from datetime import datetime, timedelta
from models.locations import VALID_LOCATION_IDS

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()
CORS(auth_bp, origins="http://localhost:3000") # Enable CORS for the auth blueprint, allowing requests from localhost:3000

@auth_bp.route('/check-email', methods=['GET'])
def check_email():
    email = request.args.get('email')
    users = db.get_collection(User.collection_name)
    user = users.find_one({'email': email})
    if user:
        return jsonify({'exists': True}), 200
    return jsonify({'exists': False}), 200

@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
@cross_origin(origins=["http://localhost:3000"], methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 204
        
    data = request.json
    users = db.get_collection(User.collection_name)
    
    if users.find_one({'email': data['email']}):
        return jsonify({'error': 'Email already exists'}), 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    # Calculate water intake
    base_intake_ml = data['weight'] * 35.0
    
    activity_multipliers = {
        'not_active': 1.0,
        'moderately_active': 1.2,
        'very_active': 1.4
    }
    
    weather_multipliers = {
        'hot': 1.3,
        'moderate': 1.0,
        'cold': 0.9
    }
    
    activity_multiplier = activity_multipliers.get(data['activityLevel'], 1.0)
    weather_multiplier = weather_multipliers.get(data['weatherPreference'], 1.0)
    
    total_ml = base_intake_ml * activity_multiplier * weather_multiplier
    daily_water_intake = total_ml / 1000.0
    
    user = User(
        email=data['email'],
        password=hashed_password,  # Use the hashed password
        name=data['name'],
        sex=data['sex'],
        age=data['age'],
        height=data['height'],
        weight=data['weight'],
        activity_level=data['activityLevel'],
        weather_preference=data['weatherPreference'],
        daily_water_intake=daily_water_intake
    )
    users.insert_one(user.to_dict())
    
    return jsonify({'message': 'User created successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    users = db.get_collection(User.collection_name)
    user = users.find_one({'email': data['email']})
    
    if not user:
        return jsonify({'error': 'User not found'}), 401
        
    if bcrypt.check_password_hash(user['password'], data['password']):
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, os.getenv('JWT_SECRET_KEY'))
        
        return jsonify({'token': token}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/user/<user_id>', methods=['GET'])
@token_required
def get_user(current_user, user_id):
    users = db.get_collection(User.collection_name)
    try:
        user = users.find_one({'_id': ObjectId(user_id)})
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Remove sensitive information
        user.pop('password', None)
        user['_id'] = str(user['_id'])  # Convert ObjectId to string
        
        return jsonify(user), 200
    except:
        return jsonify({'error': 'Invalid user ID'}), 400

@auth_bp.route('/user/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    # current_user is already retrieved by the token_required decorator
    # Remove sensitive information
    user_dict = current_user.copy()
    user_dict.pop('password', None)
    user_dict['_id'] = str(user_dict['_id'])  # Convert ObjectId to string
    
    return jsonify(user_dict), 200

@auth_bp.route('/checkin', methods=['POST'])
@token_required
def checkin(current_user):
    data = request.json
    location_id = data.get('locationId')
    
    if not location_id or location_id not in VALID_LOCATION_IDS:
        return jsonify({'error': 'Invalid location ID'}), 400
        
    users = db.get_collection(User.collection_name)
    user_id = current_user['_id']
    
    # Check if user is not disabled
    now = datetime.utcnow()
    if current_user.get('disabledUntil') and current_user['disabledUntil'] > now:
        return jsonify({
            'error': 'Please wait before checking in again',
            'waitUntil': current_user['disabledUntil']
        }), 400

    # Update user's points, takenWater, and set disabled time
    update_result = users.update_one(
        {'_id': user_id},
        {
            '$inc': {
                'points': 10,
                'takenWater': 300
            },
            '$set': {
                'disabledUntil': now + timedelta(minutes=20),
                'lastLocationId': location_id  # Track last check-in location
            }
        }
    )

    if update_result.modified_count > 0:
        return jsonify({
            'message': 'Check-in successful',
            'pointsEarned': 10,
            'waterAdded': 300,
            'location': location_id
        }), 200
    
    return jsonify({'error': 'Check-in failed'}), 400

@auth_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    users = db.get_collection(User.collection_name)
    pipeline = [
        {
            '$project': {
                'name': 1,
                'points': 1,
                'takenWater': 1
            }
        },
        {
            '$sort': {
                'points': -1
            }
        },
        {
            '$limit': 10
        }
    ]
    
    leaderboard = list(users.aggregate(pipeline))
    for user in leaderboard:
        user['_id'] = str(user['_id'])
    
    return jsonify(leaderboard)

@auth_bp.route('/reset-daily', methods=['POST'])
@token_required
def reset_daily(current_user):
    users = db.get_collection(User.collection_name)
    update_result = users.update_many(
        {},
        {
            '$set': {
                'takenWater': 0
            }
        }
    )
    
    return jsonify({
        'message': 'Daily water intake reset successful',
        'usersUpdated': update_result.modified_count
    }), 200
