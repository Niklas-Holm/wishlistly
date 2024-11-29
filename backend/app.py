from flask import Flask, request, jsonify, session, send_from_directory, render_template
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
from config import ApplicationConfig
from models import db, User, Wish
from dotenv import load_dotenv
import os
import json
import cloudinary
import cloudinary.uploader

# Load the master .env file first
load_dotenv()  # This loads the .env file

# Get the value of FLASK_ENV to determine which specific .env file to load
flask_env = os.environ.get('FLASK_ENV')  # Default to 'development' if not set

# Load the environment-specific file
if flask_env == 'development':
    load_dotenv('.env.development')
elif flask_env == 'production':
    load_dotenv('.env.production')

DATABASE_URL = os.environ.get('DATABASE_URL')

print(f"Using database: {DATABASE_URL}")

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True, origins=["https://wishlistly.onrender.com", "http://127.0.0.1:5000"])
server_session = Session(app)
db.init_app(app)
migrate = Migrate(app, db)

app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

frontend_folder = os.path.join(os.getcwd(), "..", "frontend")
dist_folder = os.path.join(frontend_folder, "dist")

cloudinary.config(
    cloud_name="df0vyvm9g",
    api_key="579314177614833",
    api_secret=os.environ.get('CLOUDINARY_API_KEY'),  # Replace with your actual secret
    secure=True
)

@app.route("/", defaults={"filename":""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename = "index.html"  # Serve the index.html file from the React build folder
    return send_from_directory(dist_folder, filename)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(os.path.join(app.root_path, 'uploads'), filename)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

with app.app_context():
    db.create_all()

@app.route("/@me", methods=["GET"])
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Decode the friends field from JSON
    friends_list = []
    if user.friends:
        friends_list = json.loads(user.friends)

    return jsonify({
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "phone_number": user.phone_number,
        "profile_photo": user.profile_photo,
        "date_created": user.date_created.isoformat() if user.date_created else None,
        "wishes": [
            {
                "id": wish.id,
                "product_name": wish.product_name,
                "price": wish.price,
                "product_link": wish.product_link,
                "product_photo": wish.product_photo,
                "reserved": wish.reserved,  # Include the reserved field
                "created_at": wish.created_at.isoformat() if wish.created_at else None
            }
            for wish in user.wishes
        ],
        "friends": friends_list  # Add the friends list to the response
    })

@app.route("/register", methods=["POST"])
def register_user():
    email = request.form.get("email")
    password = request.form.get("password")
    name = request.form.get("name", "Anonymous")
    phone_number = request.form.get("phone_number")
    image = request.files.get('image')  # Handling the file upload

    print("Received Data:", request.form)  # Debug log to see form data
    print("Received Image:", image)  # Debug log to see if image is in the request

    # Check if the user already exists
    user_exists = User.query.filter_by(email=email).first() is not None
    if user_exists:
        return jsonify({"error": "User already exists"}), 409

    image_url = None

    if image and allowed_file(image.filename):
        try:
            # Upload the file directly to Cloudinary
            upload_result = cloudinary.uploader.upload(
                image, folder="profile_photos/"
            )
            image_url = upload_result["secure_url"]  # Get the URL of the uploaded image
        except Exception as e:
            print(f"Error uploading to Cloudinary: {e}")
            return jsonify({"error": "Failed to upload image"}), 500

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(
        email=email, 
        password=hashed_password, 
        name=name, 
        phone_number=phone_number, 
        profile_photo=image_url)
    
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email,
        "name": new_user.name,
        "phone_number": new_user.phone_number,
        'profile_photo': new_user.profile_photo
    })


@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "Unauthorized"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
    
    session["user_id"] = user.id

    return jsonify({
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "phone_number": user.phone_number
    })

@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id", None)
    return "200"

@app.route("/api/delete-wish", methods=["POST"])
def delete_wish():
    # Check if the user is authenticated
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401  # 401 Unauthorized if not logged in

    # Get the wish_id from the request
    wish_id = request.json.get("wish_id")
    if not wish_id:
        return jsonify({"error": "Missing wish_id"}), 400  # 400 Bad Request if no wish_id

    # Find the wish in the database
    wish = Wish.query.get(wish_id)
    if not wish:
        return jsonify({"error": "Wish not found"}), 404  # 404 Not Found if wish doesn't exist

    # Check if the wish belongs to the authenticated user
    if wish.user_id != user_id:
        return jsonify({"error": "Forbidden"}), 403  # 403 Forbidden if the user doesn't own the wish

    # Delete the wish
    db.session.delete(wish)
    db.session.commit()

    return jsonify({"message": "Wish deleted successfully"}), 200  # 200 OK


