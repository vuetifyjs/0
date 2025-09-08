import { createLayout } from '#v0'
import { bench, describe } from 'vitest'

describe('useLayout benchmarks', () => {
  bench('register items', () => {
    const layout = createLayout()[2]
    // Register 500 components
    for (let i = 0; i < 500; i++) {
      const order = i % 25 === 0 ? i * -1 : 0
      function getPosition (i: number): 'top' | 'left' | 'bottom' | 'right' {
        if (i % 25 === 0) return 'top'
        if (i % 30 === 0) return 'left'
        if (i % 20 === 0) return 'bottom'
        return 'right'
      }

      const position = getPosition(i)

      layout.register({ id: `Component${i}`, position, value: i, order })
    }
  })

  bench('register and get items', () => {
    const layout = createLayout()[2]
    // Register 500 components
    for (let i = 0; i < 500; i++) {
      const order = i % 25 === 0 ? i * -1 : 0
      function getPosition (i: number): 'top' | 'left' | 'bottom' | 'right' {
        if (i % 25 === 0) return 'top'
        if (i % 30 === 0) return 'left'
        if (i % 20 === 0) return 'bottom'
        return 'right'
      }

      const position = getPosition(i)

      const item = layout.register({ id: `Component${i}`, position, value: i, order })
      const gotItem = layout.get(item.id)
      void gotItem?.cumulative
    }
  })
})
