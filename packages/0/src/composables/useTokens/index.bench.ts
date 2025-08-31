// Composables
import { useTokens } from './index'

// Utilities
import { bench, describe } from 'vitest'

import TOKENS from './fixtures/tokens'

describe('useTokens benchmarks', () => {
  describe('registration operations', () => {
    bench('resolve operations', () => {
      const tokens = useTokens(TOKENS)

      tokens.resolve('theme.typography.family.sans')
      tokens.resolve('theme.color.brand.primary.base')
      tokens.resolve('{components.Button.text.lineHeight}')
    })
  })
})
