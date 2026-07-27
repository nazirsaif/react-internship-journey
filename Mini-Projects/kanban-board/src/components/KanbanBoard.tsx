import React, { useState } from 'react';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
  DragOverEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { useKanban } from '../KanbanContext';
import { ColumnId } from '../types';
import { Button } from '@internal/ui-system';

export function KanbanBoard() {
  const { state, dispatch } = useKanban();
  const columns = state.present.columns;

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

    const isOverAColumn = over.data.current?.type === 'Column';
    
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
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
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
          <KanbanColumn id="todo" title="To Do" cards={columns['todo']} />
          <KanbanColumn id="in-progress" title="In Progress" cards={columns['in-progress']} />
          <KanbanColumn id="done" title="Done" cards={columns['done']} />
        </div>
      </DndContext>
    </div>
  );
}
