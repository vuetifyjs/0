import { presetCodex } from '@paper/codex'
import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [presetWind4(), presetCodex()],
})
