from datetime import datetime

class User:
    collection_name = 'users'
    
    def __init__(self, email, password):
        self.email = email
        self.password = password
        self.created_at = datetime.utcnow()
    
    def to_dict(self):
        return {
            'email': self.email,
            'password': self.password,
            'created_at': self.created_at
        }
    
    @staticmethod
    def from_dict(data):
        user = User(data['email'], data['password'])
        user.created_at = data.get('created_at', datetime.utcnow())
        return user
