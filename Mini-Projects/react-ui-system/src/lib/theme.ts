export const theme = {
  colors: {
    primary: 'var(--primary-color)',
    primaryHover: 'var(--primary-hover)',
    background: 'var(--bg-color)',
    textMain: 'var(--text-main)',
    textMuted: 'var(--text-muted)',
    border: 'var(--border-color)',
    cardBg: 'var(--card-bg)',
  },
  spacing: {
    1: 'var(--spacing-1)',
    2: 'var(--spacing-2)',
    3: 'var(--spacing-3)',
    4: 'var(--spacing-4)',
    5: 'var(--spacing-5)',
    6: 'var(--spacing-6)',
    8: 'var(--spacing-8)',
  },
  radii: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
  },
  typography: {
    fontFamily: 'var(--font-family)',
  },
} as const;

export type Theme = typeof theme;
