from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime, timedelta, timezone
import secrets
import string
from database import Base

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(120), unique=True, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True))
    
    # Relationships
    albums = relationship('UserAlbum', back_populates='user', cascade='all, delete-orphan')
    auth_codes = relationship('AuthCode', back_populates='user', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<User {self.email}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }

class AuthCode(Base):
    __tablename__ = 'auth_codes'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    code = Column(String(6), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)
    used = Column(Boolean, default=False)
    
    # Relationships
    user = relationship('User', back_populates='auth_codes')
    
    def __init__(self, user_id, expiry_minutes=10, **kwargs):
        super().__init__(**kwargs)
        self.user_id = user_id
        self.code = self.generate_code()
        self.expires_at = datetime.now(timezone.utc) + timedelta(minutes=expiry_minutes)
    
    @staticmethod
    def generate_code():
        """Generate a 6-digit numeric code"""
        return ''.join(secrets.choice(string.digits) for _ in range(6))
    
    def is_expired(self):
        return datetime.now(timezone.utc) > self.expires_at
    
    def is_valid(self):
        return not self.used and not self.is_expired()

class UserAlbum(Base):
    __tablename__ = 'user_albums'
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    title = Column(String(200), nullable=False)
    artist = Column(String(200), nullable=False)
    year = Column(Integer)
    cover_url = Column(Text)
    spotify_url = Column(Text)
    apple_music_url = Column(Text)
    tidal_url = Column(Text)
    position = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship('User', back_populates='albums')
    
    def __repr__(self):
        return f'<UserAlbum {self.title} by {self.artist}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'artist': self.artist,
            'year': self.year,
            'cover_url': self.cover_url,
            'spotify_url': self.spotify_url,
            'apple_music_url': self.apple_music_url,
            'tidal_url': self.tidal_url,
            'position': self.position,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
