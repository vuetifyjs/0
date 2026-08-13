import { describe, expect, it } from 'vitest'

import { derivePlacement } from './placement'
import { V0PopoverAdapter } from './v0'

// Utilities
import { shallowRef, toRef } from 'vue'

// Types
import type { PopoverAdapterContext } from './adapter'

function makeContext (overrides: Partial<PopoverAdapterContext> = {}): PopoverAdapterContext {
  return {
    anchorName: '--test',
    anchorEl: shallowRef(),
    contentEl: shallowRef(),
    isOpen: shallowRef(false),
    placement: toRef(() => derivePlacement('bottom')),
    positionTry: 'most-width bottom',
    ...overrides,
  }
}

describe('v0PopoverAdapter', () => {
  it('should emit CSS anchor positioning declarations', () => {
    const adapter = new V0PopoverAdapter()
    const styles = adapter.setup(makeContext())

    expect(styles.value).toEqual({
      'position': 'fixed',
      'margin': 'unset',
      'inset-area': 'bottom',
      'position-area': 'bottom',
      'position-anchor': '--test',
      'position-try-fallbacks': 'most-width bottom',
    })
  })

  it('should render the raw position-area value, not the normalized side/align', () => {
    const adapter = new V0PopoverAdapter()
    const styles = adapter.setup(makeContext({
      placement: toRef(() => derivePlacement('top span-right')),
    }))

    expect(styles.value['position-area']).toBe('top span-right')
    expect(styles.value['inset-area']).toBe('top span-right')
  })

  it('should use the anchorName and positionTry from context verbatim', () => {
    const adapter = new V0PopoverAdapter()
    const styles = adapter.setup(makeContext({
      anchorName: '--custom-anchor',
      positionTry: 'most-height top',
    }))

    expect(styles.value['position-anchor']).toBe('--custom-anchor')
    expect(styles.value['position-try-fallbacks']).toBe('most-height top')
  })

  it('should react to placement changes', () => {
    const placementSource = shallowRef('bottom')
    const adapter = new V0PopoverAdapter()
    const styles = adapter.setup(makeContext({
      placement: toRef(() => derivePlacement(placementSource.value)),
    }))

    expect(styles.value['position-area']).toBe('bottom')

    placementSource.value = 'top'
    expect(styles.value['position-area']).toBe('top')
  })
})
