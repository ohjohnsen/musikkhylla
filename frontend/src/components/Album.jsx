import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { AlbumSpine, AlbumText } from './AlbumStyles';

const ITEM_TYPE = 'ALBUM';

const Album = ({ album, index, moveAlbum, onClick, isReorderMode }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id: album.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isReorderMode,
  });

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveAlbum(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const ref = React.useRef(null);
  drag(drop(ref));

  // Generate a color based on album title for visual variety
  const generateColor = (title) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 60%, 45%)`;
  };

  const handleClick = () => {
    if (!isReorderMode) {
      onClick(album);
    }
  };

  return (
    <AlbumSpine
      ref={ref}
      height={250 + (index % 3) * 50} // Vary heights for visual interest
      color={generateColor(album.title)}
      isDragging={isDragging}
      isOver={isOver}
      onClick={handleClick}
      style={{ cursor: isReorderMode ? 'grab' : 'pointer' }}
    >
      <AlbumText height={250 + (index % 3) * 50}>
        {album.artist} - {album.title}
      </AlbumText>
    </AlbumSpine>
  );
};

export default Album;
