import pytest
import json
from app import create_app
from config.database import db
import jwt
import os
from datetime import datetime, timedelta
from bson import ObjectId

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@pytest.fixture
def test_user():
    # Create a test user
    user_data = {
        '_id': ObjectId(),
        'email': 'test@test.com',
        'name': 'Test User',
        'points': 0
    }
    db.get_collection('users').insert_one(user_data)
    
    # Create authentication token
    token = jwt.encode({
        'user_id': str(user_data['_id']),
        'exp': datetime.utcnow() + timedelta(days=1)
    }, os.getenv('JWT_SECRET_KEY'))
    
    yield user_data, token
    
    # Cleanup
    db.get_collection('users').delete_one({'_id': user_data['_id']})
    db.get_collection('scans').delete_many({'user_id': str(user_data['_id'])})

def test_scan_qr(client, test_user):
    user_data, token = test_user
    
    # Test valid QR scan
    response = client.post('/api/qr/scan',
        headers={'Authorization': token},
        json={'qr_code': 'QR1'}
    )
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['points_earned'] == 10
    
    # Test cooldown period
    response = client.post('/api/qr/scan',
        headers={'Authorization': token},
        json={'qr_code': 'QR1'}
    )
    assert response.status_code == 429
    
    # Test invalid QR code
    response = client.post('/api/qr/scan',
        headers={'Authorization': token},
        json={'qr_code': 'INVALID'}
    )
    assert response.status_code == 400

def test_leaderboard(client, test_user):
    user_data, token = test_user
    
    # First scan to get points
    client.post('/api/qr/scan',
        headers={'Authorization': token},
        json={'qr_code': 'QR1'}
    )
    
    # Test leaderboard
    response = client.get('/api/qr/leaderboard',
        headers={'Authorization': token}
    )
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) > 0
    assert any(entry['name'] == 'Test User' for entry in data)
