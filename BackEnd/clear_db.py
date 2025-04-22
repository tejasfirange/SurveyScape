from app import app, db
from models.user import User

def clear_users():
    with app.app_context():
        try:
            # Delete all users
            num_deleted = User.query.delete()
            db.session.commit()
            print(f"Successfully deleted {num_deleted} users from the database.")
        except Exception as e:
            db.session.rollback()
            print(f"Error clearing users: {str(e)}")

if __name__ == "__main__":
    clear_users() 