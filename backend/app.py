"""
ENSF 381 - Assignment 4
Group Members:
- Kulvansh Jaswal - [30212576]
- [Kuljot Jaswal] - [30211612]
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import bcrypt
import json
from datetime import datetime
import random

app = Flask(__name__)
CORS(app)

users = [
    {
        "id": 1,
        "username": "sweet_alice",
        "email": "alice@example.com",
        "password_hash": bcrypt.hashpw("IceCream!23".encode('utf-8'), bcrypt.gensalt()),
        "cart": [],
        "orders": []
    }
]

def load_json_file(filename):
    try:
        with open(filename, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def find_user_by_id(user_id):
    for user in users:
        if user['id'] == user_id:
            return user
    return None

def find_user_by_username(username):
    for user in users:
        if user['username'].lower() == username.lower():
            return user
    return None

def find_user_by_email(email):
    for user in users:
        if user['email'].lower() == email.lower():
            return user
    return None

def find_flavor_by_id(flavor_id):
    flavors = load_json_file('flavors.json')
    for flavor in flavors:
        if flavor['id'] == flavor_id:
            return flavor
    return None

def validate_username(username):
    if len(username) < 3 or len(username) > 20:
        return False, "Username must be between 3 and 20 characters"
    
    if not username[0].isalpha():
        return False, "Username must start with a letter"
    
    for char in username:
        if not (char.isalnum() or char in ['_', '-']):
            return False, "Username may only contain letters, numbers, underscores, and hyphens"
    
    return True, ""

def validate_email(email):
    if '@' not in email or '.' not in email.split('@')[-1]:
        return False, "Invalid email format"
    return True, ""

def validate_password(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password)
    
    if not (has_upper and has_lower and has_digit and has_special):
        return False, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    
    return True, ""

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username', '')
    email = data.get('email', '')
    password = data.get('password', '')
    
    valid, msg = validate_username(username)
    if not valid:
        return jsonify({"success": False, "message": msg}), 400
    
    valid, msg = validate_email(email)
    if not valid:
        return jsonify({"success": False, "message": msg}), 400
    
    valid, msg = validate_password(password)
    if not valid:
        return jsonify({"success": False, "message": msg}), 400
    
    if find_user_by_username(username):
        return jsonify({"success": False, "message": "Username is already taken."}), 400
    
    if find_user_by_email(email):
        return jsonify({"success": False, "message": "Email is already registered."}), 400
    
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    new_user = {
        "id": len(users) + 1,
        "username": username,
        "email": email,
        "password_hash": password_hash,
        "cart": [],
        "orders": []
    }
    
    users.append(new_user)
    
    return jsonify({"success": True, "message": "Registration successful."}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username', '')
    password = data.get('password', '')
    
    user = find_user_by_username(username)
    if not user:
        return jsonify({"success": False, "message": "Invalid username or password."}), 401
    
    if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash']):
        return jsonify({"success": False, "message": "Invalid username or password."}), 401
    
    return jsonify({
        "success": True,
        "message": "Login successful.",
        "userId": user['id'],
        "username": user['username']
    }), 200

@app.route('/reviews', methods=['GET'])
def get_reviews():
    data = load_json_file("reviews.json")
    
    if len(data) >= 2:
        reviews = random.sample(data, 2)
        return jsonify({"success": True, "message": "Reviews loaded.", "reviews": reviews})
    
    return jsonify({"success": True, "message": "Reviews loaded.", "reviews": data})

@app.route('/flavors', methods=['GET'])
def get_flavors():
    data = load_json_file("flavors.json")
    
    return jsonify({"success": True, "message": "Flavors loaded.", "flavors": data})

@app.route('/cart', methods=['GET'])
def get_cart():
    user_id = request.args.get('userId')
    user = find_user_by_id(int(user_id))

    if user is None:
        return jsonify({"success": False, "message": "User ID does not exist"})
    
    return jsonify({"success": True, "message": "Cart loaded.", "cart": user['cart']})

@app.route('/cart', methods=['POST'])
def add_to_cart():
    data = request.json
    user_id = data.get('userId')
    flavor_id = data.get('flavorId')
    
    user = find_user_by_id(user_id)
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404
    
    flavor = find_flavor_by_id(flavor_id)
    if not flavor:
        return jsonify({"success": False, "message": "Flavor not found."}), 404
    
    for item in user['cart']:
        if item['flavorId'] == flavor_id:
            return jsonify({"success": False, "message": "Flavor already in cart. Use PUT to update quantity."}), 400
    
    cart_item = {
        "flavorId": flavor['id'],
        "name": flavor['name'],
        "price": flavor['price'],
        "quantity": 1
    }
    user['cart'].append(cart_item)
    
    return jsonify({
        "success": True,
        "message": "Flavor added to cart.",
        "cart": user['cart']
    }), 200

@app.route('/cart', methods=['PUT'])
def update_cart():
    data = request.json
    user_id = data.get('userId')
    flavor_id = data.get('flavorId')
    quantity = data.get('quantity')
    
    if quantity < 1:
        return jsonify({"success": False, "message": "Quantity must be at least 1."}), 400
    
    user = find_user_by_id(user_id)
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404
    
    cart_item = None
    for item in user['cart']:
        if item['flavorId'] == flavor_id:
            cart_item = item
            break
    
    if not cart_item:
        return jsonify({"success": False, "message": "Flavor not in cart."}), 404
    
    cart_item['quantity'] = quantity
    
    return jsonify({
        "success": True,
        "message": "Cart updated successfully.",
        "cart": user['cart']
    }), 200

@app.route('/cart', methods=['DELETE'])
def delete_from_cart():
    data = request.json
    user_id = data.get('userId')
    flavor_id = data.get('flavorId')
    
    user = find_user_by_id(user_id)
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404
    
    user['cart'] = [item for item in user['cart'] if item['flavorId'] != flavor_id]
    
    return jsonify({
        "success": True,
        "message": "Flavor removed from cart.",
        "cart": user['cart']
    }), 200

@app.route('/orders', methods=['POST'])
def place_order():
    data = request.json
    user_id = data.get('userId')
    
    user = find_user_by_id(user_id)
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404
    
    if len(user['cart']) == 0:
        return jsonify({"success": False, "message": "Cart is empty."}), 400
    
    total = sum(item['price'] * item['quantity'] for item in user['cart'])
    
    order_id = len(user['orders']) + 1
    order = {
        "orderId": order_id,
        "items": user['cart'].copy(),
        "total": round(total, 2),
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    user['orders'].append(order)
    user['cart'] = []
    
    return jsonify({
        "success": True,
        "message": "Order placed successfully.",
        "orderId": order_id
    }), 201

@app.route('/orders', methods=['GET'])
def get_orders():
    user_id = request.args.get('userId', type=int)
    
    user = find_user_by_id(user_id)
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404
    
    return jsonify({
        "success": True,
        "message": "Order history loaded.",
        "orders": user['orders']
    }), 200
    


if __name__ == '__main__':
    app.run(debug=True, port=5000)