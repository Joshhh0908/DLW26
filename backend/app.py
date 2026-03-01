from flask import Flask, request, jsonify
from functools import wraps
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import jwt


app = Flask(__name__)

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
            decoded = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
            request.user_id = decoded['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        return f(*args, **kwargs)

    return decorated

@app.route("/")
def test():
    return "penis"

@app.route('/verify-token', methods=['GET'])
@token_required
def verify_token():
    return jsonify({'valid': True, 'user_id': request.user_id})

# @app.route('/register', methods=['POST'])
# def register_user():
#     data = request.json
#     user_id = data.get('user_id')
#     email = data.get('email')
#     password = data.get('password')

#     if not user_id or not email or not password:
#         return jsonify({'error': 'Missing fields'}), 400

#     # Check for duplicates
#     if db.users.find_one({'user_id': user_id}) or db.users.find_one({'email': email}):
#         return jsonify({'error': 'User already exists'}), 409

#     password_hash = generate_password_hash(password)

#     user_doc = {
#         "user_id": user_id,
#         "email": email,
#         "password_hash": password_hash,
#         "profile": {
#             "created_at": datetime.utcnow(),
#             "last_login": None,
#             "workout_stats": {},
#         }
#     }

#     db.users.insert_one(user_doc)
#     return jsonify({'message': 'Account created successfully'}), 201


if __name__ == '__main__':
    app.run()