import { defineConfig, presetWind4 } from 'unocss'

import { presetHelix } from '../src'

export default defineConfig({
  presets: [presetWind4(), presetHelix()],
})
