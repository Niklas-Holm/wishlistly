from dotenv import load_dotenv, find_dotenv
import os
import redis

# Automatically find and load the correct .env file based on ENV
load_dotenv()  # This loads the .env file

# Get the value of FLASK_ENV to determine which specific .env file to load
flask_env = os.environ.get('FLASK_ENV')  # Default to 'development' if not set

# Load the environment-specific file
if flask_env == 'development':
    load_dotenv('.env.development')
elif flask_env == 'production':
    load_dotenv('.env.production')

print(f"Using environment: {os.environ.get('FLASK_ENV')}")

redis_url = os.environ.get('REDIS_URL')  # This should be defined in your .env file

if redis_url:
    print(f"Using Redis server: {redis_url}")
else:
    print("Redis server is not configured.")

class ApplicationConfig:
    # Common configurations
    SECRET_KEY = os.environ.get("SECRET_KEY")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = os.environ.get("ENV", "development") == "development"  # Enable echo in development

    # Environment-specific database configuration
    if os.environ.get("ENV") == "production":
        SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")  # Use production database
    else:
        SQLALCHEMY_DATABASE_URI = os.environ.get("DEV_DATABASE_URL", "sqlite:///./db.sqlite")  # Default to SQLite

    # Redis configuration
    REDIS_URL = os.environ.get("REDIS_URL")
    SESSION_TYPE = "redis"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_REDIS = redis.from_url(REDIS_URL)
    
    # Cookie settings
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = os.environ.get("ENV") == "production"  # Secure cookies only in production
