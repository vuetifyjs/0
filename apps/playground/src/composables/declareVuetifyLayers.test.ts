import { describe, expect, it } from 'vitest'

import { declareVuetifyLayers } from './declareVuetifyLayers'

const PREAMBLE = `document.head.insertAdjacentHTML('afterbegin', '<style>@layer vuetify-core,vuetify-components,vuetify-overrides,vuetify-utilities,vuetify-final;</style>')\n`

const MAIN = `import { createApp } from 'vue'
import { vuetify } from './vuetify'
import App from './App.vue'
import './setup'

const app = createApp(App)
app.use(vuetify)
app.mount('#app')
`

const SETUP = `removeStyleTag()
`

const VUETIFY = `import { createVuetify } from 'vuetify'

export const vuetify = createVuetify()
`

describe('declareVuetifyLayers', () => {
  it('should prepend the layer order to setup.ts for a Play template', () => {
    const files = {
      'src/main.ts': MAIN,
      'src/setup.ts': SETUP,
      'src/vuetify.ts': VUETIFY,
    }

    const next = declareVuetifyLayers(files)

    expect(next['src/setup.ts']).toBe(`${PREAMBLE}${SETUP}`)
    expect(next['src/vuetify.ts']).toBe(VUETIFY)
    expect(next['src/main.ts']).toBe(MAIN)
    expect(files['src/setup.ts']).toBe(SETUP)
  })

  it('should not prepend again when the preamble is already present', () => {
    const files = {
      'src/main.ts': MAIN,
      'src/setup.ts': `${PREAMBLE}${SETUP}`,
      'src/vuetify.ts': VUETIFY,
    }

    expect(declareVuetifyLayers(files)).toBe(files)
  })

  it('should prepend the vuetify module when setup.ts is absent', () => {
    const files = {
      'src/main.ts': MAIN,
      'src/plugins/vuetify.ts': VUETIFY,
    }

    const next = declareVuetifyLayers(files)

    expect(next['src/plugins/vuetify.ts']).toBe(`${PREAMBLE}${VUETIFY}`)
    expect(files['src/plugins/vuetify.ts']).toBe(VUETIFY)
  })

  it('should leave files unchanged when no vuetify module is present', () => {
    const files = {
      'src/main.ts': `import { createVuetify } from 'vuetify'\nconst vuetify = createVuetify()\n`,
      'src/setup.ts': `loadStylesheet('https://cdn.jsdelivr.net/npm/vuetify@latest/dist/vuetify-labs.css')\n`,
    }

    expect(declareVuetifyLayers(files)).toBe(files)
  })
})
