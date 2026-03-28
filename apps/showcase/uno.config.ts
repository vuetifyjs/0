import { presetCodex } from '@paper/codex'
import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  content: {
    filesystem: [
      '../../packages/codex/src/**/*.vue',
      '../../packages/codex/src/**/*.ts',
    ],
  },
  presets: [presetWind4(), presetCodex()],
})
