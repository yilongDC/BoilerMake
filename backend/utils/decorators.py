from functools import wraps
from flask import request, jsonify
import jwt
from config.config import SECRET_KEY
from config.database import db
from bson import ObjectId

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        print(f"Auth header received: {auth_header}")  # Debug log
        
        if auth_header:
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                print("Malformed Authorization header")
                return jsonify({'error': 'Token is invalid'}), 401
        
        if not token:
            print("No token found")
            return jsonify({'error': 'Token is missing'}), 401

        try:
            print(f"Decoding token: {token[:20]}...")  # Debug log
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            users = db.get_collection('users')
            current_user = users.find_one({'_id': ObjectId(data['user_id'])})
            
            if not current_user:
                print(f"No user found for ID: {data['user_id']}")
                return jsonify({'error': 'User not found'}), 401
                
            print(f"User authenticated: {current_user['email']}")  # Debug log
            
        except jwt.ExpiredSignatureError:
            print("Token expired")
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError as e:
            print(f"Invalid token error: {str(e)}")
            return jsonify({'error': 'Token is invalid'}), 401
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return jsonify({'error': 'Token is invalid'}), 401

        return f(current_user, *args, **kwargs)

    return decorated
