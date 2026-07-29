import { create } from 'zustand';
import type { KanbanState, HistoryState, CardItem, ColumnId, CardId } from '../types';

export const initialKanbanState: KanbanState = {
  columns: {
    'todo': [
      { id: '1', title: 'Task 1' },
      { id: '2', title: 'Task 2' }
    ],
    'in-progress': [],
    'done': []
  }
};

interface BoardStore extends HistoryState {
  addCard: (columnId: ColumnId, card: CardItem) => void;
  deleteCard: (columnId: ColumnId, cardId: CardId) => void;
  editCard: (columnId: ColumnId, cardId: CardId, data: Partial<CardItem>) => void;
  moveCard: (activeId: CardId, overId: CardId | null, overColumnId: ColumnId) => void;
  seedData: (columns: Record<ColumnId, CardItem[]>) => void;
  undo: () => void;
  redo: () => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  past: [],
  present: initialKanbanState,
  future: [],

  addCard: (columnId, card) => set((state) => {
    const { past, present } = state;
    const newPresent = {
      ...present,
      columns: {
        ...present.columns,
        [columnId]: [...present.columns[columnId], card]
      }
    };
    return {
      past: [...past, present],
      present: newPresent,
      future: []
    };
  }),

  deleteCard: (columnId, cardId) => set((state) => {
    const { past, present } = state;
    const newPresent = {
      ...present,
      columns: {
        ...present.columns,
        [columnId]: present.columns[columnId].filter(c => c.id !== cardId)
      }
    };
    return {
      past: [...past, present],
      present: newPresent,
      future: []
    };
  }),

  editCard: (columnId, cardId, data) => set((state) => {
    const { past, present } = state;
    const newPresent = {
      ...present,
      columns: {
        ...present.columns,
        [columnId]: present.columns[columnId].map(c => 
          c.id === cardId ? { ...c, ...data } : c
        )
      }
    };
    return {
      past: [...past, present],
      present: newPresent,
      future: []
    };
  }),

  moveCard: (activeId, overId, overColumnId) => set((state) => {
    const { past, present } = state;
    
    let sourceColumnId: ColumnId | null = null;
    let activeCard: CardItem | null = null;
    
    for (const [colId, cards] of Object.entries(present.columns)) {
      const card = cards.find(c => c.id === activeId);
      if (card) {
        sourceColumnId = colId as ColumnId;
        activeCard = card;
        break;
      }
    }

    if (!sourceColumnId || !activeCard) return state;

    const sourceCards = [...present.columns[sourceColumnId]];
    const activeIndex = sourceCards.findIndex(c => c.id === activeId);
    
    if (sourceColumnId === overColumnId) {
      const overIndex = sourceCards.findIndex(c => c.id === overId);
      sourceCards.splice(activeIndex, 1);
      sourceCards.splice(overIndex >= 0 ? overIndex : sourceCards.length, 0, activeCard);
      
      const newPresent = {
        ...present,
        columns: {
          ...present.columns,
          [sourceColumnId]: sourceCards
        }
      };
      
      return {
        past: [...past, present],
        present: newPresent,
        future: []
      };
    } else {
      const targetCards = [...present.columns[overColumnId]];
      sourceCards.splice(activeIndex, 1);
      
      const overIndex = overId ? targetCards.findIndex(c => c.id === overId) : targetCards.length;
      targetCards.splice(overIndex >= 0 ? overIndex : targetCards.length, 0, activeCard);
      
      const newPresent = {
        ...present,
        columns: {
          ...present.columns,
          [sourceColumnId]: sourceCards,
          [overColumnId]: targetCards
        }
      };
      
      return {
        past: [...past, present],
        present: newPresent,
        future: []
      };
    }
  }),

  seedData: (columns) => set((state) => {
    const { past, present } = state;
    return {
      past: [...past, present],
      present: { ...present, columns },
      future: []
    };
  }),

  undo: () => set((state) => {
    const { past, present, future } = state;
    if (past.length === 0) return state;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    return {
      past: newPast,
      present: previous,
      future: [present, ...future]
    };
  }),

  redo: () => set((state) => {
    const { past, present, future } = state;
    if (future.length === 0) return state;
    const next = future[0];
    const newFuture = future.slice(1);
    return {
      past: [...past, present],
      present: next,
      future: newFuture
    };
  }),
}));
