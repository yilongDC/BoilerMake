from datetime import datetime

class User:
    collection_name = 'users'
    
    # Choices for activity_level
    ACTIVITY_LEVEL_CHOICES = ['not_active', 'moderately_active', 'very_active']
    
    # Choices for weather
    WEATHER_CHOICES = ['hot', 'moderate', 'cold']
    
    def __init__(self, email, password, name, sex, age, height, weight, 
                 activity_level, weather_preference, daily_water_intake=2.0):
        self.email = email
        self.password = password
        self.name = name
        self.sex = sex
        self.age = age
        self.height = height
        self.weight = weight
        self.activity_level = activity_level
        self.weather_preference = weather_preference
        self.daily_water_intake = daily_water_intake
        self.created_at = datetime.utcnow()
        self.points = 0
        self.disabledUntil = None
        self.takenWater = 0.0
        self.lastLocationId = None
    
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
            'daily_water_intake': self.daily_water_intake,
            'created_at': self.created_at,
            'points': self.points,
            'disabledUntil': self.disabledUntil,
            'takenWater': self.takenWater,
            'lastLocationId': self.lastLocationId
        }
