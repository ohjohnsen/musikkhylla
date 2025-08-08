import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Album from './Album';
import AlbumDetailModal from './AlbumDetailModal';
import { MusicRackContainer, ModeToggle } from './AlbumStyles';

const MusicRack = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch albums from backend
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/albums');
        if (!response.ok) {
          throw new Error('Failed to fetch albums');
        }
        const data = await response.json();
        setAlbums(data.albums);
      } catch (err) {
        setError(err.message);
        // Fallback to sample data if API fails
        setAlbums([
          {
            id: 1,
            title: "Abbey Road",
            artist: "The Beatles",
            year: 1969,
            coverUrl: "https://via.placeholder.com/300x300?text=Abbey+Road",
            spotifyUrl: "#",
            appleMusicUrl: "#",
            tidalUrl: "#"
          },
          {
            id: 2,
            title: "Dark Side of the Moon",
            artist: "Pink Floyd",
            year: 1973,
            coverUrl: "https://via.placeholder.com/300x300?text=Dark+Side",
            spotifyUrl: "#",
            appleMusicUrl: "#",
            tidalUrl: "#"
          },
          {
            id: 3,
            title: "Thriller",
            artist: "Michael Jackson",
            year: 1982,
            coverUrl: "https://via.placeholder.com/300x300?text=Thriller",
            spotifyUrl: "#",
            appleMusicUrl: "#",
            tidalUrl: "#"
          },
          {
            id: 4,
            title: "Nevermind",
            artist: "Nirvana",
            year: 1991,
            coverUrl: "https://via.placeholder.com/300x300?text=Nevermind",
            spotifyUrl: "#",
            appleMusicUrl: "#",
            tidalUrl: "#"
          },
          {
            id: 5,
            title: "Kind of Blue",
            artist: "Miles Davis",
            year: 1959,
            coverUrl: "https://via.placeholder.com/300x300?text=Kind+of+Blue",
            spotifyUrl: "#",
            appleMusicUrl: "#",
            tidalUrl: "#"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const moveAlbum = useCallback((fromIndex, toIndex) => {
    setAlbums(prevAlbums => {
      const newAlbums = [...prevAlbums];
      const [movedAlbum] = newAlbums.splice(fromIndex, 1);
      newAlbums.splice(toIndex, 0, movedAlbum);
      return newAlbums;
    });
  }, []);

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
  };

  const closeModal = () => {
    setSelectedAlbum(null);
  };

  const toggleMode = () => {
    setIsReorderMode(!isReorderMode);
  };

  if (loading) {
    return (
      <MusicRackContainer>
        <p style={{ color: 'white', fontSize: '18px' }}>Loading your music collection...</p>
      </MusicRackContainer>
    );
  }

  if (error && albums.length === 0) {
    return (
      <MusicRackContainer>
        <p style={{ color: 'white', fontSize: '18px' }}>Error loading albums: {error}</p>
      </MusicRackContainer>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ position: 'relative' }}>
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