# New route to create a wish
@app.route("/api/wishes", methods=["POST"])
def create_wish():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    # Assuming wish data is sent as form data or JSON
    product_name = request.form.get('productName')
    price = request.form.get('price')
    description = request.form.get('description')
    url = request.form.get('url')
    image = request.files.get('image')

    if not product_name or not price or not description or not url:
        return jsonify({"error": "Missing required fields"}), 400

    image_url = None  # This will store the Cloudinary URL

    if image and allowed_file(image.filename):
        try:
            # Upload the image to Cloudinary
            upload_result = cloudinary.uploader.upload(
                image, folder="wish_images/"
            )
            image_url = upload_result["secure_url"]  # Get the Cloudinary URL
        except Exception as e:
            print(f"Error uploading to Cloudinary: {e}")
            return jsonify({"error": "Failed to upload image"}), 500

    # Creating the new wish in the database
    new_wish = Wish(
        product_name=product_name,
        price=price,
        description=description,
        product_link=url,
        product_photo=image_url,  # Save the Cloudinary URL in the database
        user_id=user_id  # Associate the wish with the logged-in user
    )

    db.session.add(new_wish)
    db.session.commit()

    return jsonify({
        "id": new_wish.id,
        "product_name": new_wish.product_name,
        "price": new_wish.price,
        "product_link": new_wish.product_link,
        "product_photo": new_wish.product_photo,
        "description": new_wish.description,
        "created_at": new_wish.created_at.isoformat(),
    }), 201


@app.route("/api/search-users", methods=["GET"])
def search_users():
    field_input = request.args.get("searchField")
    print(f"Search field input: {field_input}")

    users = User.query.filter(
        (User.name.ilike(f"%{field_input}%")) |  # Case-insensitive search for name
        (User.phone_number.ilike(f"%{field_input}%"))  # Case-insensitive search for phone_number
    ).all()

    # Convert user objects to dictionaries or JSON serializable format
    results = [
        {"id": user.id, "name": user.name, "phone_number": user.phone_number, "profile_photo": user.profile_photo}
        for user in users
    ]

    return jsonify({"users": results})

@app.route('/api/get_all_users', methods=['GET'])
def get_all_users():
    logged_in_user_id = session.get('user_id')

    # Query for all users except the logged-in user
    users = User.query.filter(User.id != logged_in_user_id).all()

    result = [
        {
            "id": user.id,
            "name": user.name,
            "phone_number": user.phone_number,
            "profile_photo": user.profile_photo
        }
        for user in users
    ]

    return jsonify(result)

@app.route('/api/add-user', methods=['POST'])
def add_user():
    logged_in_user_id = session.get('user_id')
    if not logged_in_user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user_id_to_add = request.json.get("user_id")
    if not user_id_to_add:
        return jsonify({"error": "Missing user_id"}), 400  # 400 Bad Request if no user_id

    if user_id_to_add == logged_in_user_id:
        return jsonify({"error": "You cannot add yourself as a friend"}), 400  # Prevent self-add

    target_user = User.query.filter_by(id=user_id_to_add).first()
    if not target_user:
        return jsonify({"error": "User not found"}), 404
    
    logged_in_user = User.query.filter_by(id=logged_in_user_id).first()
    if not logged_in_user:
        return jsonify({"error": "Logged-in user not found"}), 404

    friends_list = json.loads(logged_in_user.friends)
    if user_id_to_add in friends_list:
        return jsonify({"error": "User already added"}), 400 # Prevent self
    
    friends_list.append(user_id_to_add)
    logged_in_user.friends = json.dumps(friends_list)

    db.session.commit()

    return jsonify({"message": "User added sucessfully"}), 200


@app.route('/api/remove-user', methods=['POST'])
def remove_user():
    logged_in_user_id = session.get('user_id')
    if not logged_in_user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user_id_to_remove = request.json.get("user_id")
    if not user_id_to_remove:
        return jsonify({"error": "Missing user_id"}), 400

    if user_id_to_remove == logged_in_user_id:
        return jsonify({"error": "You cannot remove yourself as a friend"}), 400

    target_user = User.query.filter_by(id=user_id_to_remove).first()
    if not target_user:
        return jsonify({"error": "User not found"}), 404
    
    logged_in_user = User.query.filter_by(id=logged_in_user_id).first()
    if not logged_in_user:
        return jsonify({"error": "Logged-in user not found"}), 404

    # Ensure friends list is valid
    friends_list = json.loads(logged_in_user.friends) if logged_in_user.friends else []
    
    if user_id_to_remove not in friends_list:
        return jsonify({"error": "User not in friends list"}), 400
    
    # Remove the user and update the database
    friends_list.remove(user_id_to_remove)
    logged_in_user.friends = json.dumps(friends_list)

    db.session.commit()

    return jsonify({"message": "User removed successfully"}), 200

