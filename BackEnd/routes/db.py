from flask import Blueprint, jsonify
from sqlalchemy import inspect, text
from models import db

db_routes = Blueprint('db', __name__)

@db_routes.route('/api/db/test')
def test_db():
    try:
        tables = db.engine.table_names()
        return jsonify({
            "status": "success",
            "message": "Database connected successfully",
            "tables": tables
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@db_routes.route('/api/db/tables', methods=['GET'])
def get_tables():
    try:
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        return jsonify(tables)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@db_routes.route('/api/db/table/<table_name>', methods=['GET'])
def get_table_data(table_name):
    try:
        # Safely construct the query
        query = text(f'SELECT * FROM "{table_name}"')
        result = db.session.execute(query)
        
        # Convert result to list of dictionaries
        columns = result.keys()
        data = [dict(zip(columns, row)) for row in result]
        
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500 