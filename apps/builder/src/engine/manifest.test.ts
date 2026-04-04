import { describe, expect, it } from 'vitest'

import { generateFiles, generateImports } from './manifest'

describe('generateFiles', () => {
  it('generates main.ts with selected plugins', () => {
    const files = generateFiles({
      intent: 'spa',
      features: ['useTheme', 'createSelection'],
      resolved: ['createContext', 'createModel', 'createTrinity'],
      adapters: {},
    })

    expect(files['src/main.ts']).toContain('createThemePlugin')
    expect(files['src/App.vue']).toBeDefined()
  })

  it('generates App.vue with a starter template', () => {
    const files = generateFiles({
      intent: 'spa',
      features: ['createSelection'],
      resolved: ['createContext', 'createModel', 'createTrinity'],
      adapters: {},
    })

    expect(files['src/App.vue']).toContain('createSelection')
  })

  it('omits theme plugin when useTheme is not selected', () => {
    const files = generateFiles({
      intent: 'spa',
      features: ['createSelection'],
      resolved: ['createContext', 'createModel', 'createTrinity'],
      adapters: {},
    })

    expect(files['src/main.ts']).not.toContain('createThemePlugin')
  })
})

describe('generateImports', () => {
  it('includes v0 CDN import', () => {
    const imports = generateImports()
    expect(imports['@vuetify/v0']).toContain('cdn.jsdelivr.net')
  })
})
