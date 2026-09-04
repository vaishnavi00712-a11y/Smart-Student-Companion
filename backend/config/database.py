"""
Database Configuration Module for Smart Student Companion.

This module connects to MongoDB using the asynchronous driver 'Motor'.
It loads connection credentials securely from the .env file.
"""

import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ServerSelectionTimeoutError

# Load environment variables from .env file
load_dotenv()

# Read MongoDB URL and Database Name from environment variables
# Defaults to localhost if not specified in .env
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "smart_student_db")

# Create the asynchronous Motor client with a 3-second server selection timeout
# This prevents the application from hanging if MongoDB is not currently running
client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=3000)

# Reference to the specific database
db = client[DATABASE_NAME]

# Specific Collections for our three academic modules
assignments_collection = db["assignments"]
attendance_collection = db["attendance"]
marks_collection = db["marks"]


async def check_db_connection() -> bool:
    """
    Pings the MongoDB server to verify that the connection is active.
    Returns True if connected, False otherwise.
    """
    try:
        # The 'ping' command is very lightweight and confirms server availability
        await client.admin.command("ping")
        print(f"â Successfully connected to MongoDB database: '{DATABASE_NAME}'")
        return True
    except ServerSelectionTimeoutError:
        print(
            f"â ï¸ Warning: Could not connect to MongoDB at {MONGODB_URL}.\n"
            f"   Please ensure MongoDB service is running or check your connection string in .env."
        )
        return False
    except Exception as e:
        print(f"â ï¸ MongoDB Connection Error: {e}")
        return False


def format_doc(doc: dict) -> dict:
    """
    Helper function to convert MongoDB's internal '_id' (ObjectId)
    into a clean string format that FastAPI and JSON can serialize.
    """
    if not doc:
        return doc
    doc_copy = dict(doc)
    if "_id" in doc_copy:
        doc_copy["id"] = str(doc_copy["_id"])
        doc_copy["_id"] = str(doc_copy["_id"])
    return doc_copy
