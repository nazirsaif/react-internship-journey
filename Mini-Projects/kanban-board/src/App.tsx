import { Profiler, type ProfilerOnRenderCallback, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { KanbanBoard } from './components/KanbanBoard';

const Playground = lazy(() => import('./pages/Playground'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));

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
          <Route path="/" element={<Navigate to="/board" replace />} />
          <Route path="/board" element={
            <Profiler id="KanbanApp" onRender={onRenderCallback}>
              <KanbanBoard />
            </Profiler>
          } />
          <Route path="/login" element={
            <Suspense fallback={<div>Loading...</div>}>
              <Login />
            </Suspense>
          } />
          <Route path="/signup" element={
            <Suspense fallback={<div>Loading...</div>}>
              <Signup />
            </Suspense>
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
