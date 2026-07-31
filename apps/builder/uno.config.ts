import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [presetWind4()],

  // The builder's design language lives here rather than in a stylesheet: every entry
  // compiles to the same utilities the templates could write by hand, so the app keeps
  // its utility-only rule while 15 independently-authored config screens share one
  // type scale, one radius scale, and one set of field metrics.
  shortcuts: {
    // Type scale. Prose is set in the UI sans; anything that names a code identifier,
    // counts something, or indexes a step is set in mono — the builder's subject is
    // source code, so mono carries the technical register.
    't-display': 'text-[clamp(2.25rem,5.5vw,3.75rem)] font-extrabold tracking-[-0.04em] leading-[1.02]',
    't-title': 'text-[1.75rem] sm:text-[2rem] font-bold tracking-[-0.025em] leading-[1.15]',
    't-section': 'text-[0.9375rem] font-semibold tracking-[-0.01em]',
    't-body': 'text-[0.9375rem] leading-[1.65]',
    't-meta': 'text-[0.8125rem] leading-[1.5]',
    't-eyebrow': 'font-mono text-[0.6875rem] uppercase tracking-[0.16em] font-medium',
    't-index': 'font-mono text-[0.8125rem] tabular-nums tracking-[0.04em]',

    // Surfaces. Three elevations, expressed as background steps rather than shadows —
    // shadows are reserved for things that genuinely float (popovers, dialogs, sheets).
    'panel': 'rounded-xl border border-divider bg-surface',
    'panel-pad': 'p-5 sm:p-6',
    'inset': 'rounded-lg border border-divider bg-background',

    // Pickable cards. A selection is a commitment, so the selected state changes three
    // things at once — border, fill, and a filled marker — instead of a faint tint.
    'pick': 'relative text-left rounded-xl border transition-colors duration-150',
    'pick-off': 'border-divider bg-surface hover:border-on-surface-variant/50 hover:bg-surface-variant/60',
    'pick-on': 'border-primary bg-primary/8 shadow-[inset_0_0_0_1px_var(--v0-primary)]',
    'pick-disabled': 'border-divider bg-surface-variant/50 opacity-55 cursor-not-allowed',
    'pick-mark': 'flex-shrink-0 inline-flex items-center justify-center rounded-md transition-colors duration-150',
    'pick-mark-off': 'border border-divider bg-surface',
    'pick-mark-on': 'bg-primary text-on-primary',

    // Buttons. One height, one radius, three ranks of emphasis.
    'btn': 'inline-flex items-center justify-center gap-2 rounded-md font-semibold text-sm transition-colors duration-150 disabled:opacity-45 disabled:cursor-not-allowed',
    'btn-primary': 'btn h-10 px-5 bg-primary text-on-primary hover:bg-primary/88',
    'btn-outline': 'btn h-10 px-4 border border-divider bg-surface text-on-surface hover:bg-surface-variant',
    'btn-ghost': 'btn h-9 px-3 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface',
    'btn-quiet': 'inline-flex items-center gap-1.5 rounded-md text-[0.8125rem] font-medium text-on-surface-variant hover:text-on-surface transition-colors duration-150',

    // Fields. The config screens were built one per agent; these are what make them agree.
    'field': 'flex flex-col gap-1.5',
    'field-label': 't-eyebrow text-on-surface-variant',
    'field-input': 'w-full h-10 px-3 rounded-md border border-divider bg-surface text-on-surface text-sm outline-none transition-colors duration-150 data-[focused]:border-primary placeholder:text-on-surface-variant/60',
    'field-activator': 'w-full h-10 px-3 flex items-center justify-between gap-2 rounded-md border border-divider bg-surface text-on-surface text-sm cursor-pointer transition-colors duration-150 hover:border-on-surface-variant/50 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
    'field-menu': 'p-1 rounded-lg border border-divider bg-surface shadow-lg',
    'field-check': 'size-[1.125rem] border rounded-[0.3rem] inline-flex items-center justify-center flex-shrink-0 border-divider bg-surface transition-colors duration-150 data-[state=checked]:bg-primary data-[state=checked]:border-primary',
    'field-grid': 'grid grid-cols-1 md:grid-cols-2 gap-4',

    // Vertical rhythm between field groups and between sections.
    'stack': 'flex flex-col gap-5',
    'stack-tight': 'flex flex-col gap-2.5',

    // Chips carry identifiers and statuses; always mono, never sentence case.
    'chip': 'inline-flex items-center gap-1.5 h-6 px-2 rounded-md font-mono text-[0.6875rem] tracking-[0.02em]',
    'chip-quiet': 'chip border border-divider text-on-surface-variant',
    'chip-on': 'chip bg-primary/12 text-primary',
    // whitespace-nowrap: an identifier that wraps mid-token stops being readable as one.
    'code-chip': 'font-mono text-[0.8125em] px-1.5 py-0.5 rounded bg-surface-variant text-on-surface whitespace-nowrap',
  },

  preflights: [
    {
      getCSS: () => `
        html {
          scrollbar-gutter: stable;
        }

        body {
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        button:not(:disabled),
        [role="button"]:not(:disabled) {
          cursor: pointer;
        }

        *:focus-visible {
          outline: 2px solid var(--v0-primary);
          outline-offset: 2px;
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
      'background': 'var(--v0-background)',
      'surface': 'var(--v0-surface)',
      'surface-variant': 'var(--v0-surface-variant)',
      'divider': 'var(--v0-divider)',
      'on-primary': 'var(--v0-on-primary)',
      'on-surface': 'var(--v0-on-surface)',
      'on-surface-variant': 'var(--v0-on-surface-variant)',
    },
  },
})
