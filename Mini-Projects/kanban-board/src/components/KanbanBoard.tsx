import { useState } from 'react';
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

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === 'Column';
    if (isActiveAColumn) return;
    
    // We handle the cross-column moves in DragOver for smoother sorting UX if needed,
    // but the reducer handles both same-column and cross-column moves in MOVE_CARD.
    // For a simple implementation, handling it in dragEnd is enough, but optimistic updates
    // during drag require more complex state. We'll dispatch MOVE_CARD on dragEnd.
  };

  const handleDragEnd = (event: DragEndEvent) => {
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
  };

  const [newTaskTitle, setNewTaskTitle] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input 
          type="text" 
          value={newTaskTitle} 
          onChange={e => setNewTaskTitle(e.target.value)}
          placeholder="New task title..."
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
            style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-color)',
              color: 'var(--text-main)',
              outline: 'none'
            }}
          />
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
          <KanbanColumn id="todo" title="To Do" cards={filteredColumns['todo']} />
          <KanbanColumn id="in-progress" title="In Progress" cards={filteredColumns['in-progress']} />
          <KanbanColumn id="done" title="Done" cards={filteredColumns['done']} />
        </div>
      </DndContext>
    </div>
  );
}
