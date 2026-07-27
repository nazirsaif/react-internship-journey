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
        borderColor: isOver ? 'var(--primary-color)' : 'var(--border-color)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: isOver ? '0 0 0 1px var(--primary-color)' : 'none'
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
          padding: '0.5rem'
        }}
      >
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map(card => (
            <KanbanCard key={card.id} card={card} columnId={id} />
          ))}
          {cards.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.875rem' }}>
              No cards in this column
            </div>
          )}
        </SortableContext>
      </Card.Body>
    </Card>
  );
}
