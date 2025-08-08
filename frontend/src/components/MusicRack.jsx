import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import Album from './Album';
import AlbumDetailModal from './AlbumDetailModal';
import AddAlbumModal from './AddAlbumModal';
import { MusicRackContainer, ModeToggle } from './AlbumStyles';
import { useAuth } from '../context/AuthContext';

const MusicRack = () => {
  const { user } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAddingAlbum, setIsAddingAlbum] = useState(false);

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

  const handleAddAlbum = async (albumData) => {
    setIsAddingAlbum(true);
    try {
      const response = await axios.post('/albums', albumData);
      const newAlbum = response.data;
      
      // Add the new album to the state
      setAlbums(prevAlbums => [...prevAlbums, newAlbum]);
      
      setIsAddingAlbum(false);
      return true; // Success
    } catch (err) {
      console.error('Failed to add album:', err);
      setError(err.response?.data?.detail || 'Failed to add album');
      setIsAddingAlbum(false);
      return false; // Failure
    }
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px',
          background: 'rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <ModeToggle onClick={toggleMode} isReorderMode={isReorderMode}>
            {isReorderMode ? '🔄 Reorder Mode' : '👆 View Mode'}
          </ModeToggle>
          
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
            }}
          >
            ➕ Add Album
          </button>
        </div>
        
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

        <AddAlbumModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddAlbum}
          isLoading={isAddingAlbum}
        />
      </div>
    </DndProvider>
  );
};

export default MusicRack;
