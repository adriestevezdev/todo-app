import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "todo_db")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]
todos_collection = db["todos"]
