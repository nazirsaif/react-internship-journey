import { Navbar } from '@components/layout/Navbar';
import { Hero } from '@components/layout/Hero';
import { Footer } from '@components/layout/Footer';
import './index.css';

function App() {
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
