import React, { useState } from 'react';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { Card } from '@components/ui/Card';
import { Modal } from '@components/ui/Modal';

export const Playground: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Component Playground</h1>
        <Button variant="outline" onClick={() => window.location.pathname = '/'}>Back to Home</Button>
      </div>

      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>Buttons</h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Variants</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Sizes</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>States</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Button disabled>Disabled</Button>
            <Button isLoading>Loading</Button>
            <Button variant="danger" isLoading>Processing</Button>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>Badges</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
        </div>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>Compound Card</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          
          <Card hoverable padding="md">
            <Card.Header>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Basic Card</h3>
            </Card.Header>
            <Card.Body>
              <p style={{ color: 'var(--text-muted)' }}>This card uses the default medium padding.</p>
            </Card.Body>
            <Card.Footer>
              <Button size="sm">Action</Button>
            </Card.Footer>
          </Card>

          <Card hoverable padding="lg">
            <Card.Header>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Large Padding</h3>
            </Card.Header>
            <Card.Body>
              <p style={{ color: 'var(--text-muted)' }}>This card uses large padding and hover effects.</p>
            </Card.Body>
            <Card.Footer>
              <Button variant="outline" size="sm" style={{ marginRight: '0.5rem' }}>Cancel</Button>
              <Button size="sm">Submit</Button>
            </Card.Footer>
          </Card>

        </div>
      </section>

      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>Modal</h2>
        <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>

        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title="Delete Confirmation"
        >
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Are you sure you want to delete this item? This action cannot be undone and will permanently remove the data from our servers.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => setIsModalOpen(false)}>Delete Permanently</Button>
          </div>
        </Modal>
      </section>

    </div>
  );
};
