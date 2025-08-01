"use client";

import { Draggable } from '@hello-pangea/dnd';
import { CardType } from '@/app/page';
import { useState } from 'react';

type CardProps = {
  card: CardType;
  index: number;
  deleteCard: () => void;
  updateCardText: (cardId: string, newText: string) => void;
};

const Card = ({ card, index, deleteCard, updateCardText }: CardProps) => {

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(card.text);

  const handleTextChange = () => {
    if (editedText.trim() === '' || editedText === card.text) {
      setIsEditing(false);
      return;
    }
    updateCardText(String(card.id), editedText);
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={String(card.id)} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="bg-background p-2 mb-2 rounded-lg shadow-sm flex justify-between items-center group transition-all duration-200 hover:shadow-md"
          onDoubleClick={() => setIsEditing(true)}
        >
          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onBlur={handleTextChange}
              onKeyDown={(e) => e.key === 'Enter' && handleTextChange()}
              className="w-full p-1 border-2 border-blue-500 rounded"
              autoFocus
            />
          ) : (
            <span>{card.text}</span>
          )}
          <button
            onClick={deleteCard}
            className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            &#x2715;
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default Card;