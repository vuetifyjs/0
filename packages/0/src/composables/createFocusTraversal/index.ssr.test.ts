import { describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope } from 'vue'

vi.mock('#v0/constants/globals', () => ({
  IN_BROWSER: false,
}))

// Types
import type { ID } from '#v0/types'

import { createFocusTraversal } from './index'

describe('createFocusTraversal (SSR)', () => {
  it('should not detect RTL when not in browser', () => {
    const scope = effectScope()
    function items () {
      return [
        { id: 'a', disabled: false },
        { id: 'b', disabled: false },
      ]
    }

    let traversal: ReturnType<typeof createFocusTraversal>
    let activeId: ID | undefined

    scope.run(() => {
      traversal = createFocusTraversal(
        items,
        (id: ID) => {
          activeId = id
        },
        { orientation: 'horizontal' },
      )

      // Activate first
      traversal.first()
    })

    // Without IN_BROWSER, isRtl returns false unconditionally,
    // so ArrowRight steps forward (LTR direction).
    const event = {
      key: 'ArrowRight',
      preventDefault: () => {},
      currentTarget: null,
    } as unknown as KeyboardEvent

    traversal!.onKeydown(event)
    expect(activeId).toBe('b')

    scope.stop()
  })
})
