import { transformerDirectives, presetWind3, defineConfig, toEscapedSelector } from 'unocss'

export default defineConfig({
  /* safelist: ['app-nav-960'],
  shortcuts: {
    'app-nav': 'flex flex-col fixed top-[72px] bottom-[24px] translate-x-0 w-[220px] overflow-y-auto py-4 transition-transform duration-200 ease-in-out',
  },
  rules: [
    [/^app-nav-(\d+)$/, ([, w]) => {
      return `@media (max-width: ${w}px) {
  .app-nav-${w} {
    @apply top-[72px] bottom-[24px] translate-x-[-100%];
  }
  .app-nav-${w}.drawer {
    @apply  translate-x-0;
  }
}`
    }],
  ], */
  presets: [
    presetWind3(),
  ],
  transformers: [
    transformerDirectives(),
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
      'surfaceTint': 'var(--v0-surface-tint)',
      'surfaceVariant': 'var(--v0-surface-variant)',
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
      'on-surface-tint': 'var(--v0-on-surface-tint)',
      'on-surface-variant': 'var(--v0-on-surface-variant)',
    },
  },
})
