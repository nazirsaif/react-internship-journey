export type ColumnId = 'todo' | 'in-progress' | 'done';
export type CardId = string;

export const PREDEFINED_LABELS = [
  { id: 'bug', name: 'Bug', color: '#ef4444' },
  { id: 'feature', name: 'Feature', color: '#3b82f6' },
  { id: 'urgent', name: 'Urgent', color: '#f59e0b' },
  { id: 'design', name: 'Design', color: '#ec4899' },
];

export interface CardItem {
  id: CardId;
  title: string;
  description?: string;
  labels?: string[];
  dueDate?: string | null;
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
  | { type: 'SEED_DATA'; payload: { columns: Record<ColumnId, CardItem[]> } }
  | { type: 'DELETE_CARD'; payload: { cardId: CardId; columnId: ColumnId } }
  | { type: 'EDIT_CARD'; payload: { columnId: ColumnId; cardId: CardId; data: Partial<CardItem> } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'INIT_STATE'; payload: KanbanState };
