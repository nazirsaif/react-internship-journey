# Component Design System

This document outlines the API and usage for the core UI components in the `react-ui-system` project.

---

## Button

A flexible button component with multiple variants, sizes, and states. Uses `class-variance-authority` (cva) internally.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | The visual style of the button. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | The size and padding of the button. |
| `isLoading` | `boolean` | `false` | Shows a spinner and disables the button. |
| `disabled` | `boolean` | `false` | Standard HTML disabled state. |

### Usage

```tsx
import { Button } from '@components/ui/Button';

// Standard Usage
<Button variant="primary" size="lg">Submit</Button>

// Loading State
<Button variant="danger" isLoading>Processing...</Button>
```

---

## Badge

A small visual indicator for status or categorization.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'neutral' \| 'success' \| 'warning' \| 'error'` | `'neutral'` | The semantic color of the badge. |

### Usage

```tsx
import { Badge } from '@components/ui/Badge';

<Badge variant="success">Completed</Badge>
<Badge variant="error">Failed</Badge>
```

---

## Card (Compound Component)

A flexible container built using the compound component pattern and React Context for shared state.

### Components

- `<Card>`: The main wrapper. Accepts `padding` and `hoverable` props.
- `<Card.Header>`: Container for titles and top actions.
- `<Card.Body>`: Main content area. Flex-grows to fill available space.
- `<Card.Footer>`: Bottom container for buttons or trailing actions.

### Props (Card)

| Prop | Type | Default | Description |
|---|---|---|---|
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | The internal padding shared across the card. |
| `hoverable` | `boolean` | `false` | Enables a lift and shadow effect on hover. |

### Usage

```tsx
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';

<Card hoverable padding="lg">
  <Card.Header>
    <h3>Project Details</h3>
  </Card.Header>
  <Card.Body>
    <p>Main content goes here.</p>
  </Card.Body>
  <Card.Footer>
    <Button>Save Changes</Button>
  </Card.Footer>
</Card>
```

---

## Modal

A fully accessible modal dialog rendered via a React portal. Features a focus trap, Escape key closing, and background click detection.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | (Required) | Controls the visibility of the modal. |
| `onClose` | `() => void` | (Required) | Callback fired when user attempts to close the modal. |
| `title` | `React.ReactNode` | `undefined` | Optional title rendered at the top of the modal. |
| `children`| `React.ReactNode` | (Required) | Modal content. |

### Usage

```tsx
import { useState } from 'react';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';

export function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm Action">
        <p>Are you sure you want to proceed?</p>
        <Button onClick={() => setIsOpen(false)}>Close</Button>
      </Modal>
    </>
  );
}
```
