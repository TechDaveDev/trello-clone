import { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { DropResult } from '@hello-pangea/dnd';

type CardType = { id: string; text: string; position: number; column_id: string; user_id: string; };
type ColumnType = { id: string; title: string; position: number; user_id: string; cards: CardType[]; };

export const useBoard = () => {
  const [boardData, setBoardData] = useState<ColumnType[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchBoardData = useCallback(async () => {
    if (!session) return;

    setLoading(true);

    const { data: columnsData, error: columnsError } = await supabase
      .from('columns')
      .select('*, cards(*)')
      .eq('user_id', session.user.id)
      .order('position');

    if (columnsError) {
      console.error('Error fetching data:', columnsError);
      setLoading(false);
      return;
    }

    const structuredData = columnsData.map(column => ({
      ...column,
      cards: column.cards.sort((a: CardType, b: CardType) => a.position - b.position),
    }));


    setBoardData(structuredData);
    setLoading(false);
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchBoardData();
    } else {
      setBoardData([]);
    }
  }, [session, fetchBoardData]);

  const addColumn = useCallback(async (title: string) => {
    if (!session) return;
    const { data: newColumn, error } = await supabase.from('columns').insert({ title, user_id: session.user.id, position: boardData.length }).select().single();
    if (error) { toast.error('Error al añadir la columna.'); }
    else if (newColumn) {
      setBoardData(prev => [...prev, { ...newColumn, cards: [] }]);
      toast.success('¡Columna añadida!');
    }
  }, [session, boardData.length]);

  const deleteColumn = useCallback(async (columnId: string) => {
    setBoardData(prev => prev.filter(col => col.id !== columnId));
    const { error } = await supabase.from('columns').delete().eq('id', columnId);
    if (error) { toast.error('Error al eliminar.'); } else { toast.success('¡Columna eliminada!'); }
  }, []);

  const updateColumnTitle = useCallback(async (columnId: string, newTitle: string) => {
    setBoardData(prev => prev.map(col => col.id === columnId ? { ...col, title: newTitle } : col));
    const { error } = await supabase.from('columns').update({ title: newTitle }).eq('id', columnId);
    if (error) { toast.error('Error al actualizar.'); } else { toast.success('¡Título actualizado!'); }
  }, []);

  const addCard = useCallback(async (text: string, columnId: string) => {
    if (!session) return;
    const targetColumn = boardData.find(col => col.id === columnId);
    if (!targetColumn) return;
    const { data: newCard, error } = await supabase.from('cards').insert({ text, column_id: columnId, position: targetColumn.cards.length, user_id: session.user.id }).select().single();
    if (error) { toast.error('Error al añadir.'); }
    else if (newCard) {
      setBoardData(prev => prev.map(col => col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col));
      toast.success('¡Tarjeta añadida!');
    }
  }, [session, boardData]);

  const deleteCard = useCallback(async (cardId: string, columnId: string) => {
    setBoardData(prev => prev.map(col => col.id === columnId ? { ...col, cards: col.cards.filter(c => String(c.id) !== cardId) } : col));
    const { error } = await supabase.from('cards').delete().eq('id', cardId);
    if (error) { toast.error('Error al eliminar.'); } else { toast.success('¡Tarjeta eliminada!'); }
  }, []);

  const updateCardText = useCallback(async (cardId: string, newText: string) => {
    setBoardData(prev => prev.map(col => ({ ...col, cards: col.cards.map(c => String(c.id) === cardId ? { ...c, text: newText } : c) })));
    const { error } = await supabase.from('cards').update({ text: newText }).eq('id', cardId);
    if (error) { toast.error('Error al actualizar.'); } else { toast.success('¡Tarjeta actualizada!'); }
  }, []);

  const onDragEnd = useCallback(async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newBoard = JSON.parse(JSON.stringify(boardData));
    const sourceCol = newBoard.find((col: ColumnType) => col.id === source.droppableId);
    const destCol = newBoard.find((col: ColumnType) => col.id === destination.droppableId);
    if (!sourceCol || !destCol) return;

    const [movedCard] = sourceCol.cards.splice(source.index, 1);
    destCol.cards.splice(destination.index, 0, movedCard);
    setBoardData(newBoard);

    const cardsToUpdate = newBoard.flatMap((col: ColumnType) => col.cards.map((card: CardType, index: number) => ({ id: card.id, position: index, column_id: col.id })));
    await supabase.from('cards').upsert(cardsToUpdate);
  }, [boardData]);

  return {
    boardData,
    loading,
    session,
    addColumn,
    deleteColumn,
    updateColumnTitle,
    addCard,
    deleteCard,
    updateCardText,
    onDragEnd
  };
};