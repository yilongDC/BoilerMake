from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

class Database:
    def __init__(self):
        self.client = None
        self.db = None

    def connect(self):
        if not self.client:
            self.client = MongoClient(os.getenv('MONGO_URI'))
            self.db = self.client[os.getenv('DB_NAME')]
        return self.db

    def get_collection(self, collection_name):
        return self.connect()[collection_name]

db = Database()
