from datetime import datetime
from bson import ObjectId

class CheckIn:
    collection_name = 'checkins'
    
    def __init__(self, user_id, location_id, points=10):
        self.user_id = user_id
        self.location_id = location_id
        self.points = points
        self.timestamp = datetime.utcnow()
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'location_id': self.location_id,
            'points': self.points,
            'timestamp': self.timestamp
        }