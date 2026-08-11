import { defineConfig, presetIcons, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    // Settings → Icons previews + any host chrome using i-{collection}-*
    presetIcons({
      cdn: 'https://esm.sh/',
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  shortcuts: {
    'fade-interactive': 'opacity-50 hover:opacity-80 focus-visible:opacity-80 transition-opacity',
    'bg-glass-surface': '[background:var(--v0-glass-surface)] backdrop-blur-12',
  },
  preflights: [
    {
      // Inline code chips — same recipe as apps/docs/uno.config.ts
      // (`renderInlineMarkdown` / API descriptions). Shiki is for fences +
      // signature chips (`shiki-inline`), not prose backticks.
      getCSS: () => `
        button:not(:disabled),
        [role="button"]:not(:disabled) {
          cursor: pointer;
        }

        *:focus-visible {
          outline: 2px solid var(--v0-primary);
          outline-offset: 2px;
        }

        :not(pre) > code {
          background: var(--v0-surface-tint);
          color: var(--v0-on-surface-variant);
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
    },
    borderColor: {
      DEFAULT: 'var(--v0-divider)',
    },
  },
})
