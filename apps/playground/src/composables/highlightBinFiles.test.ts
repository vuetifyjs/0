import { describe, expect, it } from 'vitest'

import { loadGrammar } from './highlightBinFiles'

describe('loadGrammar', () => {
  it('should tokenize python and markdown', async () => {
    const python = await loadGrammar('python')
    const py = python.tokenizeLine('def answer():', null, 500)
    expect(py.tokens.some(token => token.scopes.some(scope => scope.includes('keyword') || scope.includes('storage')))).toBe(true)

    const markdown = await loadGrammar('markdown')
    const md = markdown.tokenizeLine('# Title', null, 500)
    expect(md.tokens.some(token => token.scopes.some(scope => scope.includes('markup.heading')))).toBe(true)
  })

  it('should tokenize scss', async () => {
    const scss = await loadGrammar('scss')
    const line = scss.tokenizeLine('$color: red;', null, 500)
    expect(line.tokens.length).toBeGreaterThan(0)
  })

  it('should share one grammar load', async () => {
    const first = loadGrammar('json')
    const second = loadGrammar('json')
    expect(await first).toBe(await second)
  })
})
