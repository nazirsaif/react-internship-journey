import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { KanbanColumn } from './KanbanColumn';
import type { ColumnId, CardItem } from '../types';
import { useBoardStore } from '../store/useBoardStore';
import { useDebounce } from '@internal/ui-system';
import { Button } from '@/components/ui/button';
import { apiClient } from '../api/client';

const API_URL = 'http://localhost:3001/cards';

export function KanbanBoard() {
  const queryClient = useQueryClient();
  
  // UI State from Zustand
  const { searchTerm, isLightMode } = useBoardStore(state => state.present);
  const setSearchTerm = useBoardStore(state => state.setSearchTerm);
  const setIsLightMode = useBoardStore(state => state.setIsLightMode);
  const undo = useBoardStore(state => state.undo);
  const redo = useBoardStore(state => state.redo);
  
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Fetch Cards
  const { data: cards = [], isLoading, isError, error } = useQuery<CardItem[]>({
    queryKey: ['cards'],
    queryFn: () => apiClient('/cards')
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: (newCard: CardItem) => apiClient('/cards', {
      method: 'POST',
      body: JSON.stringify(newCard)
    }),
    onMutate: async (newCard) => {
      await queryClient.cancelQueries({ queryKey: ['cards'] });
      const previousCards = queryClient.getQueryData<CardItem[]>(['cards']);
      queryClient.setQueryData<CardItem[]>(['cards'], old => [...(old || []), newCard]);
      return { previousCards };
    },
    onError: (err, newCard, context) => {
      queryClient.setQueryData(['cards'], context?.previousCards);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...updates }: Partial<CardItem> & { id: string }) => apiClient(`/cards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['cards'] });
      const previousCards = queryClient.getQueryData<CardItem[]>(['cards']);
      queryClient.setQueryData<CardItem[]>(['cards'], old => 
        (old || []).map(card => card.id === variables.id ? { ...card, ...variables } : card)
      );
      return { previousCards };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['cards'], context?.previousCards);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient(`/cards/${id}`, { 
      method: 'DELETE' 
    }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['cards'] });
      const previousCards = queryClient.getQueryData<CardItem[]>(['cards']);
      queryClient.setQueryData<CardItem[]>(['cards'], old => (old || []).filter(card => card.id !== id));
      return { previousCards };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['cards'], context?.previousCards);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    }
  });

  const filteredColumns = useMemo(() => {
    const cols: Record<ColumnId, CardItem[]> = {
      'todo': [],
      'in-progress': [],
      'done': []
    };
    
    cards.forEach(card => {
      if (!cols[card.columnId]) return;
      if (!debouncedSearch) {
        cols[card.columnId].push(card);
      } else {
        const lowerSearch = debouncedSearch.toLowerCase();
        if (
          card.title.toLowerCase().includes(lowerSearch) || 
          (card.description && card.description.toLowerCase().includes(lowerSearch))
        ) {
          cols[card.columnId].push(card);
        }
      }
    });
    
    return cols;
  }, [cards, debouncedSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isLightMode]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragOver = useCallback((event: DragOverEvent) => {
    // Left empty for Kanban board basic DnD as before
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
      updateMutation.mutate({ id: activeId, columnId: overColumnId as ColumnId });
    }
  }, [updateMutation]);

  const onDeleteCard = useCallback((cardId: string, _columnId: ColumnId) => {
    deleteMutation.mutate(cardId);
  }, [deleteMutation]);

  const onEditCard = useCallback((_columnId: ColumnId, cardId: string, data: Partial<CardItem>) => {
    updateMutation.mutate({ id: cardId, ...data });
  }, [updateMutation]);

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
          addMutation.mutate({ id: Date.now().toString(), title: newTaskTitle, columnId: 'todo' });
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
          <Button variant="outline" onClick={() => setIsLightMode(!isLightMode)}>
            {isLightMode ? 'Dark Mode' : 'Light Mode'}
          </Button>
          <Button variant="outline" onClick={() => undo()}>Undo (Ctrl+Z)</Button>
          <Button variant="outline" onClick={() => redo()}>Redo (Ctrl+Shift+Z)</Button>
        </div>
      </div>

      {(addMutation.isError || updateMutation.isError || deleteMutation.isError || isError) && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          An error occurred. Changes were reverted. {(error as Error)?.message || 'Failed mutation'}
        </div>
      )}

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
