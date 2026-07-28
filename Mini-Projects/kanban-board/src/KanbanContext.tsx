import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { KanbanState, HistoryState, KanbanAction, ColumnId } from './types';
import { useLocalStorage } from '@internal/ui-system';

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

export function kanbanReducer(state: HistoryState, action: KanbanAction): HistoryState {
  const { past, present, future } = state;

  switch (action.type) {
    case 'UNDO': {
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
    }
    case 'REDO': {
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
    }
    case 'INIT_STATE': {
      return {
        past: [],
        present: action.payload,
        future: []
      };
    }
    case 'SEED_DATA': {
      const { columns } = action.payload;
      return {
        past: [...past, present],
        present: { ...present, columns },
        future: []
      };
    }
    case 'ADD_CARD': {
      const { columnId, card } = action.payload;
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
    }
    case 'DELETE_CARD': {
      const { columnId, cardId } = action.payload;
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
    }
    case 'EDIT_CARD': {
      const { columnId, cardId, data } = action.payload;
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
    }
    case 'MOVE_CARD': {
      const { activeId, overId, overColumnId } = action.payload;
      
      // Find source column and card
      let sourceColumnId: ColumnId | null = null;
      let activeCard = null;
      
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
        // Reordering in the same column
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
        // Moving to a different column
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
    }
    default:
      return state;
  }
}

interface KanbanContextValue {
  state: HistoryState;
  dispatch: React.Dispatch<KanbanAction>;
}

const KanbanContext = createContext<KanbanContextValue | undefined>(undefined);

export function KanbanProvider({ children }: { children: React.ReactNode }) {
  const [storedState, setStoredState] = useLocalStorage<KanbanState>('kanban-board-state', initialKanbanState);
  
  const [state, dispatch] = useReducer(kanbanReducer, {
    past: [],
    present: storedState, // Initialize with localStorage data
    future: []
  });

  // Persist the present state whenever it changes
  useEffect(() => {
    setStoredState(state.present);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.present]);

  // Global Keyboard listener for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          dispatch({ type: 'REDO' });
        } else {
          dispatch({ type: 'UNDO' });
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <KanbanContext.Provider value={{ state, dispatch }}>
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
}
