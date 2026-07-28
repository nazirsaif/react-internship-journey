import { kanbanReducer } from '../KanbanContext';
import type { HistoryState } from '../types';

describe('kanbanReducer', () => {
  const getInitialState = (): HistoryState => ({
    past: [],
    present: {
      columns: {
        'todo': [],
        'in-progress': [],
        'done': []
      }
    },
    future: []
  });

  it('handles ADD_CARD', () => {
    const state = getInitialState();
    const action = {
      type: 'ADD_CARD' as const,
      payload: {
        columnId: 'todo' as const,
        card: { id: 'test1', title: 'Test Card' }
      }
    };

    const nextState = kanbanReducer(state, action);
    expect(nextState.present.columns['todo']).toHaveLength(1);
    expect(nextState.present.columns['todo'][0].title).toBe('Test Card');
    expect(nextState.past).toHaveLength(1);
    expect(nextState.past[0]).toEqual(state.present);
    expect(nextState.future).toHaveLength(0);
  });

  it('handles DELETE_CARD', () => {
    const state = getInitialState();
    state.present.columns['todo'] = [{ id: 'test1', title: 'Test Card' }];

    const action = {
      type: 'DELETE_CARD' as const,
      payload: {
        columnId: 'todo' as const,
        cardId: 'test1'
      }
    };

    const nextState = kanbanReducer(state, action);
    expect(nextState.present.columns['todo']).toHaveLength(0);
    expect(nextState.past).toHaveLength(1);
  });

  it('handles EDIT_CARD', () => {
    const state = getInitialState();
    state.present.columns['todo'] = [{ id: 'test1', title: 'Old Title' }];

    const action = {
      type: 'EDIT_CARD' as const,
      payload: {
        columnId: 'todo' as const,
        cardId: 'test1',
        data: { title: 'New Title', description: 'Desc' }
      }
    };

    const nextState = kanbanReducer(state, action);
    expect(nextState.present.columns['todo'][0].title).toBe('New Title');
    expect(nextState.present.columns['todo'][0].description).toBe('Desc');
  });

  it('handles MOVE_CARD within the same column', () => {
    const state = getInitialState();
    state.present.columns['todo'] = [
      { id: '1', title: 'Task 1' },
      { id: '2', title: 'Task 2' },
      { id: '3', title: 'Task 3' }
    ];

    const action = {
      type: 'MOVE_CARD' as const,
      payload: {
        activeId: '1',
        overId: '3',
        overColumnId: 'todo' as const
      }
    };

    const nextState = kanbanReducer(state, action);
    const todoCol = nextState.present.columns['todo'];
    expect(todoCol.map(c => c.id)).toEqual(['2', '3', '1']);
  });

  it('handles MOVE_CARD to a different column', () => {
    const state = getInitialState();
    state.present.columns['todo'] = [{ id: '1', title: 'Task 1' }];
    state.present.columns['in-progress'] = [{ id: '2', title: 'Task 2' }];

    const action = {
      type: 'MOVE_CARD' as const,
      payload: {
        activeId: '1',
        overId: '2',
        overColumnId: 'in-progress' as const
      }
    };

    const nextState = kanbanReducer(state, action);
    expect(nextState.present.columns['todo']).toHaveLength(0);
    expect(nextState.present.columns['in-progress'].map(c => c.id)).toEqual(['1', '2']);
  });

  it('handles UNDO and REDO', () => {
    const state1 = getInitialState();
    
    // Add card
    const state2 = kanbanReducer(state1, {
      type: 'ADD_CARD',
      payload: { columnId: 'todo', card: { id: 'c1', title: 'Card 1' } }
    });

    // Edit card
    const state3 = kanbanReducer(state2, {
      type: 'EDIT_CARD',
      payload: { columnId: 'todo', cardId: 'c1', data: { title: 'Card 1 Edited' } }
    });

    // Undo edit
    const stateAfterUndo = kanbanReducer(state3, { type: 'UNDO' });
    expect(stateAfterUndo.present.columns['todo'][0].title).toBe('Card 1');
    expect(stateAfterUndo.past).toHaveLength(1);
    expect(stateAfterUndo.future).toHaveLength(1);

    // Redo edit
    const stateAfterRedo = kanbanReducer(stateAfterUndo, { type: 'REDO' });
    expect(stateAfterRedo.present.columns['todo'][0].title).toBe('Card 1 Edited');
    expect(stateAfterRedo.past).toHaveLength(2);
    expect(stateAfterRedo.future).toHaveLength(0);
  });
});
