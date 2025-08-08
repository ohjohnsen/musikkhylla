import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import Album from './Album';
import AlbumDetailModal from './AlbumDetailModal';
import { MusicRackContainer, ModeToggle } from './AlbumStyles';
import { useAuth } from '../context/AuthContext';

const MusicRack = () => {
  const { user, logout } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch albums from backend
  useEffect(() => {
    // Only fetch albums if user is authenticated
    if (!user) return;
    
    const fetchAlbums = async (retryCount = 0) => {
      try {
        const response = await axios.get('/albums');
        setAlbums(response.data.albums);
        setLoading(false);
      } catch (err) {
        // If it's a 401 and this is our first attempt, retry once after a short delay
        if (err.response?.status === 401 && retryCount === 0) {
          setTimeout(() => fetchAlbums(1), 200);
          return;
        }
        
        setError(err.response?.data?.error || 'Failed to fetch albums');
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [user]); // Dependency on user ensures this runs after authentication

  const moveAlbum = useCallback((fromIndex, toIndex) => {
    setAlbums(prevAlbums => {
      const newAlbums = [...prevAlbums];
      const [movedAlbum] = newAlbums.splice(fromIndex, 1);
      newAlbums.splice(toIndex, 0, movedAlbum);
      return newAlbums;
    });
  }, []);

  // Save album order to backend when reorder mode is turned off
  const saveAlbumOrder = useCallback(async () => {
    try {
      await axios.post('/albums/reorder', { albums });
    } catch (err) {
      console.error('Failed to save album order:', err);
      // You might want to show a toast notification here
    }
  }, [albums]);

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
  };

  const closeModal = () => {
    setSelectedAlbum(null);
  };

  const toggleMode = () => {
    if (isReorderMode) {
      // Save order when exiting reorder mode
      saveAlbumOrder();
    }
    setIsReorderMode(!isReorderMode);
  };

  if (loading) {
    return (
      <MusicRackContainer>
        <p style={{ color: 'white', fontSize: '18px' }}>Loading your music collection...</p>
      </MusicRackContainer>
    );
  }

  if (error) {
    return (
      <MusicRackContainer>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <p style={{ fontSize: '18px', marginBottom: '20px' }}>
            Error loading albums: {error}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '10px 20px',
              background: 'white',
              color: '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </MusicRackContainer>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ position: 'relative' }}>
        <div style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '20px', 
          color: 'white',
          background: 'rgba(0,0,0,0.2)',
          padding: '10px 15px',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          Welcome, {user?.email}
          <button 
            onClick={logout}
            style={{
              marginLeft: '15px',
              padding: '5px 10px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Logout
          </button>
        </div>
        
        <ModeToggle onClick={toggleMode} isReorderMode={isReorderMode}>
          {isReorderMode ? '🔄 Reorder Mode' : '👆 View Mode'}
        </ModeToggle>
        
        <MusicRackContainer>
          {albums.map((album, index) => (
            <Album
              key={album.id}
              album={album}
              index={index}
              moveAlbum={moveAlbum}
              onClick={handleAlbumClick}
              isReorderMode={isReorderMode}
            />
          ))}
        </MusicRackContainer>

        {selectedAlbum && (
          <AlbumDetailModal album={selectedAlbum} onClose={closeModal} />
        )}
      </div>
    </DndProvider>
  );
};

export default MusicRack;
