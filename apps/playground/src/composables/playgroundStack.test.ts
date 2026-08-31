import { describe, expect, it } from 'vitest'

import { classifyResponsePrefix, playgroundStack } from './playgroundStack'

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

describe('classifyResponsePrefix', () => {
  it('should treat a nested play tuple as vuetify', () => {
    expect(classifyResponsePrefix('{"playground":{"content":"[{}]}"}')).toBe('vuetify')
  })

  it('should treat settings-first vuetify preset as vuetify', () => {
    const buf = String.raw`{"playground":{"content":"{\"settings\":{\"preset\":\"vuetify\"},\"files\":{}}"}}`
    expect(classifyResponsePrefix(buf)).toBe('vuetify')
  })

  it('should treat settings-first default as v0', () => {
    const buf = String.raw`{"playground":{"content":"{\"settings\":{},\"files\":{}}"}}`
    expect(classifyResponsePrefix(buf)).toBe('v0')
  })

  it('should not guess v0 from files-first truncated bodies', () => {
    const buf = String.raw`{"playground":{"content":"{\"files\":{\"src/App.vue\":\"`
    expect(classifyResponsePrefix(buf)).toBeUndefined()
  })
})
