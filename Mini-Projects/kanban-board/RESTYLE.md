# Restyle Decisions

This document details the UI migration experiment within the `kanban-board` project, replacing specific components from our custom `@internal/ui-system` with Tailwind CSS and `shadcn/ui`.

## What Was Replaced

We selectively replaced 3 core components with their `shadcn/ui` equivalents, while ensuring they continue to function identically.

1.  **`Card`**:
    *   **Previous**: Custom `Card` component from `@internal/ui-system`.
    *   **New**: `shadcn/ui` `Card`, utilizing `CardHeader`, `CardTitle`, and `CardContent` sub-components for a structured layout. Replaced instances in `KanbanCard.tsx`, `KanbanColumn.tsx`, `Login.tsx`, and `Signup.tsx`.
2.  **`Button`**:
    *   **Previous**: Custom `Button` component.
    *   **New**: `shadcn/ui` `Button` component. Replaced across the application, leveraging built-in variants like `variant="outline"`.
3.  **`Modal`**:
    *   **Previous**: Custom `Modal` component.
    *   **New**: `shadcn/ui` `Dialog` primitives (`Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`). Replaced the `EditCardModal.tsx` wrapper to utilize the headless Dialog logic.

## What Was Kept

We deliberately retained parts of the custom `@internal/ui-system` to demonstrate the interoperability of our internal library alongside a utility-first framework like Tailwind CSS.

*   **`Input`**: The core form inputs remain tied to the internal UI system.
*   **`FormField`**: The form wrapper (with label and error handling logic) continues to use `@internal/ui-system`.
*   **Custom hooks**: Utilities like `useDebounce` from our UI system remain in use (`KanbanBoard.tsx`).
*   **Themed CSS variables**: The original custom CSS logic in `style.css` was kept intact, with shadcn's base variables injected to run in parallel.

## Trade-offs: Custom Design System vs. shadcn/ui

### Custom Design System (`@internal/ui-system`)

**Pros:**
*   **Total Control**: Every pixel and behavior is owned internally. Strict adherence to exact design constraints is easier to enforce.
*   **Encapsulation**: Styles are tightly coupled to the components. Upgrading a component updates it for all consumers instantly across all apps (e.g. `chat-app` and `kanban-board`).
*   **Zero Dependencies**: No reliance on third-party frameworks like Tailwind or Radix primitives if built from scratch.

**Cons:**
*   **High Maintenance**: Building robust components (like an accessible Modal or Select) requires significant effort.
*   **Inflexibility**: Making a one-off UI tweak in a consuming app often requires updating the core package or writing messy overrides.

### shadcn/ui (+ Tailwind CSS)

**Pros:**
*   **Accessibility Out-of-the-Box**: Built on Radix primitives, the components are fully accessible (keyboard navigation, ARIA attributes) by default.
*   **Maximum Flexibility**: Since components are copied directly into the project (not an npm dependency), developers can radically alter their structure and behavior without fear of breaking other projects.
*   **Speed of Iteration**: Tailwind CSS allows for rapid prototyping and styling directly in the markup.

**Cons:**
*   **Code Duplication**: If you have 5 apps, you might end up with 5 slightly different versions of a `Button` component in your repositories.
*   **Steeper Learning Curve**: Requires knowledge of Tailwind classes, which can clutter the JSX.
*   **Global Configuration**: Tailwind configuration needs to be maintained per-project, making cross-project consistency harder to enforce automatically compared to a single shared UI library.

### Conclusion

For internal enterprise applications where strict visual consistency is paramount, a custom design system like `@internal/ui-system` is excellent. However, for fast-moving startups or projects where flexibility and speed are prioritized, `shadcn/ui` offers a superior developer experience by providing sensible defaults while allowing complete ownership of the component code. Using a hybrid approach—keeping complex logic in the core UI system while using shadcn for layout primitives—is a viable path for incremental adoption.
