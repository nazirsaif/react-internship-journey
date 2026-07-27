import { KanbanProvider } from './KanbanContext';
import { KanbanBoard } from './components/KanbanBoard';

function App() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Kanban Board</h1>
      <KanbanProvider>
        <KanbanBoard />
      </KanbanProvider>
    </div>
  );
}

export default App;
