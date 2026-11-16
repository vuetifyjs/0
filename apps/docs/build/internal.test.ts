import { describe, expect, it } from 'vitest'

import { isInternal } from '../../../packages/0/scripts/internal'

describe('isInternal', () => {
  it('should match an @internal tag line in the header block', () => {
    const source = '/**\n * @module FooField\n *\n * @internal\n */\n\n<script lang="ts">\n</script>\n'

    expect(isInternal(source)).toBe(true)
  })

  it('should not match the word inside header prose', () => {
    const source = '/**\n * @module FooRoot\n *\n * @remarks\n * Wraps the @internal field.\n */\n\n<script lang="ts">\n</script>\n'

    expect(isInternal(source)).toBe(false)
  })

  it('should not match a tag below the header block', () => {
    const source = '/**\n * @module FooRoot\n */\n\n<script lang="ts">\n  /**\n   * @internal\n   */\n  export const secret = 1\n</script>\n'

    expect(isInternal(source)).toBe(false)
  })
})
