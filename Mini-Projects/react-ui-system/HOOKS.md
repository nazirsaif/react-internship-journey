# React UI System Hooks Library

This project includes a set of fully typed, generic custom React hooks designed to be highly reusable and reliable.

## `useDebounce<T>`
Delays the update of a value by a specified number of milliseconds.

**Parameters:**
- `value: T` - The value to debounce.
- `delay: number` - The delay in milliseconds.

**Returns:**
- `T` - The debounced value.

**Example:**
```tsx
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);

// Use debouncedSearch in your API calls
```

---

## `useThrottle<T>`
Throttles the update of a value, ensuring it is only updated at most once every specified number of milliseconds.

**Parameters:**
- `value: T` - The value to throttle.
- `delay: number` - The throttle interval in milliseconds.

**Returns:**
- `T` - The throttled value.

**Example:**
```tsx
const throttledScrollY = useThrottle(scrollY, 200);
```

---

## `useLocalStorage<T>`
Syncs a state variable to `localStorage` so it persists across page reloads. Safely handles serialization and cross-tab synchronization.

**Parameters:**
- `key: string` - The `localStorage` key.
- `initialValue: T` - The fallback value if nothing is found in `localStorage`.

**Returns:**
- `[T, (value: T | ((val: T) => T)) => void]` - A stateful value and a function to update it, identical in signature to `useState`.

**Example:**
```tsx
const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
```

---

## `useFetch<T>`
A generic data fetching hook that supports `AbortController` for automatic request cancellation upon unmount or URL changes.

**Parameters:**
- `url: string` - The URL to fetch. If empty, the hook will not fetch.

**Returns:**
- `{ data: T | null, error: Error | null, isLoading: boolean }` - An object containing the fetch state.

**Example:**
```tsx
const { data, error, isLoading } = useFetch<User[]>('https://api.example.com/users');
```

---

## `useIntersectionObserver`
Detects when an element enters the viewport. Perfect for lazy loading images or infinite scrolling.

**Parameters:**
- `elementRef: RefObject<Element | null>` - The ref to the element you want to observe.
- `options: UseIntersectionObserverOptions` - `IntersectionObserver` config, plus a custom `freezeOnceVisible` boolean.

**Returns:**
- `IntersectionObserverEntry | undefined` - The observer entry containing intersection state.

**Example:**
```tsx
const ref = useRef<HTMLDivElement>(null);
const entry = useIntersectionObserver(ref, { freezeOnceVisible: true, threshold: 0.1 });
const isVisible = !!entry?.isIntersecting;
```
