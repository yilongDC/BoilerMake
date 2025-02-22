from datetime import datetime

class User:
    collection_name = 'users'
    
    def __init__(self, email, password, name, sex, age, height, weight, activity_level, weather_preference):
        self.email = email
        self.password = password
        self.name = name
        self.sex = sex
        self.age = age
        self.height = height
        self.weight = weight
        self.activity_level = activity_level
        self.weather_preference = weather_preference
        self.created_at = datetime.utcnow()
    
    def to_dict(self):
        return {
            'email': self.email,
            'password': self.password,
            'name': self.name,
            'sex': self.sex,
            'age': self.age,
            'height': self.height,
            'weight': self.weight,
            'activity_level': self.activity_level,
            'weather_preference': self.weather_preference,
            'created_at': self.created_at
        }
    
    @staticmethod
    def from_dict(data):
        user = User(
            email=data['email'],
            password=data['password'],
            name=data['name'],
            sex=data['sex'],
            age=data['age'],
            height=data['height'],
            weight=data['weight'],
            activity_level=data['activity_level'],
            weather_preference=data['weather_preference']
        )
        user.created_at = data.get('created_at', datetime.utcnow())
        return user
