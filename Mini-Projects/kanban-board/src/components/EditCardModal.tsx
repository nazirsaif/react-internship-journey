import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { CardItem } from '../types';
import { PREDEFINED_LABELS } from '../types';

const editCardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  labels: z.array(z.string()).optional(),
  dueDate: z.string().optional().nullable(),
});

type EditCardFormValues = z.infer<typeof editCardSchema>;

interface EditCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CardItem;
  onSave: (data: Partial<CardItem>) => void;
}

export function EditCardModal({ isOpen, onClose, card, onSave }: EditCardModalProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<EditCardFormValues>({
    resolver: zodResolver(editCardSchema),
    defaultValues: {
      title: card.title,
      description: card.description || '',
      labels: card.labels || [],
      dueDate: card.dueDate || '',
    }
  });

  const onSubmit = (data: EditCardFormValues) => {
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="title" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Title</label>
          <input
            id="title"
            {...register('title')}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-color)',
              color: 'var(--text-main)',
              outline: 'none'
            }}
          />
          {errors.title && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.title.message}</span>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="description" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Description</label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-color)',
              color: 'var(--text-main)',
              outline: 'none',
              resize: 'vertical'
            }}
          />
          {errors.description && <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>{errors.description.message}</span>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Labels</label>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {PREDEFINED_LABELS.map(label => (
              <label key={label.id} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  value={label.id}
                  {...register('labels')}
                />
                <span style={{ 
                  backgroundColor: label.color, 
                  color: 'white', 
                  padding: '0.125rem 0.375rem', 
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem'
                }}>
                  {label.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="dueDate" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Due Date</label>
          <input
            id="dueDate"
            type="date"
            {...register('dueDate')}
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-color)',
              color: 'var(--text-main)',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
      </DialogContent>
    </Dialog>
  );
}
