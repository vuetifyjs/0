import { describe, expect, it } from 'vitest'

// Composables
import { playgroundRegistryUrl } from './usePlayground'

describe('playgroundRegistryUrl', () => {
  it('should append a theme query param when provided', () => {
    const url = playgroundRegistryUrl({ item: 'dialog', example: 'basic', theme: 'dark' })
    expect(url).toContain('example=dialog%2Fbasic')
    expect(url).toContain('theme=dark')
  })
})
