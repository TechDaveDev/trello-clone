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
    <div className="bg-card p-3 rounded-lg w-full md:w-72 flex-shrink-0 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        {isEditingTitle ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleTitleChange}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleChange()}
            className="font-bold text-lg w-min rounded outline-0"
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
          className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-300 hover:text-gray-600"
        >
          🗑️
        </button>
      </div>
      <Droppable droppableId={String(column.id)}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="min-h-[100px] flex-1"
          >
            {column.cards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                index={index}
                deleteCard={() => deleteCard(card.id, column.id)}
                updateCardText={updateCardText}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {isAddingCard ? (
        <div className="mt-3">
          <textarea
            className="w-full p-2 rounded border-gray-300 shadow-sm"
            placeholder="Introduce un título para esta tarjeta..."
            rows={3}
            value={newCardText}
            onChange={(e) => setNewCardText(e.target.value)}
            autoFocus
          />
          <div className="mt-2 flex items-center space-x-2">
            <button
              onClick={handleAddCard}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Añadir Tarjeta
            </button>
            <button
              onClick={() => setIsAddingCard(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingCard(true)}
          className="mt-3 w-full text-left p-2 text-gray-500 hover:bg-gray-200 rounded"
        >
          + Añadir otra tarjeta
        </button>
      )}
    </div>
  );
};

export default Column;