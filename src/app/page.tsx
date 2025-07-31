"use client";

import { useEffect, useState } from "react";
import Column from "@/components/Column";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { supabase } from '@/lib/supabaseClient';

export type CardType = { id: string; text: string };
export type ColumnType = { id: string; title: string; cards: CardType[] };

export default function Home() {

  const [boardData, setBoardData] = useState<ColumnType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoardData = async () => {
      setLoading(true);

      const { data: columns, error: columnsError } = await supabase
        .from('columns')
        .select('*')
        .order('position', { ascending: true });

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

    fetchBoardData();
  }, []);

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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <main className="bg-blue-500 h-screen p-4">
        <h1 className="text-white text-3xl font-bold mb-4">Mi Trello Clone</h1>
        <div className="flex space-x-4">
          {boardData.map(column => (
            <Column key={column.id} column={column} />
          ))}
        </div>
      </main>
    </DragDropContext>
  );
}
