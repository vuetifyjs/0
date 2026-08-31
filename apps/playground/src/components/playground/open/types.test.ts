import { describe, expect, it } from 'vitest'

import { playgroundStack } from './types'

describe('playgroundStack', () => {
  it('should return undefined for missing content', () => {
    expect(playgroundStack(undefined)).toBeUndefined()
    expect(playgroundStack('')).toBeUndefined()
  })

  it('should treat play tuples as vuetify', () => {
    expect(playgroundStack(JSON.stringify([{ 'App.vue': '<template />' }]))).toBe('vuetify')
  })

  it('should treat v0play default payloads as v0', () => {
    expect(playgroundStack(JSON.stringify({
      files: { 'src/App.vue': '<template />' },
    }))).toBe('v0')
  })

  it('should treat v0play vuetify preset as vuetify', () => {
    expect(playgroundStack(JSON.stringify({
      files: { 'src/App.vue': '<template />' },
      settings: { preset: 'vuetify' },
    }))).toBe('vuetify')
  })

  it('should not sniff file source for vuetify imports', () => {
    expect(playgroundStack(JSON.stringify({
      files: { 'src/App.vue': 'import { createVuetify } from \'vuetify\'' },
    }))).toBe('v0')
  })
})
