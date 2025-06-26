import { presetWind4, defineConfig } from 'unocss'

const isStorybook = process.env.STORYBOOK === '1'

export default defineConfig({
  presets: [
    presetWind4(),
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
})
