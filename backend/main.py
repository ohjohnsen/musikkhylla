from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional, List
import uvicorn
import os

from database import SessionLocal, engine, get_db
from models import Base, User, UserAlbum
from schemas import (
    EmailRequest, CodeVerification, AuthResponse, UserResponse,
    AlbumCreate, AlbumUpdate, AlbumResponse, AlbumReorder,
    MessageResponse, ErrorResponse
)
from auth_service import AuthService

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Musikkhylla API",
    description="Backend API for the visual music rack application",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication dependency
async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> User:
    if not authorization:
        raise HTTPException(status_code=401, detail="No token provided")
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")
    
    token = authorization[7:]  # Remove "Bearer " prefix
    user = AuthService.verify_token(token, db)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return user

@app.get("/api/health", response_model=MessageResponse)
async def health():
    """Health check endpoint"""
    return {"message": "Musikkhylla API is running!"}

# Authentication endpoints
@app.post("/api/auth/request-code", response_model=MessageResponse)
async def request_login_code(
    request: EmailRequest,
    db: Session = Depends(get_db)
):
    """Request a login code via email"""
    result = AuthService.request_login_code(request.email, db)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return {"message": result["message"]}

@app.post("/api/auth/verify-code", response_model=AuthResponse)
async def verify_login_code(
    request: CodeVerification,
    db: Session = Depends(get_db)
):
    """Verify login code and return JWT token"""
    result = AuthService.verify_login_code(request.email, request.code, db)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return {
        "token": result["token"],
        "user": result["user"]
    }

@app.get("/api/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user

# Album endpoints
@app.get("/api/albums")
async def get_albums(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's album collection"""
    # Get user's albums, ordered by position
    user_albums = db.query(UserAlbum).filter(
        UserAlbum.user_id == current_user.id
    ).order_by(UserAlbum.position).all()
    
    # If user has no albums, add some sample albums
    if not user_albums:
        sample_albums = [
            {
                'title': 'Abbey Road',
                'artist': 'The Beatles',
                'year': 1969,
                'cover_url': 'https://via.placeholder.com/300x300/8B4513/FFFFFF?text=Abbey+Road',
                'spotify_url': 'https://open.spotify.com/album/0ETFjACtuP2ADo6LFhL6HN',
                'apple_music_url': '#',
                'tidal_url': '#',
                'position': 0
            },
            {
                'title': 'Dark Side of the Moon',
                'artist': 'Pink Floyd',
                'year': 1973,
                'cover_url': 'https://via.placeholder.com/300x300/000000/FFFFFF?text=Dark+Side',
                'spotify_url': 'https://open.spotify.com/album/4LH4d3cOWNNsVw41Gqt2kv',
                'apple_music_url': '#',
                'tidal_url': '#',
                'position': 1
            },
            {
                'title': 'Nevermind',
                'artist': 'Nirvana',
                'year': 1991,
                'cover_url': 'https://via.placeholder.com/300x300/4169E1/FFFFFF?text=Nevermind',
                'spotify_url': 'https://open.spotify.com/album/2UJcKiJxNryhL050F5Z1Fk',
                'apple_music_url': '#',
                'tidal_url': '#',
                'position': 2
            },
            {
                'title': 'Back in Black',
                'artist': 'AC/DC',
                'year': 1980,
                'cover_url': 'https://via.placeholder.com/300x300/000000/FFFFFF?text=Back+in+Black',
                'spotify_url': 'https://open.spotify.com/album/6mUdeDZCsExyJLMdAfDuwh',
                'apple_music_url': '#',
                'tidal_url': '#',
                'position': 3
            },
            {
                'title': 'Thriller',
                'artist': 'Michael Jackson',
                'year': 1982,
                'cover_url': 'https://via.placeholder.com/300x300/FF0000/FFFFFF?text=Thriller',
                'spotify_url': 'https://open.spotify.com/album/2ANVost0y2y52ema1E9xAZ',
                'apple_music_url': '#',
                'tidal_url': '#',
                'position': 4
            }
        ]
        
        # Add sample albums to database
        for album_data in sample_albums:
            album = UserAlbum(
                user_id=current_user.id,
                **album_data
            )
            db.add(album)
        
        db.commit()
        
        # Refresh the query
        user_albums = db.query(UserAlbum).filter(
            UserAlbum.user_id == current_user.id
        ).order_by(UserAlbum.position).all()
    
    albums_data = [album.to_dict() for album in user_albums]
    return {"albums": albums_data}

@app.post("/api/albums", response_model=AlbumResponse)
async def create_album(
    album: AlbumCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new album"""
    # Get the next position
    max_position = db.query(UserAlbum).filter(
        UserAlbum.user_id == current_user.id
    ).count()
    
    db_album = UserAlbum(
        user_id=current_user.id,
        position=max_position,
        **album.dict()
    )
    db.add(db_album)
    db.commit()
    db.refresh(db_album)
    
    return db_album

@app.post("/api/albums/reorder", response_model=MessageResponse)
async def reorder_albums(
    reorder_data: AlbumReorder,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update album positions"""
    try:
        for index, album_data in enumerate(reorder_data.albums):
            album = db.query(UserAlbum).filter(
                UserAlbum.id == album_data.id,
                UserAlbum.user_id == current_user.id
            ).first()
            
            if album:
                album.position = index
        
        db.commit()
        return {"message": "Album order updated successfully"}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to update album order")

@app.put("/api/albums/{album_id}", response_model=AlbumResponse)
async def update_album(
    album_id: int,
    album_update: AlbumUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update an album"""
    album = db.query(UserAlbum).filter(
        UserAlbum.id == album_id,
        UserAlbum.user_id == current_user.id
    ).first()
    
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    
    # Update only provided fields
    update_data = album_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(album, field, value)
    
    db.commit()
    db.refresh(album)
    
    return album

@app.delete("/api/albums/{album_id}", response_model=MessageResponse)
async def delete_album(
    album_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an album"""
    album = db.query(UserAlbum).filter(
        UserAlbum.id == album_id,
        UserAlbum.user_id == current_user.id
    ).first()
    
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    
    db.delete(album)
    db.commit()
    
    return {"message": "Album deleted successfully"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="127.0.0.1", 
        port=3001, 
        reload=True
    )
