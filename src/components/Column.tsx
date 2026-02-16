"use client";

import { useState } from 'react';

import { Droppable } from '@hello-pangea/dnd';
import { Plus, Trash2, X } from 'lucide-react';

import { ColumnType } from '@/app/page';
import Card from './Card';

type ColumnProps = {
  column: ColumnType;
  addCard: (text: string, columnId: string) => void;
  deleteCard: (cardId: string, columnId: string) => void;
  deleteColumn: (columnId: string) => void;
  updateColumnTitle: (columnId: string, newTitle: string) => void;
  updateCardText: (cardId: string, newText: string) => void;
};

export default function Column({ column, addCard, deleteCard, deleteColumn, updateColumnTitle, updateCardText }: ColumnProps) {

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
          className="w-8 h-8 flex items-center justify-center rounded-lg text-foreground/40 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
          title="Eliminar lista"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <Droppable droppableId={String(column.id)}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex-grow min-h-[6rem] overflow-auto pr-2"
          >
            {column.cards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                index={index}
                deleteCard={() => deleteCard(String(card.id), column.id)}
                updateCardText={updateCardText}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="mt-4 flex-shrink-0">
        {isAddingCard ? (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            <textarea
              className="w-full p-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none text-sm shadow-sm"
              placeholder="Escribe un título para esta tarjeta..."
              rows={3}
              value={newCardText}
              onChange={(e) => setNewCardText(e.target.value)}
              autoFocus
            />
            <div className="mt-2 flex items-center gap-2">
              <button
                onClick={handleAddCard}
                className="px-4 py-1.5 bg-primary text-white text-sm font-bold rounded-lg hover:opacity-90 shadow-md shadow-primary/10 transition-all active:scale-95"
              >
                Añadir tarjeta
              </button>
              <button
                onClick={() => setIsAddingCard(false)}
                className="p-1.5 text-foreground/50 hover:bg-foreground/5 rounded-lg transition-colors"
                title="Cancelar"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="group mt-2 w-full flex items-center gap-2 p-2 text-foreground/50 hover:bg-foreground/5 rounded-xl transition-all duration-200"
          >
            <div className="p-1 bg-foreground/5 rounded-md group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Plus size={14} />
            </div>
            <span className="text-sm font-medium">Añadir otra tarjeta</span>
          </button>
        )}
      </div>
    </div>
  );
};