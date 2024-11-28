from dotenv import load_dotenv, find_dotenv
import os
import redis

# Automatically find and load the correct .env file based on ENV
env_file = find_dotenv(f".env.{os.environ.get('ENV', 'development')}")
load_dotenv(env_file)

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
