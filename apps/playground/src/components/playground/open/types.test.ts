import { describe, expect, it } from 'vitest'

// Local
import { binCopyPath, binFileExt, binLanguageLabel, binReplExt, DEFAULT_OPEN_RAIL, normalizeOpenRail } from './types'

describe('normalizeOpenRail', () => {
  it('should default to Vuetify One', () => {
    expect(DEFAULT_OPEN_RAIL).toBe('saved')
    expect(normalizeOpenRail(undefined)).toBe('saved')
    expect(normalizeOpenRail('nope')).toBe('saved')
  })

  it('should keep known rails', () => {
    expect(normalizeOpenRail('v0')).toBe('v0')
    expect(normalizeOpenRail('vuetify')).toBe('vuetify')
    expect(normalizeOpenRail('saved')).toBe('saved')
    expect(normalizeOpenRail('bins')).toBe('bins')
  })

  it('should map runnable bin languages to a REPL extension', () => {
    expect(binReplExt('vue')).toBe('vue')
    expect(binReplExt('JavaScript')).toBe('js')
    expect(binReplExt('typescript')).toBe('ts')
    expect(binReplExt('css')).toBe('css')
    expect(binReplExt('json')).toBe('json')
    expect(binReplExt('html')).toBe('html')
    expect(binReplExt('python')).toBeUndefined()
    expect(binReplExt(null)).toBeUndefined()
    expect(binFileExt('markdown')).toBe('md')
    expect(binFileExt('python')).toBe('py')
    expect(binFileExt(null)).toBe('txt')
    expect(binFileExt('nope')).toBe('txt')
    expect(binLanguageLabel('markdown')).toBe('Markdown')
    expect(binLanguageLabel(null)).toBe('Text')
  })

  it('should name a copied bin without clobbering a file', () => {
    const taken = new Set(['src/button.vue', 'src/button-2.vue'])
    expect(binCopyPath('Button', 'vue', path => taken.has(path))).toBe('src/button-3.vue')
    expect(binCopyPath('  ', 'js', () => false)).toBe('src/bin.js')
    expect(binCopyPath(null, 'css', () => false)).toBe('src/bin.css')
  })

  it('should map legacy kind rails to v0', () => {
    expect(normalizeOpenRail('components')).toBe('v0')
    expect(normalizeOpenRail('composables')).toBe('v0')
    expect(normalizeOpenRail('plugins')).toBe('v0')
  })
})
