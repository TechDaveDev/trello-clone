"use client";

import Card from './Card';
import { Droppable } from '@hello-pangea/dnd';
import { ColumnType } from '@/app/page';
import { useState } from 'react';

type ColumnProps = {
  column: ColumnType;
  addCard: (text: string, columnId: string) => void;
  deleteCard: (cardId: string, columnId: string) => void;
  deleteColumn: (columnId: string) => void;
  updateColumnTitle: (columnId: string, newTitle: string) => void;
  updateCardText: (cardId: string, newText: string) => void;
};

const Column = ({ column, addCard, deleteCard, deleteColumn, updateColumnTitle, updateCardText }: ColumnProps) => {

  const [newCardText, setNewCardText] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  const handleAddCard = () => {
    if (newCardText.trim() === '') return;

    addCard(newCardText, column.id);

    setNewCardText('');
    setIsAddingCard(false);
  };

  const handleTitleChange = () => {
    if (editedTitle.trim() === '' || editedTitle === column.title) {
      setIsEditingTitle(false);
      return;
    }
    updateColumnTitle(column.id, editedTitle);
    setIsEditingTitle(false);
  };

  return (
    <div className="bg-card text-foreground p-3 rounded-lg w-full md:w-80 flex-shrink-0 flex flex-col max-h-full">
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        {isEditingTitle ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleTitleChange}
            onKeyDown={(e) => { if (e.key === 'Enter') handleTitleChange(); }}
            className="font-bold text-lg bg-transparent border-2 border-primary rounded-md focus:outline-none w-full mr-2 p-1"
            autoFocus
          />
        ) : (
          <h2
            onClick={() => setIsEditingTitle(true)}
            className="font-bold text-lg cursor-pointer"
          >
            {column.title}
          </h2>
        )}
        <button
          onClick={() => deleteColumn(column.id)}
          className="w-8 h-8 flex items-center justify-center rounded-md text-foreground/50 hover:bg-background hover:text-red-500 transition-colors"
        >
          🗑️
        </button>
      </div>

      <Droppable droppableId={String(column.id)}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col flex-grow"
          >
            <div className="flex-grow min-h-[6rem] overflow-y-auto pr-2">
              {column.cards.map((card, index) => (
                <Card
                  key={card.id}
                  card={card}
                  index={index}
                  deleteCard={() => deleteCard(card.id, column.id)}
                  updateCardText={updateCardText}
                />
              ))}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="mt-4 flex-shrink-0">
        {isAddingCard ? (
          <div>
            <textarea
              className="w-full p-2 rounded-md bg-background border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Introduce un título..."
              rows={3}
              value={newCardText}
              onChange={(e) => setNewCardText(e.target.value)}
              autoFocus
            />
            <div className="mt-2 flex items-center space-x-2">
              <button
                onClick={handleAddCard}
                className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
              >
                Añadir Tarjeta
              </button>
              <button
                onClick={() => setIsAddingCard(false)}
                className="p-2 text-foreground/70 hover:bg-background rounded-md"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="mt-2 w-full text-left p-2 text-foreground/70 hover:bg-background rounded-md transition-colors"
          >
            + Añadir otra tarjeta
          </button>
        )}
      </div>
    </div>
  );
};

export default Column;