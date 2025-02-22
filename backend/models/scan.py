from datetime import datetime

class Scan:
    collection_name = 'scans'
    
    def __init__(self, user_id, qr_code, scanned_at=None):
        self.user_id = user_id
        self.qr_code = qr_code
        self.scanned_at = scanned_at or datetime.utcnow()
    
    def to_dict(self):
        return {
            'user_id': self.user_id,
            'qr_code': self.qr_code,
            'scanned_at': self.scanned_at
        }
