import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &.required {
    border-color: ${props => props.hasError ? '#e74c3c' : '#e1e5e9'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &.secondary {
    background: #f8f9fa;
    color: #333;
    border: 1px solid #e1e5e9;

    &:hover {
      background: #e9ecef;
    }
  }
`;

const ErrorText = styled.span`
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
`;

const AddAlbumModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    year: '',
    cover_url: '',
    spotify_url: '',
    apple_music_url: '',
    tidal_url: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Album title is required';
    }

    if (!formData.artist.trim()) {
      newErrors.artist = 'Artist name is required';
    }

    if (formData.year && (isNaN(formData.year) || formData.year < 1900 || formData.year > new Date().getFullYear() + 1)) {
      newErrors.year = 'Please enter a valid year';
    }

    // Simple URL validation for optional fields
    const urlFields = ['cover_url', 'spotify_url', 'apple_music_url', 'tidal_url'];
    urlFields.forEach(field => {
      if (formData[field] && !isValidUrl(formData[field])) {
        newErrors[field] = 'Please enter a valid URL';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const albumData = {
      ...formData,
      year: formData.year ? parseInt(formData.year) : null,
      // Remove empty string fields
      cover_url: formData.cover_url || null,
      spotify_url: formData.spotify_url || null,
      apple_music_url: formData.apple_music_url || null,
      tidal_url: formData.tidal_url || null,
    };

    const success = await onSubmit(albumData);
    if (success) {
      // Reset form and close modal
      setFormData({
        title: '',
        artist: '',
        year: '',
        cover_url: '',
        spotify_url: '',
        apple_music_url: '',
        tidal_url: ''
      });
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      artist: '',
      year: '',
      cover_url: '',
      spotify_url: '',
      apple_music_url: '',
      tidal_url: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Add New Album</ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Album Title *</Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="required"
              hasError={!!errors.title}
              disabled={isLoading}
            />
            {errors.title && <ErrorText>{errors.title}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="artist">Artist *</Label>
            <Input
              id="artist"
              name="artist"
              type="text"
              value={formData.artist}
              onChange={handleChange}
              className="required"
              hasError={!!errors.artist}
              disabled={isLoading}
            />
            {errors.artist && <ErrorText>{errors.artist}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="year">Release Year</Label>
            <Input
              id="year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              placeholder="e.g. 1969"
              hasError={!!errors.year}
              disabled={isLoading}
            />
            {errors.year && <ErrorText>{errors.year}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="cover_url">Cover Image URL</Label>
            <Input
              id="cover_url"
              name="cover_url"
              type="url"
              value={formData.cover_url}
              onChange={handleChange}
              placeholder="https://example.com/cover.jpg"
              hasError={!!errors.cover_url}
              disabled={isLoading}
            />
            {errors.cover_url && <ErrorText>{errors.cover_url}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="spotify_url">Spotify URL</Label>
            <Input
              id="spotify_url"
              name="spotify_url"
              type="url"
              value={formData.spotify_url}
              onChange={handleChange}
              placeholder="https://open.spotify.com/album/..."
              hasError={!!errors.spotify_url}
              disabled={isLoading}
            />
            {errors.spotify_url && <ErrorText>{errors.spotify_url}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="apple_music_url">Apple Music URL</Label>
            <Input
              id="apple_music_url"
              name="apple_music_url"
              type="url"
              value={formData.apple_music_url}
              onChange={handleChange}
              placeholder="https://music.apple.com/..."
              hasError={!!errors.apple_music_url}
              disabled={isLoading}
            />
            {errors.apple_music_url && <ErrorText>{errors.apple_music_url}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="tidal_url">Tidal URL</Label>
            <Input
              id="tidal_url"
              name="tidal_url"
              type="url"
              value={formData.tidal_url}
              onChange={handleChange}
              placeholder="https://tidal.com/..."
              hasError={!!errors.tidal_url}
              disabled={isLoading}
            />
            {errors.tidal_url && <ErrorText>{errors.tidal_url}</ErrorText>}
          </FormGroup>

          <ButtonGroup>
            <Button type="button" className="secondary" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="primary" disabled={isLoading}>
              {isLoading ? 'Adding Album...' : 'Add Album'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AddAlbumModal;
