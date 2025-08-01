"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';

import { DragDropContext } from "@hello-pangea/dnd";

import { useBoard } from "@/lib/useBoard";
import Column from "@/components/Column";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export type CardType = { id: string; text: string };
export type ColumnType = { id: string; title: string; cards: CardType[] };

export default function Home() {

  const router = useRouter();
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const {
    boardData,
    session,
    addColumn,
    deleteColumn,
    updateColumnTitle,
    addCard,
    deleteCard,
    updateCardText,
    onDragEnd,
  } = useBoard();

  const handleAddColumn = () => {
    if (newColumnTitle.trim() === '') return;
    addColumn(newColumnTitle);
    setNewColumnTitle('');
  };

  if (session === undefined) {
    return (
      <div className="bg-background h-screen flex items-center justify-center">
        <p className="text-foreground text-xl">Cargando...</p>
      </div>
    );
  }

  if (session === null) {
    router.push('/login');
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main className="bg-background text-foreground min-h-screen p-4 md:p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Mi Trello Clone</h1>
          <div className="flex items-center space-x-4">
            <p className="hidden md:block text-sm text-foreground/70">{session?.user?.email}</p>
            <ThemeSwitcher />
          </div>
        </header>

        <div className="flex flex-col md:flex-row md:space-x-4 items-start space-y-4 md:space-y-0 w-full overflow-x-auto pb-4">
          {boardData.map(column => (
            <Column
              key={column.id}
              column={column}
              addCard={addCard}
              deleteCard={deleteCard}
              deleteColumn={deleteColumn}
              updateColumnTitle={updateColumnTitle}
              updateCardText={updateCardText}
            />
          ))}

          <div className="bg-card text-foreground p-3 rounded-lg w-full md:w-80 flex-shrink-0">
            <input
              type="text"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddColumn(); }}
              placeholder="Título de la nueva columna..."
              className="w-full p-2 bg-background border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={handleAddColumn}
              className="mt-2 w-full px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 transition-opacity"
            >
              Añadir Columna
            </button>
          </div>
        </div>
      </main>
    </DragDropContext>
  );
}
