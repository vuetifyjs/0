// Utilities
import { bench, describe } from 'vitest'

import TOKENS from './fixtures/tokens'

// Composables
import { createTokens } from './index'

describe('createTokens benchmarks', () => {
  describe('registration operations', () => {
    bench('resolve operations', () => {
      const tokens = createTokens(TOKENS)

      tokens.resolve('theme.typography.family.sans')
      tokens.resolve('theme.color.brand.primary.base')
      tokens.resolve('{components.Button.text.lineHeight}')
    })
  })
})
