import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export default function About() {
  return (
    <>
      <Navbar />
      <main style={{ padding: '8rem 2rem', textAlign: 'center', minHeight: '80vh' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>About Us</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          We are a team of passionate engineers building the future of AI infrastructure.
          This page demonstrates Next.js App Router file-based routing without needing React Router.
        </p>
      </main>
      <Footer />
    </>
  );
}
