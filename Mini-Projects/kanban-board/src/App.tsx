import { Profiler, type ProfilerOnRenderCallback, Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { KanbanBoard } from './components/KanbanBoard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';

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
  const { setAccessToken, accessToken, setUser } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const response = await fetch('http://localhost:3001/auth/refresh', {
          method: 'POST',
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setAccessToken(data.accessToken);
          setUser({ email: 'restored-session' }); // Dummy user to satisfy store
        }
      } catch (err) {
        // Silently fail if refresh token is invalid/missing
      } finally {
        setIsInitializing(false);
      }
    }
    
    if (!accessToken) {
      restoreSession();
    } else {
      setIsInitializing(false);
    }
  }, [accessToken, setAccessToken, setUser]);

  if (isInitializing) {
    return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading session...</div>;
  }

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Kanban Board</h1>
        <nav style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/board" style={{ marginRight: '1rem' }}>Board</Link>
          <Link to="/playground">Playground</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/board" replace />} />
          <Route path="/board" element={
            <ProtectedRoute>
              <Profiler id="KanbanApp" onRender={onRenderCallback}>
                <KanbanBoard />
              </Profiler>
            </ProtectedRoute>
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
