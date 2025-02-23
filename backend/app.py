from flask import Flask, make_response, jsonify
from flask_cors import CORS
from routes.auth import auth_bp, bcrypt
from config.database import db
import os

def create_app():
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, 
        resources={r"/api/*": {
            "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
            "expose_headers": ["Content-Range", "X-Content-Range"]
        }},
        supports_credentials=True
    )
    
    # Add CORS headers to all responses
    @app.after_request
    def after_request(response):
        header = response.headers
        header['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        header['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        header['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
        header['Access-Control-Allow-Credentials'] = 'true'
        return response
    
    # Initialize extensions
    bcrypt.init_app(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    # Ensure database connection
    db.connect()
    
    @app.route('/')
    def hello():
        return "Flask MongoDB Backend is running!"
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)