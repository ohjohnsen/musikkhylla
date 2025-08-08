import styled from 'styled-components';

export const MusicRackContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 400px;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  margin: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

export const AlbumSpine = styled.div`
  width: 40px;
  height: ${props => props.height || 300}px;
  background: ${props => props.color || '#333'};
  margin: 0 2px;
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  ${props => props.isDragging && `
    opacity: 0.5;
    transform: rotate(5deg);
  `}

  ${props => props.isOver && `
    transform: translateY(-10px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
  `}
`;

export const AlbumText = styled.div`
  position: absolute;
  bottom: 20px;
  left: 30px;
  transform: rotate(-90deg);
  transform-origin: left bottom;
  white-space: nowrap;
  color: white;
  font-size: 13px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ModeToggle = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: ${props => props.isReorderMode ? '#ff6b6b' : '#4ecdc4'};
  color: white;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }
`;

export const AlbumModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

export const AlbumCover = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 12px;
  object-fit: cover;
  margin: 0 auto 20px;
  display: block;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
`;

export const AlbumTitle = styled.h2`
  margin: 0 0 10px;
  color: #333;
  text-align: center;
`;

export const AlbumArtist = styled.h3`
  margin: 0 0 10px;
  color: #666;
  font-weight: 400;
  text-align: center;
`;

export const AlbumYear = styled.p`
  margin: 0 0 20px;
  color: #999;
  text-align: center;
`;

export const StreamingLinks = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
`;

export const StreamingLink = styled.a`
  padding: 10px 16px;
  background: #333;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: #555;
    transform: translateY(-2px);
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 5px;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f0f0f0;
    color: #333;
  }
`;
