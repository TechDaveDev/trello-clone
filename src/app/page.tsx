"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

import { DragDropContext } from "@hello-pangea/dnd";
import { supabase } from "@/lib/supabaseClient";

import { useBoard } from "@/lib/useBoard";
import { useAuth } from "@/context/AuthContext";
import Column from "@/components/Column";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export type CardType = { id: string; text: string };
export type ColumnType = { id: string; title: string; cards: CardType[] };

export default function Home() {

  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const {
    boardData,
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

  useEffect(() => {
    if (!authLoading && !session) {
      router.push('/login');
    }
  }, [session, authLoading, router]);

  if (authLoading || !session) {
    return (
      <div className="bg-background h-screen flex items-center justify-center">
        <p className="text-foreground text-xl">Cargando...</p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main className="bg-background text-foreground min-h-screen p-4 md:p-6 transition-colors">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Trello Clone</h1>
          <div className="flex items-center space-x-4">
            <p className="hidden md:block text-sm text-foreground/70">{session.user.email}</p>
            <ThemeSwitcher />
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="p-2 text-foreground/70 hover:bg-card rounded-md transition-colors"
            title="Cerrar sesión"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </header>
        <div className="flex flex-wrap justify-center gap-6">
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

          <div className="bg-card text-foreground p-3 rounded-lg w-full md:w-80">
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
