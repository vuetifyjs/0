import { presetHelix } from '@paper/helix'
import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  content: {
    filesystem: [
      '../../packages/helix/src/**/*.vue',
      '../../packages/helix/src/**/*.ts',
    ],
  },
  presets: [presetWind4(), presetHelix()],
})
