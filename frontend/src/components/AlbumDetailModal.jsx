import React from 'react';
import {
  AlbumModal,
  ModalContent,
  AlbumCover,
  AlbumTitle,
  AlbumArtist,
  AlbumYear,
  StreamingLinks,
  StreamingLink,
  CloseButton
} from './AlbumStyles';

const AlbumDetailModal = ({ album, onClose }) => {
  if (!album) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AlbumModal onClick={handleBackdropClick}>
      <ModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>
        <AlbumCover src={album.coverUrl} alt={`${album.title} cover`} />
        <AlbumTitle>{album.title}</AlbumTitle>
        <AlbumArtist>{album.artist}</AlbumArtist>
        <AlbumYear>{album.year}</AlbumYear>
        
        <StreamingLinks>
          {album.spotifyUrl && album.spotifyUrl !== '#' && (
            <StreamingLink href={album.spotifyUrl} target="_blank" rel="noopener noreferrer">
              🎵 Spotify
            </StreamingLink>
          )}
          {album.appleMusicUrl && album.appleMusicUrl !== '#' && (
            <StreamingLink href={album.appleMusicUrl} target="_blank" rel="noopener noreferrer">
              🍎 Apple Music
            </StreamingLink>
          )}
          {album.tidalUrl && album.tidalUrl !== '#' && (
            <StreamingLink href={album.tidalUrl} target="_blank" rel="noopener noreferrer">
              🌊 Tidal
            </StreamingLink>
          )}
        </StreamingLinks>
      </ModalContent>
    </AlbumModal>
  );
};

export default AlbumDetailModal;
