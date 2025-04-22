from . import db
from sqlalchemy import PickleType
from sqlalchemy_utils import JSONType
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    last_login_at = db.Column(db.DateTime, default=datetime.utcnow)
    surveys_generated = db.Column(
        JSONType,
        default=lambda: {"surveys": {}}
    )
    account_created_at = db.Column(db.DateTime, default=datetime.utcnow)
    surveys_answered = db.Column(
        PickleType,
        default=lambda: []
    )

    def change_login_time(self):
        self.last_login_at = datetime.utcnow()
        db.session.commit() 