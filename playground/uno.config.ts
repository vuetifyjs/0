import { presetWind3, defineConfig } from 'unocss'

const isStorybook = process.env.STORYBOOK === '1'

export default defineConfig({
  presets: [
    presetWind3(),
  ],
  content: {
    pipeline: {
      include: isStorybook
        ? [
            './src/**/*.{vue,js,ts,jsx,tsx}',
          ]
        : [],
    },
  },
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
      'on-primary': 'var(--v0-on-primary)',
      'on-secondary': 'var(--v0-on-secondary)',
      'on-accent': 'var(--v0-on-accent)',
      'on-error': 'var(--v0-on-error)',
      'on-info': 'var(--v0-on-info)',
      'on-success': 'var(--v0-on-success)',
      'on-warning': 'var(--v0-on-warning)',
      'on-background': 'var(--v0-on-background)',
      'on-surface': 'var(--v0-on-surface)',
    },
  },
})
