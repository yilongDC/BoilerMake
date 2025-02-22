from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp, bcrypt
from routes.qr import qr_bp  # Add this import
from config.database import db
import os

def create_app():
    app = Flask(__name__)
    
    # Update CORS configuration
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # Initialize extensions
    bcrypt.init_app(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(qr_bp, url_prefix='/api/qr')  # Add this line
    
    # Ensure database connection
    db.connect()
    
    @app.route('/')
    def hello():
        return "Flask MongoDB Backend is running!"
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)