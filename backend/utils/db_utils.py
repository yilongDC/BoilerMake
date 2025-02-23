from config.database import db
from bson import ObjectId
from datetime import datetime

def update_user_points_and_checkins(user_id, location_id, points=10):
    users = db.get_collection('users')
    checkins = db.get_collection('checkins')
    
    # Create checkin record
    checkin = {
        'user_id': ObjectId(user_id),
        'location_id': location_id,
        'points': points,
        'timestamp': datetime.utcnow()
    }
    
    # Insert checkin
    checkin_result = checkins.insert_one(checkin)
    
    # Update user
    user_result = users.update_one(
        {'_id': ObjectId(user_id)},
        {
            '$inc': {
                'points': points,
                'total_checkins': 1
            },
            '$push': {
                'checkins': {
                    'checkin_id': checkin_result.inserted_id,
                    'location_id': location_id,
                    'timestamp': checkin['timestamp'],
                    'points': points
                }
            }
        }
    )
    
    return checkin_result.inserted_id, user_result.modified_count > 0