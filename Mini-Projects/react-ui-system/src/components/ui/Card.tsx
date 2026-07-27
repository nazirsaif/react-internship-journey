import React, { createContext, useContext, forwardRef } from 'react';
import { cn } from '@lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva('card', {
  variants: {
    padding: {
      none: '',
      sm: 'card-pad-sm',
      md: 'card-pad-md',
      lg: 'card-pad-lg',
    },
    hoverable: {
      true: 'card-hoverable',
    },
  },
  defaultVariants: {
    padding: 'md',
    hoverable: false,
  },
});

interface CardContextValue {
  padding: 'none' | 'sm' | 'md' | 'lg';
}

const CardContext = createContext<CardContextValue | undefined>(undefined);

function useCardContext() {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('Card components must be rendered within a Card');
  }
  return context;
}

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const CardComponent = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'md', hoverable, children, ...props }, ref) => {
    return (
      <CardContext.Provider value={{ padding: padding ?? 'md' }}>
        <div
          ref={ref}
          className={cn(cardVariants({ padding, hoverable, className }))}
          {...props}
        >
          {children}
        </div>
      </CardContext.Provider>
    );
  }
);
CardComponent.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    useCardContext(); // Ensure it's used inside Card
    return <div ref={ref} className={cn('card-header', className)} {...props} />;
  }
);
CardHeader.displayName = 'Card.Header';

const CardBody = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    useCardContext();
    return <div ref={ref} className={cn('card-body', className)} {...props} />;
  }
);
CardBody.displayName = 'Card.Body';

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    useCardContext();
    return <div ref={ref} className={cn('card-footer', className)} {...props} />;
  }
);
CardFooter.displayName = 'Card.Footer';

export const Card = Object.assign(CardComponent, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});
