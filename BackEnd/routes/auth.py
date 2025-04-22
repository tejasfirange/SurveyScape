from flask import Blueprint, request, jsonify, session
from models.user import User
from models import db
import bcrypt
import logging
import jwt
from datetime import datetime, timedelta
import os
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

auth = Blueprint('auth', __name__)
logger = logging.getLogger(__name__)

# Get the secret key from environment or use default
SECRET_KEY = os.environ.get('SECRET_KEY', 'SurveyScape.com')
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', '1070008063276-240lsgv2pqd9nnhohjts1i3m5r8ke60o.apps.googleusercontent.com')

@auth.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        logger.info(f"Signup attempt for email: {data.get('email')}")
        
        if not data or not all(k in data for k in ('email', 'password', 'username', 'name')):
            logger.error("Missing required fields in signup request")
            return jsonify({'error': 'Missing required fields'}), 400

        if User.query.filter_by(email=data['email']).first():
            logger.error(f"Email already exists: {data['email']}")
            return jsonify({'error': 'Email already exists'}), 409

        if User.query.filter_by(username=data['username']).first():
            logger.error(f"Username already exists: {data['username']}")
            return jsonify({'error': 'Username already exists'}), 409

        # Hash password with bcrypt
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), salt)
        
        user = User(
            email=data['email'],
            password=hashed_password.decode('utf-8'),
            username=data['username'],
            name=data['name']
        )
        
        db.session.add(user)
        db.session.commit()
        logger.info(f"User created successfully: {data['email']}")
        
        session['user_id'] = user.id
        return jsonify({
            'message': 'User created successfully',
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'name': user.name
            }
        }), 201

    except Exception as e:
        logger.error(f"Error during signup: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@auth.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        logger.info(f"Login attempt for email: {data.get('email')}")
        
        if not data or not all(k in data for k in ('email', 'password')):
            logger.error("Missing email or password in login request")
            return jsonify({'error': 'Missing email or password'}), 400

        user = User.query.filter_by(email=data['email']).first()
        if not user:
            logger.error(f"User not found: {data['email']}")
            return jsonify({'error': 'Invalid email or password'}), 401

        # Verify password with bcrypt
        if not bcrypt.checkpw(data['password'].encode('utf-8'), user.password.encode('utf-8')):
            logger.error(f"Invalid password for user: {data['email']}")
            return jsonify({'error': 'Invalid email or password'}), 401

        session['user_id'] = user.id
        user.change_login_time()
        logger.info(f"User logged in successfully: {data['email']}")
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'name': user.name
            }
        })

    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@auth.route('/status', methods=['GET'])
def auth_status():
    try:
        user_id = session.get('user_id')
        if not user_id:
            logger.info("No active session found")
            return jsonify({'authenticated': False}), 401

        user = User.query.get(user_id)
        if not user:
            logger.error(f"User not found for session ID: {user_id}")
            session.clear()
            return jsonify({'authenticated': False}), 401

        logger.info(f"User authenticated: {user.email}")
        return jsonify({
            'authenticated': True,
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'name': user.name
            }
        })

    except Exception as e:
        logger.error(f"Error checking auth status: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@auth.route('/logout', methods=['GET', 'POST'])
def logout():
    try:
        logger.info("Logout attempt")
        session.clear()
        logger.info("Session cleared successfully")
        return jsonify({'message': 'Logged out successfully'}), 200
    except Exception as e:
        logger.error(f"Error during logout: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@auth.route('/api/auth/google', methods=['POST'])
def google_auth():
    try:
        token = request.json.get('token')
        if not token:
            return jsonify({'error': 'No token provided'}), 400
            
        idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=10
        )
        
        email = idinfo['email']
        user = User.query.filter_by(email=email).first()
        
        if not user:
            # Create new user if doesn't exist
            username = ''.join(idinfo.get('name', '').split()).lower()
            # Check if username exists and append number if it does
            username_exists = User.query.filter_by(username=username).first()
            if username_exists:
                count = User.query.filter(User.username.like(f"{username}%")).count()
                username = f"{username}{count}"
                
            user = User(
                email=email,
                username=username,
                name=idinfo.get('name', ''),
                password=generate_password_hash('GOOGLE_AUTH_USER')
            )
            db.session.add(user)
            db.session.commit()
        
        user.change_login_time()
        
        return jsonify({
            'user': {
                'username': user.username,
                'email': user.email,
                'name': user.name
            }
        })
        
    except ValueError as e:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth.route('/api/auth/verify', methods=['GET'])
def verify_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'No token provided'}), 401
        
    token = auth_header.split(' ')[1]
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user = User.query.get(payload['user_id'])
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify({
            'user': {
                'username': user.username,
                'email': user.email,
                'name': user.name
            }
        })
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401 