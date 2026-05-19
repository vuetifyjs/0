import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [presetWind4()],
  preflights: [
    {
      getCSS: () => `
        button:not(:disabled),
        [role="button"]:not(:disabled) {
          cursor: pointer;
        }

        *:focus-visible {
          outline: 2px solid var(--v0-primary);
          outline-offset: 2px;
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
