from flask import Blueprint, render_template, jsonify
from models import db
from sqlalchemy import inspect, text

admin_db_viewer = Blueprint('admin_db_viewer', __name__)

@admin_db_viewer.route('/admin/db-viewer')
def db_viewer():
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    return render_template('db_viewer.html', tables=tables)

@admin_db_viewer.route('/admin/db-viewer/<table_name>')
def db_table_rows(table_name):
    # Use db.session.execute for SQLAlchemy 2.x compatibility
    result = db.session.execute(text(f"SELECT * FROM {table_name}"))
    columns = result.keys()
    rows = [dict(zip(columns, row)) for row in result.fetchall()]
    return jsonify({'columns': columns, 'rows': rows})

@admin_db_viewer.route('/admin/db-viewer/tables')
def db_viewer_tables():
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    return jsonify(tables) 