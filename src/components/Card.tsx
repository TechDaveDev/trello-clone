"use client";

import { useState } from 'react';

import { Draggable } from '@hello-pangea/dnd';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';

import { CardType } from '@/app/page';

type CardProps = {
  card: CardType;
  index: number;
  deleteCard: () => void;
  updateCardText: (cardId: string, newText: string) => void;
};

export default function Card({ card, index, deleteCard, updateCardText }: CardProps) {

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
          className="bg-card-item text-foreground p-3 mb-3 rounded-xl shadow-sm group relative border border-transparent transition-all duration-200 hover:shadow-md hover:border-primary/30"
          onDoubleClick={() => setIsEditing(true)}
        >
          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onBlur={handleTextChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); handleTextChange(); }
              }}
              className="w-full p-2 bg-background border-2 border-primary rounded-lg focus:outline-none resize-none text-sm"
              autoFocus
            />
          ) : (
            <div className="flex items-start gap-2">
              <GripVertical size={14} className="text-foreground/20 mt-1 flex-shrink-0" />

              <p className="break-words pr-16 text-sm leading-relaxed">
                {card.text}
              </p>
            </div>
          )}

          {!isEditing && (
            <div
              className="absolute top-2 right-2 flex gap-1 opacity-100 pointer-events-auto md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => setIsEditing(true)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-foreground/5 text-foreground/60 md:bg-transparent md:text-foreground/40 hover:text-primary transition-colors"
                title="Editar tarjeta"
              >
                <Pencil size={14} />
              </button>

              <button
                onClick={deleteCard}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 md:bg-transparent md:text-foreground/40 md:hover:bg-red-500/10 md:hover:text-red-500 transition-colors"
                title="Eliminar tarjeta"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};