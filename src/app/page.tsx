"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

import { supabase } from "@/lib/supabaseClient";
import { DragDropContext } from "@hello-pangea/dnd";
import { Plus, X } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useBoard } from "@/lib/useBoard";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import AboutContent from "@/components/AboutContent";
import LogoutContent from "@/components/LogoutContent";
import Column from "@/components/Column";

export type CardType = { id: string; text: string };
export type ColumnType = { id: string; title: string; cards: CardType[] };

export default function Home() {

  const router = useRouter();
  const { session, loading: authLoading } = useAuth();
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

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
    setIsAdding(false);
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

  const handleAboutOpen = () => setIsAboutOpen(true);
  const handleLogoutConfirm = () => setIsLogoutOpen(true);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main className="bg-background text-foreground min-h-screen p-4 md:p-6 transition-colors">
        <Header
          onAboutClick={handleAboutOpen}
          onLogoutConfirm={handleLogoutConfirm}
        />

        <div className="flex flex-wrap justify-center gap-6 mt-4">
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

          <div className={`h-fit w-full md:w-80 rounded-2xl transition-all duration-300 ${newColumnTitle ? 'bg-card shadow-lg border-primary/20' : 'bg-card/40 border-2 border-dashed border-border hover:border-primary/50 hover:bg-card/60'
            }`}>
            <div className="p-4">
              {!newColumnTitle && !isAdding ? (
                <button
                  onClick={() => setIsAdding(true)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-foreground/50 hover:text-primary transition-colors font-medium"
                >
                  <Plus size={20} />
                  <span>Añadir otra lista</span>
                </button>
              ) : (
                <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <input
                    type="text"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddColumn();
                      if (e.key === 'Escape') setIsAdding(false);
                    }}
                    placeholder="Introduce el título de la lista..."
                    className="w-full p-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm shadow-sm"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddColumn}
                      className="flex-1 py-2 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
                    >
                      Añadir lista
                    </button>
                    <button
                      onClick={() => {
                        setIsAdding(false);
                        setNewColumnTitle('');
                      }}
                      className="p-2 text-foreground/50 hover:bg-foreground/5 rounded-xl transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      <Modal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        title="Confirmar logout"
      >
        <LogoutContent
          onConfirm={() => {
            setIsLogoutOpen(false);
            supabase.auth.signOut();
          }}
          onCancel={() => setIsLogoutOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        title="Información del proyecto"
      >
        <AboutContent />
      </Modal>
    </DragDropContext>
  );
}
