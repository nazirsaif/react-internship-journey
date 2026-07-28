import { useState, useEffect, useCallback } from 'react';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  type DragEndEvent,
  type DragOverEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { useKanban } from '../KanbanContext';
import type { ColumnId, CardItem } from '../types';
import { Button, useDebounce } from '@internal/ui-system';

export function KanbanBoard() {
  const { state, dispatch } = useKanban();
  const columns = state.present.columns;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const [isLightMode, setIsLightMode] = useState(false);
  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isLightMode]);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredColumns = Object.entries(columns).reduce((acc, [columnId, cards]) => {
    if (!debouncedSearch) {
      acc[columnId as ColumnId] = cards;
    } else {
      acc[columnId as ColumnId] = cards.filter(card => 
        card.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || 
        (card.description && card.description.toLowerCase().includes(debouncedSearch.toLowerCase()))
      );
    }
    return acc;
  }, {} as Record<ColumnId, CardItem[]>);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === 'Column';
    if (isActiveAColumn) return;
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isOverAColumn = over.data.current?.type === 'Column';
    const overColumnId = isOverAColumn ? overId : over.data.current?.columnId;

    if (overColumnId) {
      dispatch({ 
        type: 'MOVE_CARD', 
        payload: { 
          activeId, 
          overId: isOverAColumn ? null : overId, 
          overColumnId: overColumnId as ColumnId 
        } 
      });
    }
  }, [dispatch]);

  const onDeleteCard = useCallback((cardId: string, columnId: ColumnId) => {
    dispatch({ type: 'DELETE_CARD', payload: { cardId, columnId } });
  }, [dispatch]);

  const onEditCard = useCallback((columnId: ColumnId, cardId: string, data: Partial<CardItem>) => {
    dispatch({ type: 'EDIT_CARD', payload: { columnId, cardId, data } });
  }, [dispatch]);

  const [newTaskTitle, setNewTaskTitle] = useState('');

  if (isLoading) {
    return (
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', height: '100%', minHeight: '600px', marginTop: '4rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ width: '300px', backgroundColor: 'var(--card-bg)', borderRadius: 'var(--radius-xl)', padding: '1rem', border: '1px solid var(--border-color)', opacity: 0.7 }}>
              <div style={{ height: '2rem', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }} />
              <div style={{ height: '80px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }} />
              <div style={{ height: '80px', backgroundColor: 'var(--border-color)', borderRadius: 'var(--radius-md)' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input 
          type="text" 
          value={newTaskTitle} 
          onChange={e => setNewTaskTitle(e.target.value)}
          placeholder="New task title..."
          aria-label="New task title"
          style={{ 
            padding: '0.75rem 1rem', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-color)',
            color: 'var(--text-main)',
            outline: 'none'
          }}
        />
        <Button onClick={() => {
          if (!newTaskTitle.trim()) return;
          dispatch({ 
            type: 'ADD_CARD', 
            payload: { 
              columnId: 'todo', 
              card: { id: Date.now().toString(), title: newTaskTitle } 
            } 
          });
          setNewTaskTitle('');
        }}>
          Add Task
        </Button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          <input 
            type="text" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search cards..."
            aria-label="Search cards"
            style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-color)',
              color: 'var(--text-main)',
              outline: 'none'
            }}
          />
          <Button variant="outline" onClick={() => setIsLightMode(prev => !prev)}>
            {isLightMode ? 'Dark Mode' : 'Light Mode'}
          </Button>
          <Button variant="outline" onClick={() => {
            const newCards = Array.from({ length: 1000 }).map((_, i) => ({
              id: `seeded-${Date.now()}-${i}`,
              title: `Seeded Task ${i + 1}`,
              description: 'This is a synthetic task for performance testing.',
            }));
            dispatch({ type: 'SEED_DATA', payload: { columns: { ...columns, 'todo': [...columns['todo'], ...newCards] } } });
          }}>
            Seed 1000 Cards
          </Button>
          <Button variant="outline" onClick={() => dispatch({ type: 'UNDO' })}>Undo (Ctrl+Z)</Button>
          <Button variant="outline" onClick={() => dispatch({ type: 'REDO' })}>Redo (Ctrl+Shift+Z)</Button>
        </div>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', gap: '1.5rem', height: '100%', minHeight: '600px' }}>
          <KanbanColumn id="todo" title="To Do" cards={filteredColumns['todo']} onDeleteCard={onDeleteCard} onEditCard={onEditCard} />
          <KanbanColumn id="in-progress" title="In Progress" cards={filteredColumns['in-progress']} onDeleteCard={onDeleteCard} onEditCard={onEditCard} />
          <KanbanColumn id="done" title="Done" cards={filteredColumns['done']} onDeleteCard={onDeleteCard} onEditCard={onEditCard} />
        </div>
      </DndContext>
    </div>
  );
}
