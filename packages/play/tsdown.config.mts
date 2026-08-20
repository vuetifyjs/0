import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown/config'

import pkg from './package.json' with { type: 'json' }

const v0 = fileURLToPath(new URL('../0/src', import.meta.url))
const __VERSION__ = JSON.stringify(pkg.version)

export default defineConfig({
  dts: true,
  define: {
    __DEV__: 'process.env.NODE_ENV !== \'production\'',
    __VERSION__,
  },
  name: 'vuetify/play',
  exports: {
    devExports: 'development',
  },
  alias: {
    '#v0': v0,
  },
})
