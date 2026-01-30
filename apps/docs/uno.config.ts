import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
  ],
  // Wind4 uses color-mix with oklch - opacity modifiers (bg-surface/50)
  // don't work with CSS variables. Color-mix utilities are in tokens.css.
  shortcuts: {
    // Glass effects
    'bg-glass-surface': '[background:var(--v0-glass-surface)] backdrop-blur-12',
    'bg-glass-warning': '[background:color-mix(in_srgb,var(--v0-warning)_70%,transparent)] backdrop-blur-12',

    // Layout
    'max-w-900': '[max-width:900px]',
    'icon-text': 'inline-flex items-center gap-1',
    'center-x': 'left-1/2 -translate-x-1/2',

    // Cards
    'border-card': 'border border-divider rounded-lg',
    'card-interactive': 'border border-divider rounded-lg hover:border-primary hover:shadow-md transition-all cursor-pointer',
    'card-header': 'flex items-center justify-between gap-4 px-4 py-3 border-b border-divider bg-surface',

    // Badges
    'badge-base': 'inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded',

    // Buttons
    'btn-primary': 'px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity',
    'btn-secondary': 'px-4 py-2 bg-surface text-on-surface border rounded-lg font-semibold hover:bg-surface-tint transition-colors',
    'btn-ghost': 'px-4 py-2 bg-transparent hover:bg-surface-tint transition-colors cursor-pointer',
    'btn-icon': 'p-1.5 rounded-md hover:bg-surface border border-transparent hover:border-divider',
    'btn-action': 'inline-flex p-1.5 rounded-lg hover:bg-surface-variant focus-visible:bg-surface-variant transition-colors cursor-pointer',

    // Inputs
    'input-pill': 'rounded-full border border-divider flex items-center gap-1.5 px-1.5 py-1.5 hover:border-primary/50 focus-within:border-primary transition-colors',
    'input-base': 'px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface',

    // Typography
    'section-label': 'text-xs font-medium uppercase tracking-wide text-on-surface-variant',
    'label-medium': 'text-sm font-medium text-on-surface-variant',
    'text-muted': 'text-sm opacity-60',
    'heading-section': 'text-2xl md:text-3xl font-bold',

    // Interactive states
    'fade-interactive': 'opacity-50 hover:opacity-80 focus-visible:opacity-80 transition-opacity',
    'hover-reveal': 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity',
    'list-item': 'flex items-center gap-3 px-3 py-2 hover:bg-surface-tint transition-colors cursor-pointer',
    'list-item-bordered': 'border border-divider rounded-lg px-4 py-3 bg-surface hover:bg-surface-tint hover:border-primary transition-colors cursor-pointer',

    // Disabled
    'disabled-state': 'opacity-50 cursor-not-allowed',

  },
  safelist: ['max-w-900'],
  preflights: [
    {
      getCSS: () => `
        html {
          scrollbar-gutter: stable;
        }

        button:not(:disabled),
        [role="button"]:not(:disabled) {
          cursor: pointer;
        }

        *:focus-visible {
          outline: 2px solid var(--v0-primary);
          outline-offset: 2px;
        }

        dialog::backdrop {
          background: rgb(0 0 0 / 0.3);
        }

        :not(pre) > code {
          background: var(--v0-surface-tint);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `,
    },
  ],
  theme: {
    colors: {
      'primary': 'var(--v0-primary)',
      'secondary': 'var(--v0-secondary)',
      'accent': 'var(--v0-accent)',
      'error': 'var(--v0-error)',
      'info': 'var(--v0-info)',
      'success': 'var(--v0-success)',
      'warning': 'var(--v0-warning)',
      'background': 'var(--v0-background)',
      'surface': 'var(--v0-surface)',
      'surface-tint': 'var(--v0-surface-tint)',
      'surface-variant': 'var(--v0-surface-variant)',
      'divider': 'var(--v0-divider)',
      'pre': 'var(--v0-pre)',
      'on-primary': 'var(--v0-on-primary)',
      'on-secondary': 'var(--v0-on-secondary)',
      'on-accent': 'var(--v0-on-accent)',
      'on-error': 'var(--v0-on-error)',
      'on-info': 'var(--v0-on-info)',
      'on-success': 'var(--v0-on-success)',
      'on-warning': 'var(--v0-on-warning)',
      'on-background': 'var(--v0-on-background)',
      'on-surface': 'var(--v0-on-surface)',
      'on-surface-variant': 'var(--v0-on-surface-variant)',
      'discord': 'var(--v0-discord)',
      'vue': 'var(--v0-vue)',
      'mastered': 'var(--v0-mastered)',
      'github': 'var(--v0-github)',
      'tour': '#7C4DFF',
    },
    borderColor: {
      DEFAULT: 'var(--v0-divider)',
    },
  },
})
