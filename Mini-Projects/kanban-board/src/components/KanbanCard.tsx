import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Button } from '@internal/ui-system';
import type { CardItem } from '../types';
import { useKanban } from '../KanbanContext';

interface KanbanCardProps {
  card: CardItem;
  columnId: string;
}

export function KanbanCard({ card, columnId }: KanbanCardProps) {
  const { dispatch } = useKanban();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'Card',
      card,
      columnId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card hoverable padding="sm" style={{ marginBottom: '0.5rem', cursor: 'grab', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{card.title}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation(); // prevent drag start
              dispatch({ type: 'DELETE_CARD', payload: { cardId: card.id, columnId: columnId as any } });
            }}
          >
            X
          </Button>
        </div>
      </Card>
    </div>
  );
}
