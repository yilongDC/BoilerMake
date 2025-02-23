from functools import wraps
from flask import request, jsonify
from config.database import db
import jwt
import os
from bson import ObjectId

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            # Decode the token
            data = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=["HS256"])
            
            # Convert string ID to ObjectId for MongoDB query
            user_id = ObjectId(data['user_id'])
            current_user = db.get_collection('users').find_one({'_id': user_id})
            
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token format'}), 401
        except (jwt.DecodeError, jwt.InvalidAlgorithmError):
            return jsonify({'error': 'Token is invalid'}), 401
        except Exception as e:
            print(f"Token validation error: {str(e)}")  # Debug log
            return jsonify({'error': 'Authentication failed'}), 401
        
        # Call the wrapped function with the current user
        return f(current_user, *args, **kwargs)
    
    return decorated
