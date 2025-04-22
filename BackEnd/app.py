from flask import Flask, session, redirect, request, jsonify
from flask_cors import CORS
from models import init_db
from models.user import User
import os
import pathlib
import bcrypt
import logging
from flask_sqlalchemy import SQLAlchemy
from routes.auth import auth
from routes.survey import survey

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# App Setup
app = Flask(__name__)
CORS(app, 
     supports_credentials=True,
     resources={
         r"/*": {
             "origins": ["http://localhost:5173"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type"],
             "expose_headers": ["Content-Range", "X-Content-Range"],
             "supports_credentials": True
         }
     })

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///surveyscape.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SECURE"] = False
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "SurveyScape.com")

# Initialize database
init_db(app)

# Register blueprints
app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(survey, url_prefix='/survey')

# Main entry
if __name__ == "__main__":
    app.run(debug=True)

