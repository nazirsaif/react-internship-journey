import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Button } from '@internal/ui-system';
import type { CardItem, ColumnId } from '../types';
import { PREDEFINED_LABELS } from '../types';
import { useKanban } from '../KanbanContext';
import { EditCardModal } from './EditCardModal';

interface KanbanCardProps {
  card: CardItem;
  columnId: ColumnId;
}

export function KanbanCard({ card, columnId }: KanbanCardProps) {
  const { dispatch } = useKanban();
  const [isEditOpen, setIsEditOpen] = useState(false);
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

  const isOverdue = card.dueDate 
    ? new Date(card.dueDate) < new Date(new Date().setHours(0,0,0,0)) 
    : false;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card hoverable padding="sm" style={{ marginBottom: '0.5rem', cursor: 'grab', backgroundColor: 'var(--bg-color)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{card.title}</span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <Button 
              variant="ghost" 
              size="sm"
              aria-label="Edit task"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setIsEditOpen(true);
              }}
            >
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              aria-label="Delete task"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation(); // prevent drag start
                dispatch({ type: 'DELETE_CARD', payload: { cardId: card.id, columnId: columnId as any } });
              }}
            >
              X
            </Button>
          </div>
        </div>
        {card.labels && card.labels.length > 0 && (
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {card.labels.map(labelId => {
              const labelDef = PREDEFINED_LABELS.find(l => l.id === labelId);
              if (!labelDef) return null;
              return (
                <span key={labelId} style={{ 
                  backgroundColor: labelDef.color, 
                  color: 'white', 
                  padding: '0.125rem 0.375rem', 
                  borderRadius: '0.25rem',
                  fontSize: '0.65rem',
                  fontWeight: 600
                }}>
                  {labelDef.name}
                </span>
              );
            })}
          </div>
        )}
        {card.dueDate && (
          <div style={{ 
            marginTop: '0.5rem', 
            fontSize: '0.75rem', 
            color: isOverdue ? '#ef4444' : 'var(--text-muted)',
            fontWeight: isOverdue ? 600 : 400
          }}>
            Due: {card.dueDate} {isOverdue && '(Overdue)'}
          </div>
        )}
      </Card>

      {isEditOpen && (
        <EditCardModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          card={card}
          onSave={(data) => dispatch({ type: 'EDIT_CARD', payload: { columnId: columnId as ColumnId, cardId: card.id, data } })}
        />
      )}
    </div>
  );
}
