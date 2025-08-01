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
          className="bg-card-item text-foreground p-3 mb-2 rounded-lg shadow-sm group relative border border-transparent transition-shadow duration-200 hover:shadow-lg hover:border-primary/50"
          onDoubleClick={() => setIsEditing(true)}
        >
          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onBlur={handleTextChange}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleTextChange(); } }}
              className="w-full p-1 bg-transparent border-2 border-primary rounded-md focus:outline-none resize-none"
              autoFocus
            />
          ) : (
            <p className="break-words pr-6">{card.text}</p>
          )}

          <button
            onClick={deleteCard}
            className="absolute top-2 right-2 w-6 h-6 flex-shrink-0 flex items-center justify-center rounded text-gray-400 hover:bg-background hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            &#x2715;
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default Card;