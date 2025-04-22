from datetime import datetime
from . import db
from .user import User

class Survey(db.Model):
    __tablename__ = 'surveys'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Define relationship with User model
    user = db.relationship('User', backref=db.backref('surveys', lazy=True))
    
    # Define relationship with Question model
    questions = db.relationship('Question', backref='survey', lazy=True, cascade='all, delete-orphan')

class Question(db.Model):
    __tablename__ = 'questions'

    id = db.Column(db.Integer, primary_key=True)
    survey_id = db.Column(db.Integer, db.ForeignKey('surveys.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), nullable=False)  # e.g., 'multiple_choice', 'text', etc.
    options = db.Column(db.JSON)  # For storing multiple choice options or other question-specific data 