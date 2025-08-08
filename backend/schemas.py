from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth schemas
class EmailRequest(BaseModel):
    email: EmailStr

class CodeVerification(BaseModel):
    email: EmailStr
    code: str

class UserResponse(BaseModel):
    id: int
    email: str
    created_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    token: str
    user: UserResponse

# Album schemas
class AlbumBase(BaseModel):
    title: str
    artist: str
    year: Optional[int] = None
    cover_url: Optional[str] = None
    spotify_url: Optional[str] = None
    apple_music_url: Optional[str] = None
    tidal_url: Optional[str] = None

class AlbumCreate(AlbumBase):
    pass

class AlbumUpdate(BaseModel):
    title: Optional[str] = None
    artist: Optional[str] = None
    year: Optional[int] = None
    cover_url: Optional[str] = None
    spotify_url: Optional[str] = None
    apple_music_url: Optional[str] = None
    tidal_url: Optional[str] = None

class AlbumResponse(AlbumBase):
    id: int
    position: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AlbumReorder(BaseModel):
    albums: List[AlbumResponse]

# Response schemas
class MessageResponse(BaseModel):
    message: str

class ErrorResponse(BaseModel):
    error: str
