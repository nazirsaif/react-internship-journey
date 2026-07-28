import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KanbanBoard } from '../components/KanbanBoard';
import { KanbanProvider } from '../KanbanContext';

describe('KanbanBoard Integration', () => {
  const renderBoard = () => {
    return render(
      <KanbanProvider>
        <KanbanBoard />
      </KanbanProvider>
    );
  };

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders default columns and handles card creation', async () => {
    const user = userEvent.setup();
    renderBoard();

    await waitFor(() => {
      expect(screen.queryByText('Add Task')).toBeInTheDocument();
    }, { timeout: 1000 });

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();

    const input = screen.getByPlaceholderText('New task title...');
    await user.type(input, 'My New Integration Task');
    const addButton = screen.getByText('Add Task');
    await user.click(addButton);

    expect(screen.getByText('My New Integration Task')).toBeInTheDocument();
  });

  it('can edit a card with labels and due date', async () => {
    const user = userEvent.setup();
    renderBoard();

    await waitFor(() => {
      expect(screen.queryByText('Add Task')).toBeInTheDocument();
    });

    const task1 = screen.getByText('Task 1');
    const task1Container = task1.parentElement?.parentElement;
    
    if (!task1Container) throw new Error('Task 1 container not found');

    const editBtn = within(task1Container as HTMLElement).getByLabelText('Edit task');
    await user.click(editBtn);

    const modalTitle = screen.getByDisplayValue('Task 1');
    expect(modalTitle).toBeInTheDocument();

    await user.clear(modalTitle);
    await user.type(modalTitle, 'Task 1 Updated');

    const descInput = screen.getByLabelText('Description');
    await user.type(descInput, 'A detailed description');

    const saveBtn = screen.getByText('Save Changes');
    await user.click(saveBtn);

    await waitFor(() => {
      expect(screen.queryByText('Task 1 Updated')).toBeInTheDocument();
    });
    expect(screen.getByText('A detailed description')).toBeInTheDocument();
  });

  it('filters cards when searching', async () => {
    const user = userEvent.setup();
    renderBoard();

    await waitFor(() => {
      expect(screen.queryByText('Add Task')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search cards...');
    await user.type(searchInput, 'Task 2');

    await waitFor(() => {
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    }, { timeout: 1000 });
  });
});
