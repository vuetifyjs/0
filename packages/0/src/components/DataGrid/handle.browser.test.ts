import { describe, expect, it } from 'vitest'

import { DataGrid } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'

const resizableColumns = [
  { id: 'name', size: 50, minSize: 10, maxSize: 90, resizable: true },
  { id: 'email', size: 50, minSize: 10, maxSize: 90, resizable: true },
]

describe('dataGrid handle', () => {
  it('should nest Handle inside Column so row does not own a separator sibling', async () => {
    const wrapper = mount(DataGrid.Root, {
      slots: {
        default: (props: { context: { columns: { size: number, onboard: (columns: typeof resizableColumns) => void } } }) => {
          if (props.context.columns.size === 0) {
            props.context.columns.onboard(resizableColumns)
          }

          return h(DataGrid.Table, { as: 'div' }, () =>
            h(DataGrid.Header, { as: 'div' }, () =>
              h(DataGrid.Row, { resizable: true, as: 'div' }, () => [
                h(DataGrid.Column, { id: 'name', as: 'div' }, () => [
                  'Name',
                  h(DataGrid.Handle),
                ]),
                h(DataGrid.Column, { id: 'email', as: 'div' }, () => 'Email'),
              ]),
            ),
          )
        },
      },
    })

    await nextTick()

    const separator = wrapper.find('[role="separator"]')
    expect(separator.exists()).toBe(true)

    const row = wrapper.get('[role="row"]').element
    const owned = [...row.children]
      .map(child => child.getAttribute('role'))
      .filter((role): role is string => role !== null)

    expect(owned).toEqual(['columnheader', 'columnheader'])
    expect(separator.element.closest('[role="columnheader"]')).not.toBeNull()
  })
})
