from flask import Flask
from flask_cors import CORS
from routes.auth import auth_bp, bcrypt
from config.database import db

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes
    
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