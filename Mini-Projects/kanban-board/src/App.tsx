import { Profiler, type ProfilerOnRenderCallback } from 'react';
import { KanbanProvider } from './KanbanContext';
import { KanbanBoard } from './components/KanbanBoard';

const onRenderCallback: ProfilerOnRenderCallback = (
  id, 
  phase, 
  actualDuration
) => {
  if (actualDuration > 5) {
    console.log(`[Profiler] ${id} - ${phase} took ${actualDuration.toFixed(2)}ms`);
  }
};

function App() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Kanban Board</h1>
      <Profiler id="KanbanApp" onRender={onRenderCallback}>
        <KanbanProvider>
          <KanbanBoard />
        </KanbanProvider>
      </Profiler>
    </div>
  );
}

export default App;
