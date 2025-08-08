import React from 'react';
import styled from 'styled-components';
import {
  AlbumModal,
  ModalContent,
  AlbumCover,
  AlbumTitle,
  AlbumArtist,
  AlbumYear,
  CloseButton
} from './AlbumStyles';

// Streaming service button components
const StreamingLinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  width: 100%;
`;

const StreamingButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 20px;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &.spotify {
    background: #1DB954;
    color: white;
  }

  &.apple {
    background: linear-gradient(135deg, #FC3C44 0%, #FF2D92 100%);
    color: white;
  }

  &.tidal {
    background: #000000;
    color: white;
  }
`;

const StreamingIcon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
`;

// Icon components (using Unicode symbols and text)
const SpotifyIcon = () => (
  <StreamingIcon>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.32 11.28-1.08 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  </StreamingIcon>
);

const AppleIcon = () => (
  <StreamingIcon>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  </StreamingIcon>
);

const TidalIcon = () => (
  <StreamingIcon>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.012 3.992L8.008 7.996 12.012 12l4.004-4.004L12.012 3.992zm-4.004 8.008L4.004 15.996 8.008 20l4.004-4.004L8.008 12zm8.008 0L12.012 15.996 16.016 20l4.004-4.004L16.016 12z"/>
    </svg>
  </StreamingIcon>
);

const AlbumDetailModal = ({ album, onClose }) => {
  if (!album) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Function to convert Spotify web URL to app URL
  const getSpotifyAppUrl = (webUrl) => {
    if (!webUrl) return null;
    
    // Extract album ID from Spotify web URL
    const match = webUrl.match(/spotify\.com\/album\/([a-zA-Z0-9]+)/);
    if (match && match[1]) {
      return `spotify:album:${match[1]}`;
    }
    return webUrl; // Fallback to original URL if parsing fails
  };

  // Function to handle Spotify link click
  const handleSpotifyClick = (e) => {
    e.preventDefault();
    const appUrl = getSpotifyAppUrl(album.spotify_url);
    const webUrl = album.spotify_url;
    
    // Track if user left the page (indicates app opened)
    let appOpened = false;
    let fallbackTimeout;
    
    const handleBlur = () => {
      appOpened = true;
      clearTimeout(fallbackTimeout);
    };
    
    const handleFocus = () => {
      // If user comes back quickly, app probably didn't open
      if (!appOpened) {
        clearTimeout(fallbackTimeout);
        window.open(webUrl, '_blank', 'noopener,noreferrer');
      }
    };
    
    // Add event listeners
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    
    // Try to open in app
    window.location.href = appUrl;
    
    // Set a fallback timeout
    fallbackTimeout = setTimeout(() => {
      // Clean up event listeners
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      
      // If app didn't open, open web version
      if (!appOpened) {
        window.open(webUrl, '_blank', 'noopener,noreferrer');
      }
    }, 2000);
    
    // Clean up listeners after a reasonable time
    setTimeout(() => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      clearTimeout(fallbackTimeout);
    }, 5000);
  };

  // Check which streaming services have valid URLs
  const hasSpotify = album.spotify_url && album.spotify_url !== '#' && album.spotify_url.trim() !== '';
  const hasAppleMusic = album.apple_music_url && album.apple_music_url !== '#' && album.apple_music_url.trim() !== '';
  const hasTidal = album.tidal_url && album.tidal_url !== '#' && album.tidal_url.trim() !== '';

  return (
    <AlbumModal onClick={handleBackdropClick}>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <AlbumCover src={album.cover_url} alt={`${album.title} cover`} />
        <AlbumTitle>{album.title}</AlbumTitle>
        <AlbumArtist>{album.artist}</AlbumArtist>
        {album.year && <AlbumYear>{album.year}</AlbumYear>}
        
        {(hasSpotify || hasAppleMusic || hasTidal) && (
          <StreamingLinksContainer>
            {hasSpotify && (
              <StreamingButton 
                href="#"
                onClick={handleSpotifyClick}
                className="spotify"
              >
                <SpotifyIcon />
                Open in Spotify
              </StreamingButton>
            )}
            
            {hasAppleMusic && (
              <StreamingButton 
                href={album.apple_music_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="apple"
              >
                <AppleIcon />
                Listen on Apple Music
              </StreamingButton>
            )}
            
            {hasTidal && (
              <StreamingButton 
                href={album.tidal_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="tidal"
              >
                <TidalIcon />
                Listen on Tidal
              </StreamingButton>
            )}
          </StreamingLinksContainer>
        )}
      </ModalContent>
    </AlbumModal>
  );
};

export default AlbumDetailModal;
