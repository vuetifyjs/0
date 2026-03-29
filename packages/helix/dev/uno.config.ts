import { defineConfig, presetWind4 } from 'unocss'

import { presetHelix } from '../src/uno-preset'

export default defineConfig({
  content: {
    filesystem: [
      './**/*.vue',
      '../src/**/*.vue',
      '../src/**/*.ts',
    ],
  },
  presets: [presetWind4(), presetHelix()],
})
