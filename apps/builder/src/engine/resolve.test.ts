import { describe, expect, it } from 'vitest'

// Types
import type { DependencyGraph } from '@/data/types'

import { resolve } from './resolve'

const graph: DependencyGraph = {
  composables: {
    createContext: [],
    createTrinity: [],
    createModel: ['createContext'],
    createSelection: ['createContext', 'createModel', 'createTrinity'],
    createSingle: ['createContext', 'createSelection', 'createTrinity'],
    createStep: ['createContext', 'createSingle', 'createTrinity'],
  },
  components: {},
}

describe('resolve', () => {
  it('returns empty for empty selection', () => {
    const result = resolve([], graph)
    expect(result.selected).toEqual([])
    expect(result.autoIncluded).toEqual([])
    expect(result.warnings).toEqual([])
  })

  it('selects a feature with no dependencies', () => {
    const result = resolve(['createContext'], graph)
    expect(result.selected).toEqual(['createContext'])
    expect(result.autoIncluded).toEqual([])
  })

  it('auto-includes transitive dependencies', () => {
    const result = resolve(['createSelection'], graph)
    expect(result.selected).toEqual(['createSelection'])
    expect(result.autoIncluded.toSorted()).toEqual(['createContext', 'createModel', 'createTrinity'])
  })

  it('does not duplicate features in selected and autoIncluded', () => {
    const result = resolve(['createSelection', 'createContext'], graph)
    expect(result.selected.toSorted()).toEqual(['createContext', 'createSelection'])
    expect(result.autoIncluded.toSorted()).toEqual(['createModel', 'createTrinity'])
  })

  it('resolves deep transitive chains', () => {
    const result = resolve(['createStep'], graph)
    expect(result.selected).toEqual(['createStep'])
    expect(result.autoIncluded.toSorted()).toEqual([
      'createContext',
      'createModel',
      'createSelection',
      'createSingle',
      'createTrinity',
    ])
  })

  it('tracks reasons for auto-included dependencies', () => {
    const result = resolve(['createSelection'], graph)
    expect(result.reasons.createContext).toBe('createSelection')
    expect(result.reasons.createModel).toBe('createSelection')
    expect(result.reasons.createTrinity).toBe('createSelection')
  })

  it('warns for features not in the graph', () => {
    const result = resolve(['nonExistent'], graph)
    expect(result.warnings).toEqual([
      { featureId: 'nonExistent', type: 'missing', message: 'Feature "nonExistent" not found in dependency graph' },
    ])
  })
})