@app.route("/api/wishes/<string:wish_id>", methods=["PUT"])
def edit_wish(wish_id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    # Find the wish by its ID
    wish = Wish.query.get(wish_id)
    if not wish:
        return jsonify({"error": "Wish not found"}), 404

    # Ensure the wish belongs to the logged-in user
    if wish.user_id != user_id:
        return jsonify({"error": "Forbidden"}), 403  # User does not have permission to edit this wish

    # Get the new data from the form
    product_name = request.form.get('productName')
    price = request.form.get('price')
    description = request.form.get('description')
    url = request.form.get('url')
    image = request.files.get('image')  # New image (if provided)

    # Check that all required fields are provided (except image)
    if not product_name or not price or not description or not url:
        return jsonify({"error": "Missing required fields"}), 400

    # Update the wish with the new data
    wish.product_name = product_name
    wish.price = price
    wish.description = description
    wish.product_link = url

    # Handle the new image (if any)
    if image and allowed_file(image.filename):
        try:
            # Upload the new image to Cloudinary
            upload_result = cloudinary.uploader.upload(image, folder="wish_images/")
            wish.product_photo = upload_result["secure_url"]  # Save Cloudinary URL
            db.session.commit()
        except Exception as e:
            print(f"Error uploading to Cloudinary: {e}")
            return jsonify({"error": "Failed to upload image"}), 500

    # Commit the updated wish to the database
    db.session.commit()

    return jsonify({
        "id": wish.id,
        "product_name": wish.product_name,
        "price": wish.price,
        "description": wish.description,
        "product_link": wish.product_link,
        "product_photo": wish.product_photo,
        "updated_at": wish.created_at.isoformat() if wish.created_at else None
    })

@app.route("/api/wishes/<string:wish_id>", methods=["GET"])
def get_wish(wish_id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    # Find the wish by its ID
    wish = Wish.query.get(wish_id)
    if not wish:
        return jsonify({"error": "Wish not found"}), 404

    # Ensure the wish belongs to the logged-in user
    if wish.user_id != user_id:
        return jsonify({"error": "Forbidden"}), 403  # User does not have permission to view this wish

    # Return the wish details as a JSON response
    return jsonify({
        "id": wish.id,
        "product_name": wish.product_name,
        "price": wish.price,
        "description": wish.description,
        "product_link": wish.product_link,
        "product_photo": wish.product_photo,
        "created_at": wish.created_at.isoformat() if wish.created_at else None
    })

@app.route("/api/users/<string:user_id>/wishes", methods=["GET"])
def get_user_wishes(user_id):
    logged_in_user_id = session.get("user_id")
    if not logged_in_user_id:
        return jsonify({"error": "Unauthorized"}), 401

    # Ensure the user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Retrieve the user's wishes
    wishes = Wish.query.filter_by(user_id=user_id).all()

    # Return the user's name and their wishes
    return jsonify({
        "user_name": user.name,
        "wishes": [
            {
                "id": wish.id,
                "product_name": wish.product_name,
                "price": wish.price,
                "description": wish.description,
                "product_link": wish.product_link,
                "product_photo": wish.product_photo,
                "reserved": wish.reserved,
                "created_at": wish.created_at.isoformat() if wish.created_at else None
            }
            for wish in wishes
        ]
    })

@app.route("/api/upload-profile-photo", methods=["POST"])
def update_profile_photo():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401  # User must be logged in

    # Find the user in the database
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404  # User doesn't exist

    # Get the image from the form data
    image = request.files.get('image')
    if not image:
        return jsonify({"error": "No image provided"}), 400  # Missing image

    # Validate the file
    if not allowed_file(image.filename):
        return jsonify({"error": "Invalid file type"}), 400  # Invalid file extension

    try:
        # Upload the image to Cloudinary
        upload_result = cloudinary.uploader.upload(
            image, folder="profile_photos/"
        )
        # Get the secure URL of the uploaded image
        image_url = upload_result["secure_url"]
    except Exception as e:
        print(f"Error uploading to Cloudinary: {e}")
        return jsonify({"error": "Failed to upload image"}), 500  # Error uploading image

    # Update the user's profile photo with the Cloudinary URL
    user.profile_photo = image_url
    db.session.commit()

    return jsonify({
        "message": "Profile photo updated successfully",
        "profile_photo": user.profile_photo
    }), 200

@app.route("/change-password", methods=["POST"])
def change_password():
    user_id = session.get("user_id")
    
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401  # User must be logged in

    # Get the new password from the request
    new_password = request.json.get("newPassword")
    if not new_password:
        return jsonify({"error": "New password is required"}), 400  # Bad Request if no password is provided

    # Find the user in the database
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404  # User not found

    # Hash the new password
    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

    # Update the user's password
    user.password = hashed_password
    db.session.commit()

    return jsonify({"message": "Password updated successfully"}), 200

@app.route("/api/wishes/<string:wish_id>/reserve", methods=["POST"])
def reserve_wish(wish_id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    wish = Wish.query.get(wish_id)
    if not wish:
        return jsonify({"error": "Wish not found"}), 404

    # Update the reserved field to True
    wish.reserved = True
    db.session.commit()

    return jsonify({"message": "Wish reserved successfully", "reserved": wish.reserved}), 200


if __name__ == "__main__":
    app.run(debug=False)
