from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from datetime import datetime

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

# User model
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)  # Unique user ID
    email = db.Column(db.String(345), unique=True, nullable=False)  # Email address
    password = db.Column(db.Text, nullable=False)  # Hashed password
    name = db.Column(db.String(100), nullable=False)  # User's name
    phone_number = db.Column(db.String(15), nullable=True)
    profile_photo = db.Column(db.Text, nullable=True)  # URL or path to the product image
    date_created = db.Column(db.DateTime, default=datetime.utcnow)  # Account creation timestamp
    friends = db.Column(db.Text, default='[]')

    # Relationship to the Wish model
    wishes = db.relationship("Wish", back_populates="user", cascade="all, delete-orphan")

# Wish model
class Wish(db.Model):
    __tablename__ = "wishes"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)  # Unique wish ID
    user_id = db.Column(db.String(32), db.ForeignKey("users.id"), nullable=False)  # Foreign key to the User
    product_name = db.Column(db.String(200), nullable=False)  # Name of the product
    product_link = db.Column(db.Text, nullable=True)  # URL to the product page
    product_photo = db.Column(db.Text, nullable=True)  # URL or path to the product image
    description = db.Column(db.String(500))
    price = db.Column(db.Float, nullable=True)  # Price of the product
    reserved = db.Column(db.Boolean, default=False, nullable=False)  # Reserved status (default: False)
    created_at = db.Column(db.DateTime, default=datetime.now)  # Timestamp for when the wish was created

    # Relationship back to the User model
    user = db.relationship("User", back_populates="wishes")
