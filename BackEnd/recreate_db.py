from app import app, db
from models.user import User

def recreate_database():
    with app.app_context():
        try:
            # Drop all tables
            db.drop_all()
            print("Dropped all tables")
            
            # Create all tables
            db.create_all()
            print("Created all tables")
            
            print("Database recreated successfully!")
        except Exception as e:
            print(f"Error recreating database: {str(e)}")

if __name__ == "__main__":
    recreate_database() 