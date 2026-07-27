import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from '@internal/ui-system';
import { KanbanCard } from './KanbanCard';
import type { CardItem, ColumnId } from '../types';

interface KanbanColumnProps {
  id: ColumnId;
  title: string;
  cards: CardItem[];
}

export function KanbanColumn({ id, title, cards }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      type: 'Column',
      columnId: id,
    },
  });

  return (
    <Card 
      style={{ 
        width: '300px', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        backgroundColor: isOver ? '#f0f0f0' : 'white',
        transition: 'background-color 0.2s'
      }}
    >
      <Card.Header>
        <h3 style={{ margin: 0 }}>{title}</h3>
      </Card.Header>
      
      <Card.Body 
        ref={setNodeRef}
        style={{ 
          flexGrow: 1, 
          minHeight: '200px',
          padding: '0.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px'
        }}
      >
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map(card => (
            <KanbanCard key={card.id} card={card} columnId={id} />
          ))}
        </SortableContext>
      </Card.Body>
    </Card>
  );
}
