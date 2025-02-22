from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from config.database import db
from models.user import User
import jwt
import datetime
import os
from flask_cors import CORS

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

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    users = db.get_collection(User.collection_name)
    
    if users.find_one({'email': data['email']}):
        return jsonify({'error': 'Email already exists'}), 400
    
    # Use the actual password from the request instead of a temp password
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    user = User(
        email=data['email'],
        password=hashed_password,  # Use the hashed password
        name=data['name'],
        sex=data['sex'],
        age=data['age'],
        height=data['height'],
        weight=data['weight'],
        activity_level=data['activityLevel'],
        weather_preference=data['weatherPreference']
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
