import React, { useState } from 'react';
import { Button, Card, Modal, useLocalStorage } from '@internal/ui-system';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Kanban Board</h1>
      <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
      
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <Card hoverable style={{ width: '300px' }}>
          <Card.Header>
            <h3 style={{ margin: 0 }}>To Do</h3>
          </Card.Header>
          <Card.Body>
            <p>Task 1</p>
          </Card.Body>
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Test Modal">
        <p>This is a modal from the UI system!</p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
