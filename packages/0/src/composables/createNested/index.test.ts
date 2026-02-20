// Utilities
import { describe, expect, it, vi } from 'vitest'

// Types
import type { NestedRegistration } from './types'

// Composables
import { createNested, multipleOpenStrategy, singleOpenStrategy } from './index'

describe('createNested', () => {
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

      nested.flip('node')
      expect(nested.opened('node')).toBe(true)

      nested.flip('node')
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

      ticket.flip()
      expect(nested.opened('node')).toBe(true)
    })
  })

  describe('active state management', () => {
    it('should activate single node by ID', () => {
      const nested = createNested()

      nested.register({ id: 'node', value: 'Node' })
      nested.activate('node')

      expect(nested.activated('node')).toBe(true)
      expect(nested.activeIds.has('node')).toBe(true)
    })

    it('should activate array of nodes', () => {
      const nested = createNested({ active: 'multiple' })

      nested.register({ id: 'node-1', value: 'Node 1' })
      nested.register({ id: 'node-2', value: 'Node 2' })
      nested.activate(['node-1', 'node-2'])

      expect(nested.activated('node-1')).toBe(true)
      expect(nested.activated('node-2')).toBe(true)
    })

    it('should deactivate single node by ID', () => {
      const nested = createNested()

      nested.register({ id: 'node', value: 'Node' })
      nested.activate('node')
      nested.deactivate('node')

      expect(nested.activated('node')).toBe(false)
    })

    it('should deactivate all nodes', () => {
      const nested = createNested({ active: 'multiple' })

      nested.register({ id: 'node-1', value: 'Node 1' })
      nested.register({ id: 'node-2', value: 'Node 2' })
      nested.activate(['node-1', 'node-2'])

      nested.deactivateAll()

      expect(nested.activeIds.size).toBe(0)
      expect(nested.activated('node-1')).toBe(false)
      expect(nested.activated('node-2')).toBe(false)
    })

    it('should enforce single mode by default', () => {
      const nested = createNested()

      nested.register({ id: 'node-1', value: 'Node 1' })
      nested.register({ id: 'node-2', value: 'Node 2' })

      nested.activate('node-1')
      nested.activate('node-2')

      expect(nested.activated('node-1')).toBe(false)
      expect(nested.activated('node-2')).toBe(true)
      expect(nested.activeIds.size).toBe(1)
    })

    it('should allow multiple active in multiple mode', () => {
      const nested = createNested({ active: 'multiple' })

      nested.register({ id: 'node-1', value: 'Node 1' })
      nested.register({ id: 'node-2', value: 'Node 2' })

      nested.activate('node-1')
      nested.activate('node-2')

      expect(nested.activated('node-1')).toBe(true)
      expect(nested.activated('node-2')).toBe(true)
      expect(nested.activeIds.size).toBe(2)
    })

    it('should compute activeItems', () => {
      const nested = createNested()

      nested.register({ id: 'node', value: 'Node' })
      nested.activate('node')

      expect(nested.activeItems.value.size).toBe(1)
    })

    it('should compute activeIndexes', () => {
      const nested = createNested()

      nested.register({ id: 'node-1', value: 'Node 1' })
      nested.register({ id: 'node-2', value: 'Node 2' })
      nested.activate('node-1')

      expect(nested.activeIndexes.value.size).toBe(1)
    })

    it('should provide isActive ref on ticket', () => {
      const nested = createNested()

      const ticket = nested.register({ id: 'node', value: 'Node' })

      expect(ticket.isActive.value).toBe(false)
      nested.activate('node')
      expect(ticket.isActive.value).toBe(true)
    })

    it('should provide ticket-level activate/deactivate methods', () => {
      const nested = createNested()

      const ticket = nested.register({ id: 'node', value: 'Node' })

      ticket.activate()
      expect(nested.activated('node')).toBe(true)

      ticket.deactivate()
      expect(nested.activated('node')).toBe(false)
    })

    it('should set initial active state via registration', () => {
      const nested = createNested()

      nested.register({ id: 'node', value: 'Node', active: true })

      expect(nested.activated('node')).toBe(true)
    })

    it('should clear active state on unregister', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child', value: 'Child', parentId: 'root' })
      nested.activate('child')

      nested.unregister('child')

      expect(nested.activated('child')).toBe(false)
      expect(nested.activeIds.size).toBe(0)
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

  describe('open option', () => {
    it('should allow multiple nodes open with open: multiple (default)', () => {
      const nested = createNested({ open: 'multiple' })

      nested.register({ id: 'node-1', value: 'Node 1' })
      nested.register({ id: 'node-2', value: 'Node 2' })

      nested.open('node-1')
      nested.open('node-2')

      expect(nested.opened('node-1')).toBe(true)
      expect(nested.opened('node-2')).toBe(true)
    })

    it('should close others with open: single (accordion)', () => {
      const nested = createNested({ open: 'single' })

      nested.register({ id: 'node-1', value: 'Node 1' })
      nested.register({ id: 'node-2', value: 'Node 2' })

      nested.open('node-1')
      expect(nested.opened('node-1')).toBe(true)

      nested.open('node-2')
      expect(nested.opened('node-1')).toBe(false)
      expect(nested.opened('node-2')).toBe(true)
    })

    it('should default to multiple when no option provided', () => {
      const nested = createNested()

      nested.register({ id: 'node-1', value: 'Node 1' })
      nested.register({ id: 'node-2', value: 'Node 2' })

      nested.open('node-1')
      nested.open('node-2')

      expect(nested.opened('node-1')).toBe(true)
      expect(nested.opened('node-2')).toBe(true)
    })
  })

  describe('selection option', () => {
    describe('selection: cascade (default)', () => {
      it('should select all descendants when selecting parent', () => {
        const nested = createNested({ selection: 'cascade' })

        nested.register({ id: 'root', value: 'Root' })
        nested.register({ id: 'child-1', value: 'Child 1', parentId: 'root' })
        nested.register({ id: 'child-2', value: 'Child 2', parentId: 'root' })

        nested.select('root')

        expect(nested.selected('root')).toBe(true)
        expect(nested.selected('child-1')).toBe(true)
        expect(nested.selected('child-2')).toBe(true)
      })

      it('should set parent to mixed when some children selected', () => {
        const nested = createNested({ selection: 'cascade' })

        nested.register({ id: 'root', value: 'Root' })
        nested.register({ id: 'child-1', value: 'Child 1', parentId: 'root' })
        nested.register({ id: 'child-2', value: 'Child 2', parentId: 'root' })

        nested.select('child-1')

        expect(nested.selected('child-1')).toBe(true)
        expect(nested.mixed('root')).toBe(true)
      })
    })

    describe('selection: independent', () => {
      it('should only select the targeted node', () => {
        const nested = createNested({ selection: 'independent' })

        nested.register({ id: 'root', value: 'Root' })
        nested.register({ id: 'child-1', value: 'Child 1', parentId: 'root' })
        nested.register({ id: 'child-2', value: 'Child 2', parentId: 'root' })

        nested.select('root')

        expect(nested.selected('root')).toBe(true)
        expect(nested.selected('child-1')).toBe(false)
        expect(nested.selected('child-2')).toBe(false)
      })

      it('should not affect parent when selecting child', () => {
        const nested = createNested({ selection: 'independent' })

        nested.register({ id: 'root', value: 'Root' })
        nested.register({ id: 'child', value: 'Child', parentId: 'root' })

        nested.select('child')

        expect(nested.selected('child')).toBe(true)
        expect(nested.selected('root')).toBe(false)
        expect(nested.mixed('root')).toBe(false)
      })

      it('should toggle independently', () => {
        const nested = createNested({ selection: 'independent' })

        nested.register({ id: 'root', value: 'Root' })
        nested.register({ id: 'child', value: 'Child', parentId: 'root' })

        nested.toggle('root')
        expect(nested.selected('root')).toBe(true)
        expect(nested.selected('child')).toBe(false)

        nested.toggle('root')
        expect(nested.selected('root')).toBe(false)
      })
    })

    describe('selection: leaf', () => {
      it('should only select leaf nodes directly', () => {
        const nested = createNested({ selection: 'leaf' })

        nested.register({ id: 'root', value: 'Root' })
        nested.register({ id: 'child', value: 'Child', parentId: 'root' })

        nested.select('child')

        expect(nested.selected('child')).toBe(true)
      })

      it('should select all leaf descendants when selecting parent', () => {
        const nested = createNested({ selection: 'leaf' })

        nested.register({ id: 'root', value: 'Root' })
        nested.register({ id: 'branch', value: 'Branch', parentId: 'root' })
        nested.register({ id: 'leaf-1', value: 'Leaf 1', parentId: 'branch' })
        nested.register({ id: 'leaf-2', value: 'Leaf 2', parentId: 'branch' })

        nested.select('root')

        // Parent nodes should NOT be selected
        expect(nested.selected('root')).toBe(false)
        expect(nested.selected('branch')).toBe(false)
        // Leaf nodes SHOULD be selected
        expect(nested.selected('leaf-1')).toBe(true)
        expect(nested.selected('leaf-2')).toBe(true)
      })

      it('should unselect all leaf descendants when unselecting parent', () => {
        const nested = createNested({ selection: 'leaf' })

        nested.register({ id: 'root', value: 'Root' })
        nested.register({ id: 'leaf-1', value: 'Leaf 1', parentId: 'root' })
        nested.register({ id: 'leaf-2', value: 'Leaf 2', parentId: 'root' })

        nested.select('root')
        expect(nested.selected('leaf-1')).toBe(true)
        expect(nested.selected('leaf-2')).toBe(true)

        nested.unselect('root')
        expect(nested.selected('leaf-1')).toBe(false)
        expect(nested.selected('leaf-2')).toBe(false)
      })

      it('should toggle all leaf descendants when toggling parent', () => {
        const nested = createNested({ selection: 'leaf' })

        nested.register({ id: 'root', value: 'Root' })
        nested.register({ id: 'leaf-1', value: 'Leaf 1', parentId: 'root' })
        nested.register({ id: 'leaf-2', value: 'Leaf 2', parentId: 'root' })

        nested.toggle('root')
        expect(nested.selected('leaf-1')).toBe(true)
        expect(nested.selected('leaf-2')).toBe(true)

        nested.toggle('root')
        expect(nested.selected('leaf-1')).toBe(false)
        expect(nested.selected('leaf-2')).toBe(false)
      })
    })
  })

  describe('open strategies (deprecated)', () => {
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

    it('should prioritize openStrategy over open option', () => {
      const nested = createNested({
        open: 'multiple',
        openStrategy: singleOpenStrategy,
      })

      nested.register({ id: 'node-1', value: 'Node 1' })
      nested.register({ id: 'node-2', value: 'Node 2' })

      nested.open('node-1')
      nested.open('node-2')

      // singleOpenStrategy should take precedence
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

describe('edge cases', () => {
  describe('empty tree', () => {
    it('should return empty roots and leaves on empty tree', () => {
      const nested = createNested()

      expect(nested.roots.value).toEqual([])
      expect(nested.leaves.value).toEqual([])
    })

    it('should return empty array for getDescendants on non-existent node', () => {
      const nested = createNested()

      expect(nested.getDescendants('non-existent')).toEqual([])
    })

    it('should return path containing only the ID for non-existent node', () => {
      const nested = createNested()

      // getPath walks parents map; for unknown ID, parents.get returns undefined
      // so path is just [id] - this documents current behavior
      expect(nested.getPath('non-existent')).toEqual(['non-existent'])
    })
  })

  describe('validation in open/close/flip', () => {
    it('should not call strategy for non-existent IDs on open', () => {
      const onOpenSpy = vi.fn()
      const nested = createNested({
        openStrategy: { onOpen: onOpenSpy },
      })

      nested.open('non-existent')

      expect(onOpenSpy).not.toHaveBeenCalled()
    })

    it('should not call strategy for non-existent IDs on close', () => {
      const onCloseSpy = vi.fn()
      const nested = createNested({
        openStrategy: { onClose: onCloseSpy },
      })

      nested.close('non-existent')

      expect(onCloseSpy).not.toHaveBeenCalled()
    })

    it('should skip non-existent IDs in flip', () => {
      const nested = createNested()

      nested.register({ id: 'node', value: 'Node' })

      // Should not throw, just skip non-existent
      nested.flip(['node', 'non-existent'])

      expect(nested.opened('node')).toBe(true)
    })
  })

  describe('memory leak prevention', () => {
    it('should clear open state for all descendants when orphaning', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child', value: 'Child', parentId: 'root' })
      nested.register({ id: 'grandchild', value: 'Grandchild', parentId: 'child' })

      nested.open(['root', 'child', 'grandchild'])
      expect(nested.openedIds.size).toBe(3)

      // Orphan children (cascade=false is default)
      nested.unregister('root')

      // All descendants should have open state cleared
      expect(nested.openedIds.has('root')).toBe(false)
      expect(nested.openedIds.has('child')).toBe(false)
      expect(nested.openedIds.has('grandchild')).toBe(false)
    })

    it('should orphan children correctly without memory leak', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child', value: 'Child', parentId: 'root' })
      nested.register({ id: 'grandchild', value: 'Grandchild', parentId: 'child' })

      nested.unregister('child')

      // grandchild should be orphaned (parent undefined)
      expect(nested.parents.get('grandchild')).toBeUndefined()
      // grandchild should still exist
      expect(nested.has('grandchild')).toBe(true)
    })
  })

  describe('cascading selection edge cases', () => {
    it('should not affect state when selecting non-existent node', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child', value: 'Child', parentId: 'root' })

      nested.select('non-existent')

      expect(nested.selectedIds.size).toBe(0)
      expect(nested.mixed('root')).toBe(false)
    })

    it('should handle selection after orphaning', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })
      nested.register({ id: 'child', value: 'Child', parentId: 'root' })

      nested.select('child')
      expect(nested.selected('child')).toBe(true)

      // Orphan child
      nested.unregister('root')

      // Selection should persist on orphaned node
      expect(nested.selected('child')).toBe(true)
    })
  })

  describe('offboard edge cases', () => {
    it('should handle offboard with non-existent IDs', () => {
      const nested = createNested()

      nested.register({ id: 'root', value: 'Root' })

      // Should not throw
      nested.offboard(['root', 'non-existent'])

      expect(nested.has('root')).toBe(false)
      expect(nested.size).toBe(0)
    })

    it('should handle offboard with cascade on some nodes', () => {
      const nested = createNested()

      nested.register({ id: 'root-1', value: 'Root 1' })
      nested.register({ id: 'child-1', value: 'Child 1', parentId: 'root-1' })
      nested.register({ id: 'root-2', value: 'Root 2' })

      nested.offboard(['root-1'], true)

      expect(nested.has('root-1')).toBe(false)
      expect(nested.has('child-1')).toBe(false)
      expect(nested.has('root-2')).toBe(true)
    })
  })
})

describe('createNestedContext', () => {
  it('should create context trinity with default namespace', async () => {
    const { createNestedContext } = await import('./index')

    const [useNestedTest, provideNestedTest, defaultNested] = createNestedContext()

    expect(useNestedTest).toBeInstanceOf(Function)
    expect(provideNestedTest).toBeInstanceOf(Function)
    expect(defaultNested).toBeDefined()
    expect(defaultNested.register).toBeInstanceOf(Function)
  })

  it('should create independent context instances', async () => {
    const { createNestedContext } = await import('./index')

    const [, , context1] = createNestedContext({ namespace: 'test:nested-1' })
    const [, , context2] = createNestedContext({ namespace: 'test:nested-2' })

    context1.register({ id: 'node-1', value: 'Node 1' })

    expect(context1.size).toBe(1)
    expect(context2.size).toBe(0)
  })

  it('should pass options to nested instance', async () => {
    const { createNestedContext, singleOpenStrategy } = await import('./index')

    const [, , context] = createNestedContext({
      namespace: 'test:nested-options',
      openStrategy: singleOpenStrategy,
    })

    context.register({ id: 'node-1', value: 'Node 1' })
    context.register({ id: 'node-2', value: 'Node 2' })

    context.open('node-1')
    context.open('node-2')

    // Single open strategy should close node-1 when node-2 opens
    expect(context.opened('node-1')).toBe(false)
    expect(context.opened('node-2')).toBe(true)
  })
})

describe('useNested', () => {
  it('should throw when context not provided', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { useNested } = await import('./index')

    expect(() => {
      useNested('non-existent:namespace')
    }).toThrow()

    warnSpy.mockRestore()
  })
})
