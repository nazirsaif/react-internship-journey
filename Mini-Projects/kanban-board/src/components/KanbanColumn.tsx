import { memo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
      className="w-[300px] flex flex-col h-full transition-shadow transition-colors"
      style={{ 
        borderColor: isOver ? 'var(--primary-color)' : 'var(--border-color)',
        boxShadow: isOver ? '0 0 0 1px var(--primary-color)' : 'none'
      }}
    >
      <CardHeader className="py-3 px-4 border-b">
        <CardTitle className="text-lg m-0">{title}</CardTitle>
      </CardHeader>
      
      <CardContent 
        ref={(node: HTMLDivElement | null) => {
          parentRef.current = node;
          setNodeRef(node);
        }}
        className="flex-grow h-[600px] overflow-y-auto p-2 relative"
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
      </CardContent>
    </Card>
  );
});
