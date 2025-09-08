import { createLayout } from '#v0'
import { bench, describe, beforeEach } from 'vitest'

describe('useLayout benchmarks', () => {
  bench('register items', () => {
    const layout = createLayout()[2]
    // Register 500 components
    for (let i = 0; i < 500; i++) {
      const order = i % 25 === 0 ? i * -1 : 0
      const position =
              i % 25 === 0
                ? 'top'
                : i % 30 === 0
                  ? 'left'
                  : i % 20 === 0
                    ? 'bottom'
                    : 'right'

      layout.register({ id: `Component${i}`, position, value: i, order })
    }
  })

  bench('register and get items', () => {
    const layout = createLayout()[2]
    // Register 500 components
    for (let i = 0; i < 500; i++) {
      const order = i % 25 === 0 ? i * -1 : 0
      const position =
                i % 25 === 0
                  ? 'top'
                  : i % 30 === 0
                    ? 'left'
                    : i % 20 === 0
                      ? 'bottom'
                      : 'right'

      const item = layout.register({ id: `Component${i}`, position, value: i, order })
      const gotItem = layout.get(item.id)
      void gotItem?.cumulative
    }
  })
})
