import { useState, useEffect } from 'react';
import { Navbar } from '@components/layout/Navbar';
import { Hero } from '@components/layout/Hero';
import { Footer } from '@components/layout/Footer';
import { Playground } from './pages/Playground';
import './index.css';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  if (currentPath === '/playground') {
    return (
      <>
        <Playground />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  );
}

export default App;
