from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    
    # Import all models here to ensure they are registered
    from .user import User
    from .survey import Survey, Question
    
    with app.app_context():
        db.create_all() 