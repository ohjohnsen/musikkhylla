#!/usr/bin/env python3

import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

# Database connection
DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql://localhost:5432/musikkhylla')
engine = create_engine(DATABASE_URL)

def reset_database():
    """Drop existing tables and recreate them with new schema"""
    with engine.connect() as conn:
        # Drop existing tables
        print("Dropping existing tables...")
        conn.execute(text("DROP TABLE IF EXISTS user_albums CASCADE"))
        conn.execute(text("DROP TABLE IF EXISTS auth_codes CASCADE"))
        conn.execute(text("DROP TABLE IF EXISTS users CASCADE"))
        conn.commit()
        print("Tables dropped successfully!")

if __name__ == "__main__":
    reset_database()
    print("Database reset complete. Restart the FastAPI server to create new tables.")