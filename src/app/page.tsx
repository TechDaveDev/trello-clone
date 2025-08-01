"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Column from "@/components/Column";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export type CardType = { id: string; text: string };
export type ColumnType = { id: string; title: string; cards: CardType[] };

export default function Home() {

  const [boardData, setBoardData] = useState<ColumnType[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const [newColumnTitle, setNewColumnTitle] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchBoardData();
    } else {
      setLoading(false);
    }
  }, [session]);

  const fetchBoardData = async () => {
    setLoading(true);

    if (!session) return;
    setLoading(true);

    const { data: columns, error: columnsError } = await supabase
      .from('columns')
      .select('*')
      .eq('user_id', session.user.id)
      .order('position');

    if (columnsError) {
      console.error('Error fetching columns:', columnsError);
      return;
    }

    const { data: cards, error: cardsError } = await supabase
      .from('cards')
      .select('*');

    if (cardsError) {
      console.error('Error fetching cards:', cardsError);
      return;
    }

    const structuredData = columns.map(column => ({
      ...column,
      cards: cards
        .filter(card => card.column_id === column.id)
        .sort((a, b) => a.position - b.position),
    }));

    setBoardData(structuredData);
    setLoading(false);
  };

  const addCard = async (text: string, columnId: string) => {
    if (!session) return;

    const targetColumn = boardData.find(col => col.id === columnId);
    if (!targetColumn) return;

    const newPosition = targetColumn.cards.length;

    const { data: newCard, error } = await supabase
      .from('cards')
      .insert({
        text: text,
        column_id: columnId,
        position: newPosition,
        user_id: session.user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error al añadir la tarjeta:', error);
      return;
    }

    if (newCard) {
      const newBoard = boardData.map(column => {
        if (column.id === columnId) {
          return { ...column, cards: [...column.cards, newCard] };
        }
        return column;
      });
      setBoardData(newBoard);
    }
  };

  const updateCardText = async (cardId: string, newText: string) => {
    setBoardData(prevBoard =>
      prevBoard.map(col => ({
        ...col,
        cards: col.cards.map(card =>
          String(card.id) === cardId ? { ...card, text: newText } : card
        ),
      }))
    );

    const { error } = await supabase
      .from('cards')
      .update({ text: newText })
      .eq('id', cardId);

    if (error) {
      console.error('Error al actualizar la tarjeta:', error);
    }
  };

  const deleteCard = async (cardId: string, columnId: string) => {
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', cardId);

    if (error) {
      console.error('Error al eliminar la tarjeta:', error);
      return;
    }

    const newBoard = boardData.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          cards: column.cards.filter(card => card.id !== cardId),
        };
      }
      return column;
    });
    setBoardData(newBoard);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const newBoardData: ColumnType[] = JSON.parse(JSON.stringify(boardData));

    const sourceColumn = newBoardData.find(
      (col: ColumnType) => col.id === source.droppableId
    );
    const destColumn = newBoardData.find(
      (col: ColumnType) => col.id === destination.droppableId
    );

    if (!sourceColumn || !destColumn) {
      return;
    }

    const [movedCard] = sourceColumn.cards.splice(source.index, 1);

    if (source.droppableId !== destination.droppableId) {
      destColumn.cards.splice(destination.index, 0, movedCard);
    } else {
      sourceColumn.cards.splice(destination.index, 0, movedCard);
    }

    setBoardData(newBoardData);

    const updateDatabase = async () => {
      const cardsToUpdate = newBoardData.flatMap((column, colIndex) =>
        column.cards.map((card, cardIndex) => ({
          ...card,
          position: cardIndex,
          column_id: column.id,
        }))
      );

      const { error } = await supabase.from('cards').upsert(cardsToUpdate);

      if (error) {
        console.error('Error updating cards:', error);
      }
    };

    updateDatabase();
  };

  const addColumn = async () => {
    if (newColumnTitle.trim() === '' || !session) return;

    const { data: newColumn, error } = await supabase
      .from('columns')
      .insert({
        title: newColumnTitle,
        user_id: session.user.id,
        position: boardData.length,
      })
      .select()
      .single();

    if (error) {
      console.error('Error al añadir la columna:', error);
      return;
    }

    if (newColumn) {
      setBoardData([...boardData, { ...newColumn, cards: [] }]);
      setNewColumnTitle('');
    }
  };

  const deleteColumn = async (columnId: string) => {
    setBoardData(prevBoard => prevBoard.filter(col => col.id !== columnId));

    const { error } = await supabase
      .from('columns')
      .delete()
      .eq('id', columnId);

    if (error) {
      console.error('Error al eliminar la columna:', error);
    }
  };

  const updateColumnTitle = async (columnId: string, newTitle: string) => {
    setBoardData(prevBoard =>
      prevBoard.map(col =>
        col.id === columnId ? { ...col, title: newTitle } : col
      )
    );

    const { error } = await supabase
      .from('columns')
      .update({ title: newTitle })
      .eq('id', columnId);

    if (error) {
      console.error('Error al actualizar el título:', error);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main className="bg-blue-500 h-screen p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Mi Trello Clone</h1>
          <ThemeSwitcher />
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4 items-start space-y-4 md:space-y-0">
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
          <div className="bg-gray-200 p-3 rounded-lg w-72 flex-shrink-0">
            <input
              type="text"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              placeholder="Título de la nueva columna..."
              className="w-full p-2 shadow-sm bg-background border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={addColumn}
              className="mt-2 w-full px-4 py-2 bg-primary text-white rounded hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Añadir Columna
            </button>
          </div>
        </div>
      </main>
    </DragDropContext>
  );
}
