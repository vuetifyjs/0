import { presetWind4, defineConfig } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
  ],
  content: {
    pipeline: {
      include: ['./stories/**/*.{vue,js,ts,jsx,tsx}'],
    },
  },
})
