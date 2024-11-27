from dotenv import load_dotenv
import os
import redis

# Load environment variables from the .env file
load_dotenv()

class ApplicationConfig:
    SECRET_KEY = os.environ.get("SECRET_KEY")  # Get the SECRET_KEY from the .env file

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_DATABASE_URI = r"sqlite:///./db.sqlite"

    SESSION_TYPE = "redis"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True

    # Get the REDIS_URL from the .env file and use it for Redis configuration
    REDIS_URL = os.environ.get("REDIS_URL")
    SESSION_REDIS = redis.from_url(REDIS_URL)  # Use redis.from_url to configure Redis from the URL

    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = True
