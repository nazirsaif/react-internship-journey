import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UIState {
  searchTerm: string;
  activeLabelFilter: string | null;
  isLightMode: boolean;
}

export interface HistoryState {
  past: UIState[];
  present: UIState;
  future: UIState[];
}

export const initialUIState: UIState = {
  searchTerm: '',
  activeLabelFilter: null,
  isLightMode: false,
};

interface BoardStore extends HistoryState {
  setSearchTerm: (term: string) => void;
  setActiveLabelFilter: (labelId: string | null) => void;
  setIsLightMode: (isLight: boolean) => void;
  undo: () => void;
  redo: () => void;
}

export const useBoardStore = create<BoardStore>()(
  persist(
    (set) => ({
      past: [],
      present: initialUIState,
      future: [],

      setSearchTerm: (term) => set((state) => {
        const { past, present } = state;
        if (present.searchTerm === term) return state;
        return {
          past: [...past, present],
          present: { ...present, searchTerm: term },
          future: []
        };
      }),

      setActiveLabelFilter: (labelId) => set((state) => {
        const { past, present } = state;
        if (present.activeLabelFilter === labelId) return state;
        return {
          past: [...past, present],
          present: { ...present, activeLabelFilter: labelId },
          future: []
        };
      }),

      setIsLightMode: (isLight) => set((state) => {
        const { past, present } = state;
        if (present.isLightMode === isLight) return state;
        return {
          past: [...past, present],
          present: { ...present, isLightMode: isLight },
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
    }),
    {
      name: 'kanban-ui-state',
      partialize: (state) => state.present as any,
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        present: { ...currentState.present, ...persistedState },
      }),
    }
  )
);
