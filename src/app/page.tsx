"use client";

import Column from "@/components/Column";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useState } from "react";

export type CardType = { id: string; text: string };
export type ColumnType = { id: string; title: string; cards: CardType[] };

const initialData: ColumnType[] = [
  { id: 'col-1', title: '📝 Por Hacer', cards: [{ id: 'card-1', text: 'Configurar el proyecto' }, { id: 'card-2', text: 'Crear componentes estáticos' }] },
  { id: 'col-2', title: '🚀 En Progreso', cards: [{ id: 'card-3', text: 'Conectar con Supabase' }] },
  { id: 'col-3', title: '✅ Hecho', cards: [{ id: 'card-4', text: '¡Implementar Drag and Drop!' }] },
];

export default function Home() {

  const [boardData, setBoardData] = useState(initialData);

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

    const newBoardData = JSON.parse(JSON.stringify(boardData));

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
