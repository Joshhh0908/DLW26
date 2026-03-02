from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import auth as fb_auth, credentials, firestore
from flask import Flask, request, jsonify
from flask_cors import CORS
from functools import wraps
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

load_dotenv()

app = Flask(__name__)

frontend_origin = os.getenv("FRONTEND_ORIGIN", "*")
print("CORS frontend origin:", frontend_origin)

CORS(app, resources={r"/*": {"origins": os.getenv("FRONTEND_ORIGIN", "*")}})


key_path = os.getenv("FIREBASE_GOOGLE_CREDENTIALS")
cred = credentials.Certificate(key_path)
firebase_admin.initialize_app(cred, {
    "projectId": os.getenv("FIREBASE_PROJECT_ID")
})

db = firestore.client()

#ROUTES

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        parts = auth_header.split()

        if len(parts) != 2 or parts[0] != 'Bearer':
            return jsonify({'error': 'Missing or invalid token format'}), 401

        token = parts[1]

        try:
            decoded = jwt.decode(token, os.getenv('JWT_SECRET_KEY'), algorithms=["HS256"])
            request.username = decoded['username']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(*args, **kwargs)

    return decorated

@app.route('/login', methods=['POST'])
def login(): 
    data = request.json
    print(data)
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400
    
    users_ref = db.collection("Users")
    user = users_ref.document(username).get()
    if not user.exists:
        return jsonify({'error': 'User account does not exist'}), 404

    if not check_password_hash(user.to_dict()['password_hash'], password):
        return jsonify({'error': 'Wrong password'}), 401

    # Generate JWT
    expires_in = int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES')) #based on wtv i set in config
    token_payload = {
        'username': username,
        'exp': datetime.utcnow() + timedelta(seconds=expires_in)  #session token valid for 2 hrs (based on config settings)
    }

    token = jwt.encode(token_payload, os.getenv('JWT_SECRET_KEY'), algorithm='HS256')

    return jsonify({
        'message': 'Login successful',
        'token': token
    })

@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    print(data)
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Missing fields'}), 400

    # Check for duplicates
    users_ref = db.collection("Users")
    doc = users_ref.document(username).get()
    if doc.exists:
        return jsonify({'error': 'User already exists'}), 409
    
    password_hash = generate_password_hash(password)

    user_doc = {
        "username": username,
        "password_hash": password_hash,
        }

    users_ref.document(username).set(user_doc)
    return jsonify({'message': 'Account created successfully'}), 201

@app.route("/notes-uploading")
@token_required
def upload_notes():
    data = request.json
    username = data.get("username")
    note_files = request.files.getlist("notes")

if __name__ == '__main__':
    app.run(debug=True)