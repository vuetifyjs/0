// Utilities
import { describe, expect, it, vi } from 'vitest'

// Types
import type { NestedRegistration } from './types'

// Composables
import { createNested, multipleOpenStrategy, singleOpenStrategy } from './index'

describe('useNested', () => {
  describe('parent-child relationship management', () => {
    it('should register a root node with no parent', () => {
      const nested = createNested()

      const root = nested.register({ id: 'root', value: 'Root' })

      expect(root.id).toBe('root')
      expect(root.parentId).toBeUndefined()
      expect(nested.parents.get('root')).toBeUndefined()
    })

    it('should register a child with valid parentId', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      const child = nested.register({ id: 'child', value: 'Child', parentId: 'root' })

      expect(child.parentId).toBe('root')
      expect(nested.parents.get('child')).toBe('root')
      expect(nested.children.get('root')).toContain('child')
    })

    it('should warn when registering with non-existent parentId', () => {
      const nested = createNested()
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      nested.register({ id: 'orphan', value: 'Orphan', parentId: 'non-existent' })

      expect(nested.parents.get('orphan')).toBeUndefined()
      warnSpy.mockRestore()
    })

    it('should register multiple children to same parent', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child-1', value: 'Child 1', parentId: 'root' })
      nested.register({ id: 'child-2', value: 'Child 2', parentId: 'root' })

      const children = nested.children.get('root')
      expect(children).toHaveLength(2)
      expect(children).toContain('child-1')
      expect(children).toContain('child-2')
    })

    it('should register inline children via children property', () => {
      const nested = createNested()

      const reg: NestedRegistration = {
        id: 'root',
        value: 'Root',
        children: [
          { id: 'child-1', value: 'Child 1' },
          { id: 'child-2', value: 'Child 2' },
        ],
      }
      nested.register(reg)

      expect(nested.size).toBe(3)
      expect(nested.has('root')).toBe(true)
      expect(nested.has('child-1')).toBe(true)
      expect(nested.has('child-2')).toBe(true)
      expect(nested.parents.get('child-1')).toBe('root')
      expect(nested.parents.get('child-2')).toBe('root')
      expect(nested.children.get('root')).toEqual(['child-1', 'child-2'])
    })

    it('should register deeply nested inline children', () => {
      const nested = createNested()

      const reg: NestedRegistration = {
        id: 'root',
        value: 'Root',
        children: [
          {
            id: 'child',
            value: 'Child',
            children: [
              { id: 'grandchild', value: 'Grandchild' },
            ],
          },
        ],
      }
      nested.register(reg)

      expect(nested.size).toBe(3)
      expect(nested.getPath('grandchild')).toEqual(['root', 'child', 'grandchild'])
      expect(nested.getDepth('grandchild')).toBe(2)
    })

    it('should support inline children via onboard', () => {
      const nested = createNested()

      const regs: NestedRegistration[] = [
        {
          id: 'nav-1',
          value: 'Navigation 1',
          children: [
            { id: 'nav-1-1', value: 'Item 1.1' },
            { id: 'nav-1-2', value: 'Item 1.2' },
          ],
        },
        {
          id: 'nav-2',
          value: 'Navigation 2',
        },
      ]
      nested.onboard(regs)

      expect(nested.size).toBe(4)
      expect(nested.roots.value).toHaveLength(2)
      expect(nested.children.get('nav-1')).toEqual(['nav-1-1', 'nav-1-2'])
    })

    it('should not spread children property to ticket', () => {
      const nested = createNested()

      const reg: NestedRegistration = {
        id: 'root',
        value: 'Root',
        children: [
          { id: 'child', value: 'Child' },
        ],
      }
      const ticket = nested.register(reg)

      expect((ticket as unknown as { children: unknown }).children).toBeUndefined()
    })
  })

  describe('unregister behavior', () => {
    it('should unregister node and orphan children by default', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child', value: 'Child', parentId: 'root' })

      nested.unregister('root')

      expect(nested.has('root')).toBe(false)
      expect(nested.has('child')).toBe(true)
      expect(nested.parents.get('child')).toBeUndefined()
    })

    it('should cascade unregister with cascade=true', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child', value: 'Child', parentId: 'root' })
      nested.register({ id: 'grandchild', value: 'Grandchild', parentId: 'child' })

      nested.unregister('root', true)

      expect(nested.has('root')).toBe(false)
      expect(nested.has('child')).toBe(false)
      expect(nested.has('grandchild')).toBe(false)
    })

    it('should remove node from parent children array', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child-1', value: 'Child 1', parentId: 'root' })
      nested.register({ id: 'child-2', value: 'Child 2', parentId: 'root' })

      nested.unregister('child-1')

      const children = nested.children.get('root')
      expect(children).toHaveLength(1)
      expect(children).not.toContain('child-1')
      expect(children).toContain('child-2')
    })

    it('should clear open state on cascade unregister', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child', value: 'Child', parentId: 'root' })
      nested.open(['root', 'child'])

      nested.unregister('root', true)

      expect(nested.openedIds.has('root')).toBe(false)
      expect(nested.openedIds.has('child')).toBe(false)
    })
  })

  describe('tree traversal', () => {
    it('should return path [id] for root node', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })

      expect(nested.getPath('root')).toEqual(['root'])
    })

    it('should return full path from root to leaf', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child', value: 'Child', parentId: 'root' })
      nested.register({ id: 'grandchild', value: 'Grandchild', parentId: 'child' })

      expect(nested.getPath('grandchild')).toEqual(['root', 'child', 'grandchild'])
    })

    it('should return ancestors excluding self', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child', value: 'Child', parentId: 'root' })
      nested.register({ id: 'grandchild', value: 'Grandchild', parentId: 'child' })

      expect(nested.getAncestors('grandchild')).toEqual(['root', 'child'])
      expect(nested.getAncestors('root')).toEqual([])
    })

    it('should return all descendants', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child-1', value: 'Child 1', parentId: 'root' })
      nested.register({ id: 'child-2', value: 'Child 2', parentId: 'root' })
      nested.register({ id: 'grandchild', value: 'Grandchild', parentId: 'child-1' })

      const descendants = nested.getDescendants('root')
      expect(descendants).toHaveLength(3)
      expect(descendants).toContain('child-1')
      expect(descendants).toContain('child-2')
      expect(descendants).toContain('grandchild')
    })

    it('should return empty array for leaf descendants', () => {
      const nested = createNested()

      nested.register({ id: 'leaf', value: 'Leaf' })

      expect(nested.getDescendants('leaf')).toEqual([])
    })
  })

  describe('open state management', () => {
    it('should open single node by ID', () => {
      const nested = createNested()

      nested.register({ id: 'node', value: 'Node' })
      nested.open('node')

      expect(nested.opened('node')).toBe(true)
      expect(nested.openedIds.has('node')).toBe(true)
    })

    it('should open array of nodes', () => {
      const nested = createNested()

      nested.register({ id: 'node-1', value: 'Node 1' })
      nested.register({ id: 'node-2', value: 'Node 2' })
      nested.open(['node-1', 'node-2'])

      expect(nested.opened('node-1')).toBe(true)
      expect(nested.opened('node-2')).toBe(true)
    })

    it('should close single node by ID', () => {
      const nested = createNested()

      nested.register({ id: 'node', value: 'Node' })
      nested.open('node')
      nested.close('node')

      expect(nested.opened('node')).toBe(false)
    })

    it('should toggle open state', () => {
      const nested = createNested()

      nested.register({ id: 'node', value: 'Node' })

      nested.toggleOpen('node')
      expect(nested.opened('node')).toBe(true)

      nested.toggleOpen('node')
      expect(nested.opened('node')).toBe(false)
    })

    it('should skip non-existent IDs on open', () => {
      const nested = createNested()

      nested.open('non-existent')

      expect(nested.openedIds.size).toBe(0)
    })

    it('should provide isOpen ref on ticket', () => {
      const nested = createNested()

      const ticket = nested.register({ id: 'node', value: 'Node' })

      expect(ticket.isOpen.value).toBe(false)
      nested.open('node')
      expect(ticket.isOpen.value).toBe(true)
    })

    it('should provide ticket-level open/close methods', () => {
      const nested = createNested()

      const ticket = nested.register({ id: 'node', value: 'Node' })

      ticket.open()
      expect(nested.opened('node')).toBe(true)

      ticket.close()
      expect(nested.opened('node')).toBe(false)

      ticket.toggleOpen()
      expect(nested.opened('node')).toBe(true)
    })
  })

  describe('computed properties', () => {
    it('should compute roots correctly', () => {
      const nested = createNested()

      nested.register({ id: 'root-1', value: 'Root 1' })
      nested.register({ id: 'root-2', value: 'Root 2' })
      nested.register({ id: 'child', value: 'Child', parentId: 'root-1' })

      const roots = nested.roots.value
      expect(roots).toHaveLength(2)
      expect(roots.map(r => r.id)).toContain('root-1')
      expect(roots.map(r => r.id)).toContain('root-2')
      expect(roots.map(r => r.id)).not.toContain('child')
    })

    it('should compute leaves correctly', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child', value: 'Child', parentId: 'root' })

      const leaves = nested.leaves.value
      expect(leaves).toHaveLength(1)
      expect(leaves[0]!.id).toBe('child')
    })

    it('should determine isLeaf correctly', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child', value: 'Child', parentId: 'root' })

      expect(nested.isLeaf('root')).toBe(false)
      expect(nested.isLeaf('child')).toBe(true)
    })

    it('should compute depth correctly', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child', value: 'Child', parentId: 'root' })
      nested.register({ id: 'grandchild', value: 'Grandchild', parentId: 'child' })

      expect(nested.getDepth('root')).toBe(0)
      expect(nested.getDepth('child')).toBe(1)
      expect(nested.getDepth('grandchild')).toBe(2)
    })

    it('should provide isLeaf and depth refs on ticket', () => {
      const nested = createNested()

      const root = nested.register({ id: 'root', value: 'Root' })
      expect(root.isLeaf.value).toBe(true)
      expect(root.depth.value).toBe(0)

      nested.register({ id: 'child', value: 'Child', parentId: 'root' })
      expect(root.isLeaf.value).toBe(false)
    })
  })

  describe('expandAll and collapseAll', () => {
    it('should expand all non-leaf nodes', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child-1', value: 'Child 1', parentId: 'root' })
      nested.register({ id: 'child-2', value: 'Child 2', parentId: 'root' })
      nested.register({ id: 'grandchild', value: 'Grandchild', parentId: 'child-1' })

      nested.expandAll()

      // root and child-1 have children, so should be open
      expect(nested.opened('root')).toBe(true)
      expect(nested.opened('child-1')).toBe(true)
      // child-2 and grandchild are leaves, should not be in openedIds
      expect(nested.opened('child-2')).toBe(false)
      expect(nested.opened('grandchild')).toBe(false)
    })

    it('should collapse all nodes', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child', value: 'Child', parentId: 'root' })
      nested.open(['root', 'child'])

      nested.collapseAll()

      expect(nested.openedIds.size).toBe(0)
      expect(nested.opened('root')).toBe(false)
    })
  })

  describe('toFlat', () => {
    it('should return empty array for empty tree', () => {
      const nested = createNested()

      expect(nested.toFlat()).toEqual([])
    })

    it('should convert tree to flat array with parentId references', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child-1', value: 'Child 1', parentId: 'root' })
      nested.register({ id: 'child-2', value: 'Child 2', parentId: 'root' })

      const flat = nested.toFlat()

      expect(flat).toHaveLength(3)
      expect(flat.find(item => item.id === 'root')).toEqual({
        id: 'root',
        parentId: undefined,
        value: 'Root',
      })
      expect(flat.find(item => item.id === 'child-1')).toEqual({
        id: 'child-1',
        parentId: 'root',
        value: 'Child 1',
      })
    })

    it('should preserve nested parentId references', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child', value: 'Child', parentId: 'root' })
      nested.register({ id: 'grandchild', value: 'Grandchild', parentId: 'child' })

      const flat = nested.toFlat()
      const grandchild = flat.find(item => item.id === 'grandchild')

      expect(grandchild?.parentId).toBe('child')
    })
  })

  describe('open strategies', () => {
    it('should allow multiple nodes open with multipleOpenStrategy', () => {
      const nested = createNested({ openStrategy: multipleOpenStrategy })

      nested.register({ id: 'node-1', value: 'Node 1' })
      nested.register({ id: 'node-2', value: 'Node 2' })

      nested.open('node-1')
      nested.open('node-2')

      expect(nested.opened('node-1')).toBe(true)
      expect(nested.opened('node-2')).toBe(true)
    })

    it('should close others with singleOpenStrategy', () => {
      const nested = createNested({ openStrategy: singleOpenStrategy })

      nested.register({ id: 'node-1', value: 'Node 1' })
      nested.register({ id: 'node-2', value: 'Node 2' })

      nested.open('node-1')
      expect(nested.opened('node-1')).toBe(true)

      nested.open('node-2')
      expect(nested.opened('node-1')).toBe(false)
      expect(nested.opened('node-2')).toBe(true)
    })
  })

  describe('reset', () => {
    it('should clear all state', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child', value: 'Child', parentId: 'root' })
      nested.open('root')
      nested.select('child')

      nested.reset()

      expect(nested.size).toBe(0)
      expect(nested.openedIds.size).toBe(0)
      expect(nested.selectedIds.size).toBe(0)
      expect(nested.children.size).toBe(0)
      expect(nested.parents.size).toBe(0)
    })
  })

  describe('inherited group behavior', () => {
    it('should support selection independent of open state', () => {
      const nested = createNested()

      nested.register({ id: 'node', value: 'Node' })

      nested.select('node')
      expect(nested.selectedIds.has('node')).toBe(true)
      expect(nested.opened('node')).toBe(false)

      nested.open('node')
      expect(nested.selectedIds.has('node')).toBe(true)
      expect(nested.opened('node')).toBe(true)
    })

    it('should support batch operations on arrays', () => {
      const nested = createNested()

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'child-1', value: 'Child 1', parentId: 'root' },
        { id: 'child-2', value: 'Child 2', parentId: 'root' },
      ])

      expect(nested.size).toBe(3)
      expect(nested.children.get('root')).toHaveLength(2)
    })

    it('should offboard multiple nodes', () => {
      const nested = createNested()

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'child-1', value: 'Child 1', parentId: 'root' },
        { id: 'child-2', value: 'Child 2', parentId: 'root' },
      ])

      nested.offboard(['child-1', 'child-2'])

      expect(nested.size).toBe(1)
      expect(nested.has('root')).toBe(true)
    })
  })

  describe('cascading selection', () => {
    it('should select all descendants when selecting parent', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child-1', value: 'Child 1', parentId: 'root' })
      nested.register({ id: 'child-2', value: 'Child 2', parentId: 'root' })

      nested.select('root')

      expect(nested.selected('root')).toBe(true)
      expect(nested.selected('child-1')).toBe(true)
      expect(nested.selected('child-2')).toBe(true)
    })

    it('should unselect all descendants when unselecting parent', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child-1', value: 'Child 1', parentId: 'root' })
      nested.register({ id: 'child-2', value: 'Child 2', parentId: 'root' })

      nested.select('root')
      nested.unselect('root')

      expect(nested.selected('root')).toBe(false)
      expect(nested.selected('child-1')).toBe(false)
      expect(nested.selected('child-2')).toBe(false)
    })

    it('should set parent to mixed when some children selected', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child-1', value: 'Child 1', parentId: 'root' })
      nested.register({ id: 'child-2', value: 'Child 2', parentId: 'root' })

      nested.select('child-1')

      expect(nested.selected('child-1')).toBe(true)
      expect(nested.selected('child-2')).toBe(false)
      expect(nested.mixed('root')).toBe(true)
      expect(nested.selected('root')).toBe(false)
    })

    it('should set parent to selected when all children selected', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child-1', value: 'Child 1', parentId: 'root' })
      nested.register({ id: 'child-2', value: 'Child 2', parentId: 'root' })

      nested.select('child-1')
      nested.select('child-2')

      expect(nested.selected('root')).toBe(true)
      expect(nested.mixed('root')).toBe(false)
    })

    it('should clear parent mixed state when no children selected', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child-1', value: 'Child 1', parentId: 'root' })
      nested.register({ id: 'child-2', value: 'Child 2', parentId: 'root' })

      nested.select('child-1')
      expect(nested.mixed('root')).toBe(true)

      nested.unselect('child-1')
      expect(nested.mixed('root')).toBe(false)
      expect(nested.selected('root')).toBe(false)
    })

    it('should cascade selection through multiple levels', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child', value: 'Child', parentId: 'root' })
      nested.register({ id: 'grandchild-1', value: 'Grandchild 1', parentId: 'child' })
      nested.register({ id: 'grandchild-2', value: 'Grandchild 2', parentId: 'child' })

      nested.select('grandchild-1')

      expect(nested.selected('grandchild-1')).toBe(true)
      expect(nested.mixed('child')).toBe(true)
      expect(nested.mixed('root')).toBe(true)
    })

    it('should toggle from mixed to unselected', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child-1', value: 'Child 1', parentId: 'root' })
      nested.register({ id: 'child-2', value: 'Child 2', parentId: 'root' })

      nested.select('child-1')
      expect(nested.mixed('root')).toBe(true)

      nested.toggle('root')

      expect(nested.selected('root')).toBe(false)
      expect(nested.selected('child-1')).toBe(false)
      expect(nested.selected('child-2')).toBe(false)
      expect(nested.mixed('root')).toBe(false)
    })
  })
})
