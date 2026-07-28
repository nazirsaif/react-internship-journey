import { memo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from '@internal/ui-system';
import { KanbanCard } from './KanbanCard';
import type { CardItem, ColumnId } from '../types';

interface KanbanColumnProps {
  id: ColumnId;
  title: string;
  cards: CardItem[];
  onDeleteCard: (cardId: string, columnId: ColumnId) => void;
  onEditCard: (columnId: ColumnId, cardId: string, data: Partial<CardItem>) => void;
}

export const KanbanColumn = memo(function KanbanColumn({ id, title, cards, onDeleteCard, onEditCard }: KanbanColumnProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: cards.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

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
        ref={(node: HTMLDivElement | null) => {
          parentRef.current = node;
          setNodeRef(node);
        }}
        style={{ 
          flexGrow: 1, 
          height: '600px', // constrain height to allow scrolling
          overflowY: 'auto',
          padding: '0.5rem',
          position: 'relative'
        }}
      >
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          <div style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}>
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const card = cards[virtualItem.index];
              return (
                <div
                  key={card.id}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualItem.start}px)`,
                    paddingBottom: '0.5rem' // maintain spacing
                  }}
                >
                  <KanbanCard card={card} columnId={id} onDeleteCard={onDeleteCard} onEditCard={onEditCard} />
                </div>
              );
            })}
          </div>
          {cards.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.875rem' }}>
              No cards in this column
            </div>
          )}
        </SortableContext>
      </Card.Body>
    </Card>
  );
});
