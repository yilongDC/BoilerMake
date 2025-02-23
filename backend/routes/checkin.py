from flask import Blueprint, request, jsonify
from config.database import db
from data.properties import VALID_LOCATION_IDS
import jwt
from config.config import SECRET_KEY
from config.database import db
from bson import ObjectId

checkin_bp = Blueprint('checkin', __name__)

@checkin_bp.route('/checkin', methods=['POST', 'OPTIONS'])
def checkin():
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        response = jsonify(success=True)
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    data = request.get_json()
    location_id = data.get('locationId')
    
    # Validate the scanned location ID
    if not location_id or location_id not in VALID_LOCATION_IDS:
        return jsonify({'error': 'Invalid location ID'}), 400

    # Get the token from the Authorization header
    token = request.headers.get('Authorization')
    if token:
        # Remove "Bearer " prefix if present
        token = token.replace("Bearer ", "")
    else:
        return jsonify({'error': 'No authentication token provided'}), 401

    # Validate the token against the valid property IDs
    if location_id not in VALID_LOCATION_IDS:
        return jsonify({'error': 'Invalid location id'}), 401

    # # Optionally: enforce that the token must match the scanned location id
    # if token != location_id:
    #     return jsonify({'error': 'Token does not match the scanned location'}), 400
    
    try:
        print(f"Decoding token: {token[:20]}...")  # Debug log
        data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        users = db.get_collection('users')
        current_user = users.find_one({'_id': ObjectId(data['user_id'])})
        
        if not current_user:
            print(f"No user found for ID: {data['user_id']}")
            return jsonify({'error': 'User not found'}), 401
            
        print(f"User authenticated: {current_user['email']}")  # Debug log
        
        print("data", data)
        print("user", current_user)
        
        # Update points and water intake: increment points by 10 and water_intake by 250
        result = users.update_one(
            {"_id": ObjectId(data['user_id'])},
            {"$inc": {"points": 10, "takenWater": 250}}
        )
        
        # If no matching document is found, return an error
        if result.matched_count == 0:
            return jsonify({'error': 'Property not found in database'}), 404
        
        current_user = users.find_one({'_id': ObjectId(data['user_id'])})

        return jsonify({
            'message': 'Check-in successful!',
            'points': current_user.get("points", 0),
            'location': location_id
        }), 200
    except jwt.ExpiredSignatureError:
        print("Token expired")
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError as e:
        print(f"Invalid token error: {str(e)}")
        return jsonify({'error': 'Token is invalid'}), 401
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({'error': 'unexpected error'}), 401
