import { Profiler, type ProfilerOnRenderCallback, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { KanbanProvider } from './KanbanContext';
import { KanbanBoard } from './components/KanbanBoard';

const Playground = lazy(() => import('./pages/Playground'));

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
    <BrowserRouter>
      <div style={{ minHeight: '100vh', padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Kanban Board</h1>
        <nav style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Board</Link>
          <Link to="/playground">Playground</Link>
        </nav>
        <Routes>
          <Route path="/" element={
            <Profiler id="KanbanApp" onRender={onRenderCallback}>
              <KanbanProvider>
                <KanbanBoard />
              </KanbanProvider>
            </Profiler>
          } />
          <Route path="/playground" element={
            <Suspense fallback={<div>Loading Playground...</div>}>
              <Playground />
            </Suspense>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
