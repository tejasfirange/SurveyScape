from flask import Flask, render_template, request, jsonify , session , abort , redirect 
import requests
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy 
from sqlalchemy import PickleType
from sqlalchemy_utils import JSONType
import bcrypt

import os
import pathlib
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)
app.secret_key = " SurveyScape.com" # make sure this matches with that's in client_secret.json

os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1" # to allow Http traffic for local dev

GOOGLE_CLIENT_ID = "1070008063276-240lsgv2pqd9nnhohjts1i3m5r8ke60o.apps.googleusercontent.com"
client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
    redirect_uri="http://127.0.0.1:5000/callback"
)

class User(db.Model):
    username = db.Column(db.String(80), primary_key=True, unique=True, nullable=False)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    last_login_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    surveys_generated = db.Column(
        JSONType,
        default=lambda: {"surveys": {}}  # Use a lambda to avoid mutable default arguments
    )
    account_created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    surveys_answered = db.Column(
        PickleType,
        default=lambda: []  # Use a lambda for mutable types
    )

    def change_login_time(self):
        self.last_login_at = db.func.current_timestamp()
        db.session.commit()

@app.route("/callback")
def callback():
    flow.fetch_token(authorization_response=request.url)

    if not session["state"] == request.args["state"]:
        return jsonify({"error": "State mismatch error"}), 400

    credentials = flow.credentials
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(session=cached_session)

    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token,
        request=token_request,
        audience=GOOGLE_CLIENT_ID
    )
    print(id_info)

    session["google_id"] = id_info.get("sub")
    session["name"] = id_info.get("name")
    session["email"] = id_info.get("email")
    username = id_info.get("name")
    session["username"] = username

    # Check if user with the same email already exists
    existing_user = User.query.filter_by(email=id_info.get("email")).first()
    if existing_user:
        session["username"] = existing_user.username
        print("User already exists")
        return jsonify({
            "message": "User already exists",
            "user": {
                "username": existing_user.username,
                "name": existing_user.name,
                "email": existing_user.email,
            "last_login_at": existing_user.last_login_at,
            "surveys_generated": existing_user.surveys_generated,
            "account_created_at": existing_user.account_created_at,
            "surveys_answered": existing_user.surveys_answered
            }
        }), 200

    # If username already exists, modify the username to make it unique
    username_exists = User.query.filter_by(username=username).first()
    if username_exists:
        count = User.query.filter(User.username.like(f"{username}%")).count()
        username = f"{username}{count}"

    username = ''.join(username.split()).lower()
    session["username"] = username

    # Create and save a new user
    new_user = User(
        username=username,
        name=id_info.get("name"),
        email=id_info.get("email"),
        password=hash_password("#G#O#O#G#L#E#S#I#G#N#U#P")  # Placeholder for secure password setup
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User created successfully",
        "user": {
            "username": new_user.username,
            "name": new_user.name,
            "email": new_user.email,
            "last_login_at": new_user.last_login_at,
            "surveys_generated": new_user.surveys_generated,
            "account_created_at": new_user.account_created_at,
            "surveys_answered": new_user.surveys_answered
        }
    }), 201

@app.route("/protected_area")
def protected_area():
    if "google_id" not in session:
        return redirect("/googleauth")

    user = User.query.filter_by(username=session["username"]).first()
    if not user:
        return redirect("/googleauth")
    user.change_login_time()
    return render_template("protected_area.html", user=user)

@app.route("/get_user/<username>" , methods=["GET"])
def get_user(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "username": user.username,
        "name": user.name,
        "email": user.email,
        "last_login_at": user.last_login_at,
        "surveys_generated": user.surveys_generated,
        "account_created_at": user.account_created_at,
        "surveys_answered": user.surveys_answered
    })

@app.route("/googleauth")
def login():
    authorization_url, state = flow.authorization_url()
    session["state"] = state
    return redirect(authorization_url)

@app.route("/rem_user/<username>", methods=["GET"])
def rem_user(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User removed successfully"}), 200


@app.route("/")
def index():
    return f"<a href = 'http://127.0.0.1:5000/googleauth'><button> GOOGLE AUTHENTICATION </button></a>"

def hash_password(password):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_password.decode('utf-8')

def check_password(hashed_password, password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)