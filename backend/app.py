from dataclasses import asdict
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import auth as fb_auth, credentials, firestore
from flask import Flask, json, request, jsonify
from flask_cors import CORS
from functools import wraps
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from keyword_extraction.process_notes import process_notes


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

@app.route('/api/login', methods=['POST'])
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

@app.route('/api/register', methods=['POST'])
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

@app.route("/api/upload-notes", methods=["POST"])
@token_required
def upload_notes():
    username = request.username
    note_files = request.files.getlist("notes")

    if not note_files:
        return jsonify({"error": "No files uploaded under field 'notes'"}), 400
    if len(note_files) != 1:
        return jsonify({"error": "Please upload exactly one PDF for now."}), 400

    os.makedirs("uploads", exist_ok=True)
    saved_paths = []

    try:
        f = note_files[0]
        filename = secure_filename(f.filename)
        save_path = os.path.join("uploads", filename)
        f.save(save_path)
        saved_paths.append(save_path)

        notes_nested, graphs = process_notes(saved_paths)
        # since only 1 pdf, these are length 1
        nodes_raw = [asdict(n) for n in notes_nested[0]]
        nodes = []
        for n in nodes_raw:
            nodes.append({
                "name": str(n.get("name", "")),
                "summary": [str(s) for s in (n.get("summary") or [])],
                "equations": [str(e) for e in (n.get("equations") or [])],
                # DO NOT store links here
            })
        # graphs[0] is whatever generate_graph returns (your print shows 2 lists)
        related_edges, prereq_edges = graphs[0]  # if the order is (related, prereq)

        study_set_id = f"{username}-{int(datetime.utcnow().timestamp())}"

        study_ref = (
            db.collection("Users")
            .document(username)
            .collection("StudySets")
            .document(study_set_id)
        )

        # Convert edges to list-of-lists (Firestore-safe)
        related_edges_fs = [{"source": e[0], "target": e[1]} for e in related_edges]
        prereq_edges_fs  = [{"source": e[0], "target": e[1]} for e in prereq_edges]

        graph_fs = {
            "nodes": nodes,                 # nodes is already list of dicts from asdict()
            "related": related_edges_fs,     # now list of [source, target]
            "prereq": prereq_edges_fs
        }

        print("SAVING GRAPH TYPES:",
            type(graph_fs),
            type(graph_fs["prereq"]),
            type(graph_fs["prereq"][0]) if graph_fs["prereq"] else None)
        
        try:
            json.dumps(graph_fs)
            print("json.dumps(graph_fs) OK")
        except TypeError as e:
            print("json.dumps(graph_fs) FAILED:", e)
            # find the bad node
            for i, n in enumerate(graph_fs["nodes"]):
                try:
                    json.dumps(n)
                except TypeError as e2:
                    print("Bad node index:", i, "node:", n, "error:", e2)
                    break
        size_bytes = len(json.dumps(graph_fs).encode("utf-8"))
        print("GRAPH JSON SIZE BYTES:", size_bytes)
        bad = find_bad_values(graph_fs)
        print("BAD VALUES FOUND:", bad[:20])
        if bad:
            return jsonify({"error": f"Graph contains non-Firestore value(s): {bad[:5]}"}), 400
        study_ref.set({
            "title": os.path.splitext(filename)[0],
            "createdAt": firestore.SERVER_TIMESTAMP,
            "nodeCount": len(nodes),
            "edgeCount": len(prereq_edges_fs) + len(related_edges_fs),
            "progress": 0,
            "mastered": 0,
            "graph": graph_fs
        })

        return jsonify({
            "studySetId": study_set_id,
            "title": os.path.splitext(filename)[0],
            "nodes": nodes,
            "related": related_edges_fs,
            "prereq": prereq_edges_fs
        }), 200

    finally:
        for p in saved_paths:
            try: os.remove(p)
            except: pass

@app.route("/api/get-study-sets", methods=["GET"])
@token_required
def get_study_sets():
    username = request.username

    sets_ref = (
        db.collection("Users")
          .document(username)
          .collection("StudySets")
          .order_by("createdAt", direction=firestore.Query.DESCENDING)
    )

    docs = sets_ref.stream()
    study_sets = []
    for d in docs:
        data = d.to_dict()
        study_sets.append({
            "id": d.id,
            "title": data.get("title", "Untitled"),
            "progress": data.get("progress", 0),
            "mastered": data.get("mastered", 0),
            "nodeCount": data.get("nodeCount", 0),
        })

    return jsonify({"studySets": study_sets}), 200

@app.route("/api/study-sets/<study_set_id>", methods=["GET"])
@token_required
def get_study_set(study_set_id):
    username = request.username

    doc_ref = (
        db.collection("Users")
          .document(username)
          .collection("StudySets")
          .document(study_set_id)
    )
    doc = doc_ref.get()
    if not doc.exists:
        return jsonify({"error": "Study set not found"}), 404

    data = doc.to_dict()
    return jsonify({
        "id": doc.id,
        "title": data.get("title"),
        "graph": data.get("graph")  # {nodes, prereq, related}
    }), 200


import math

def find_bad_values(obj, path="root"):
    # Firestore rejects NaN/Inf floats
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return [(path, obj)]
        return []
    if isinstance(obj, (str, int, bool)) or obj is None:
        return []
    if isinstance(obj, list):
        out = []
        for i, v in enumerate(obj):
            out += find_bad_values(v, f"{path}[{i}]")
        return out
    if isinstance(obj, dict):
        out = []
        for k, v in obj.items():
            out += find_bad_values(v, f"{path}.{k}")
        return out
    # bytes, tuples, custom objects, etc.
    return [(path, type(obj))]

if __name__ == '__main__':
    app.run(debug=True)