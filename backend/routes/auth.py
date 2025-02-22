from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from config.database import db
from models.user import User
import jwt
import datetime
import os

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    users = db.get_collection(User.collection_name)
    
    if users.find_one({'email': data['email']}):
        return jsonify({'error': 'Email already exists'}), 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(data['email'], hashed_password)
    users.insert_one(user.to_dict())
    
    return jsonify({'message': 'User created successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    users = db.get_collection(User.collection_name)
    user = users.find_one({'email': data['email']})
    
    if user and bcrypt.check_password_hash(user['password'], data['password']):
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, os.getenv('JWT_SECRET_KEY'))
        
        return jsonify({'token': token})
    
    return jsonify({'error': 'Invalid credentials'}), 401
