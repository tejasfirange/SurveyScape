from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy 
from sqlalchemy import PickleType
from sqlalchemy_utils import JSONType
import bcrypt

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)

class User(db.Model):
    name = db.Column(db.String(80), primary_key=True, unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    last_login_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    surveys_generated = db.Column(JSONType, default={
    "surveys": {
        # Example Format
        # "ID OF THE SURVEY (EACH UNIQUE ID)": {
        #     "survey_name": "Customer Satisfaction",
        #     "survey_description": "A survey to gauge customer satisfaction",
        #     "survey_status": "Active",
        #     "survey_start_date": "2025-01-01",
        #     "survey_end_date": "2025-12-31",
        #     "survey_creator": "username",
        #     "survey_questions": {
        #         "1": {
        #             "question_text": "How satisfied are you with our service?",
        #             "question_type": "multiple_choice",
        #             "question_options": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"]
        #         },
        #         "2": {
        #             "question_text": "What can we do to improve?",
        #             "question_type": "text",
        #             "question_options": []
        #         }
        #     },
        #     "user_responses": {
        #         "username1": {
        #             "response_time": "2025-01-22T10:15:30Z",
        #             "responses": {
        #                 "1": "Very Satisfied",
        #                 "2": "Keep up the great work!"
        #             }
        #         },
        #         "username2": {
        #             "response_time": "2025-01-22T11:00:00Z",
        #             "responses": {
        #                 "1": "Neutral",
        #                 "2": "Improve customer service."
        #             }
        #         }
        #     }
        # }
    }
    })
    account_created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    surveys_answered = db.Column(PickleType, default=[])


def hash_password(password):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_password.decode('utf-8')

def check_password(hashed_password, password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
