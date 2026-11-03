import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Overflow } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'

// Types
import type { OverflowRootSlotProps } from './index'
import type { Ref } from 'vue'

// Only the first observer belongs to the container; later ones belong to children.
const observers: Array<{ cb: ResizeObserverCallback, target: Element | null }> = []

class TestResizeObserver {
  private entry: { cb: ResizeObserverCallback, target: Element | null }

  constructor (cb: ResizeObserverCallback) {
    this.entry = { cb, target: null }
    observers.push(this.entry)
  }

  observe (el: Element) {
    this.entry.target = el
  }

  unobserve () {}
  disconnect () {}
}

function triggerResize (width: number): void {
  const first = observers[0]
  if (!first?.cb || !first.target) return
  const rect = { width, height: 0, top: 0, left: 0, right: width, bottom: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRectReadOnly
  first.cb(
    [{ contentRect: rect, target: first.target, borderBoxSize: [], contentBoxSize: [], devicePixelContentBoxSize: [] }],
    {} as ResizeObserver,
  )
}

async function settle (): Promise<void> {
  for (let i = 0; i < 3; i++) await nextTick()
}

interface Snapshot {
  capacity: number
  isOverflowing: boolean
  hidden: string[]
}

function mountItems (items: Ref<string[]>) {
  let slotProps: OverflowRootSlotProps | undefined

  const wrapper = mount(defineComponent({
    setup () {
      return () => h(Overflow.Root as never, {}, {
        default: (props: OverflowRootSlotProps) => {
          slotProps = props
          return items.value.map(text =>
            h(Overflow.Item as never, { 'key': text, 'data-t': text, 'style': 'display: inline-block; width: 100px' }, () => text),
          )
        },
      })
    },
  }), { attachTo: document.body })

  function snapshot (): Snapshot {
    const els = [...wrapper.element.querySelectorAll('[data-t]')] as HTMLElement[]
    return {
      capacity: slotProps!.capacity,
      isOverflowing: slotProps!.isOverflowing,
      hidden: els.filter(el => el.style.display === 'none').map(el => el.dataset.t!),
    }
  }

  return { wrapper, snapshot }
}

describe('overflow', () => {
  beforeEach(() => {
    observers.length = 0
    vi.stubGlobal('ResizeObserver', TestResizeObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should keep hidden item widths when a sibling unmounts', async () => {
    const items = ref(['a', 'b', 'c', 'd', 'e'])
    const tree = mountItems(items)
    await settle()
    triggerResize(250)
    await settle()

    expect(tree.snapshot().hidden).toEqual(['c', 'd', 'e'])

    items.value = ['a', 'c', 'd', 'e']
    await settle()
    triggerResize(350)
    await settle()
    const after = tree.snapshot()
    tree.wrapper.unmount()

    observers.length = 0
    const fresh = mountItems(ref(['a', 'c', 'd', 'e']))
    await settle()
    triggerResize(350)
    await settle()
    const oracle = fresh.snapshot()
    fresh.wrapper.unmount()

    expect(oracle).toEqual({ capacity: 3, isOverflowing: true, hidden: ['e'] })
    expect(after).toEqual(oracle)
  })
})
