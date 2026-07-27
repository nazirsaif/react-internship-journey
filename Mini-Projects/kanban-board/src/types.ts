export type ColumnId = 'todo' | 'in-progress' | 'done';
export type CardId = string;

export interface CardItem {
  id: CardId;
  title: string;
}

export interface KanbanState {
  columns: Record<ColumnId, CardItem[]>;
}

export interface HistoryState {
  past: KanbanState[];
  present: KanbanState;
  future: KanbanState[];
}

export type KanbanAction =
  | { type: 'ADD_CARD'; payload: { columnId: ColumnId; card: CardItem } }
  | { type: 'MOVE_CARD'; payload: { activeId: CardId; overId: CardId | null; overColumnId: ColumnId } }
  | { type: 'DELETE_CARD'; payload: { cardId: CardId; columnId: ColumnId } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'INIT_STATE'; payload: KanbanState };
