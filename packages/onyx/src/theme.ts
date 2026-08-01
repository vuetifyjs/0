export type SemanticKey =
  | 'background' | 'foreground'
  | 'card' | 'card-foreground'
  | 'popover' | 'popover-foreground'
  | 'primary' | 'primary-foreground'
  | 'secondary' | 'secondary-foreground'
  | 'muted' | 'muted-foreground'
  | 'accent' | 'accent-foreground'
  | 'destructive' | 'destructive-foreground'
  | 'border' | 'input' | 'ring'
  | 'brand' | 'brand-foreground'
  | 'warning' | 'success' | 'info'

export type Semantic = Record<SemanticKey, string>

export const neutral = {
  50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8',
  400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46',
  800: '#27272a', 900: '#18181b', 950: '#09090b',
} as const

export const brand = { 400: '#d4d4d8', 500: '#3f3f46', 600: '#27272a' } as const
export const red = { 500: '#ef4444', 600: '#dc2626' } as const

export const light: Semantic = { 'background': '#ffffff', 'foreground': neutral[950], 'card': '#ffffff', 'card-foreground': neutral[950], 'popover': '#ffffff', 'popover-foreground': neutral[950], 'primary': neutral[900], 'primary-foreground': neutral[50], 'secondary': neutral[100], 'secondary-foreground': neutral[900], 'muted': neutral[100], 'muted-foreground': neutral[500], 'accent': neutral[100], 'accent-foreground': neutral[900], 'destructive': red[600], 'destructive-foreground': '#ffffff', 'border': neutral[200], 'input': neutral[200], 'ring': '#9ca3af', 'brand': brand[500], 'brand-foreground': '#ffffff', 'warning': '#f59e0b', 'success': '#16a34a', 'info': '#3b82f6' }

export const dark: Semantic = { 'background': neutral[950], 'foreground': neutral[50], 'card': neutral[900], 'card-foreground': neutral[50], 'popover': neutral[900], 'popover-foreground': neutral[50], 'primary': neutral[50], 'primary-foreground': neutral[900], 'secondary': neutral[800], 'secondary-foreground': neutral[50], 'muted': neutral[800], 'muted-foreground': neutral[400], 'accent': neutral[800], 'accent-foreground': neutral[50], 'destructive': red[500], 'destructive-foreground': '#ffffff', 'border': neutral[800], 'input': neutral[800], 'ring': neutral[500], 'brand': brand[400], 'brand-foreground': neutral[950], 'warning': '#fbbf24', 'success': '#22c55e', 'info': '#60a5fa' }

export const radius = { sm: '0.25rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem' } as const
export const spacing = { '3xs': '2px', '2xs': '4px', 'xs': '8px', 'sm': '12px', 'md': '16px', 'lg': '24px', 'xl': '32px', '2xl': '48px', '3xl': '64px' } as const
export const stroke = { s: '1px', m: '2px' } as const
export const shadow = { xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)', sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' } as const
export const fontFamily = { sans: 'ui-sans-serif, system-ui, sans-serif', mono: 'ui-monospace, SFMono-Regular, Menlo, monospace' } as const
export const fontSize = { 'xs': ['12px', { lineHeight: '16px' }], 'sm': ['13px', { lineHeight: '18px' }], 'base': ['14px', { lineHeight: '20px' }], 'md': ['16px', { lineHeight: '24px' }], 'lg': ['18px', { lineHeight: '28px' }], 'xl': ['20px', { lineHeight: '28px' }], '2xl': ['24px', { lineHeight: '32px' }], '3xl': ['30px', { lineHeight: '36px' }], '4xl': ['36px', { lineHeight: '40px' }] } as const
export const motion = { fast: '120ms', base: '200ms', easing: 'cubic-bezier(0.16, 1, 0.3, 1)' } as const
export const control = { sm: '32px', md: '36px', lg: '40px' } as const
