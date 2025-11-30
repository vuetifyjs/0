// Composables
import { createNested } from './index'

// Utilities
import { describe, it, expect } from 'vitest'

describe('useNested', () => {
  describe('registration and hierarchy', () => {
    it('should register nodes without parent as roots', () => {
      const nested = createNested()

      nested.onboard([
        { id: 'root-1', value: 'Root 1' },
        { id: 'root-2', value: 'Root 2' },
      ])

      expect(nested.roots.value).toHaveLength(2)
      expect(nested.isRoot('root-1')).toBe(true)
      expect(nested.isRoot('root-2')).toBe(true)
    })

    it('should register nodes with parent relationship', () => {
      const nested = createNested()

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'child-1', value: 'Child 1', parent: 'root' },
        { id: 'child-2', value: 'Child 2', parent: 'root' },
      ])

      expect(nested.roots.value).toHaveLength(1)
      expect(nested.parents.value.get('child-1')).toBe('root')
      expect(nested.parents.value.get('child-2')).toBe('root')
      expect(nested.childrenMap.value.get('root')).toEqual(['child-1', 'child-2'])
    })

    it('should identify leaf nodes correctly', () => {
      const nested = createNested()

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'folder', value: 'Folder', parent: 'root' },
        { id: 'file', value: 'File', parent: 'folder' },
      ])

      expect(nested.isLeaf('root')).toBe(false)
      expect(nested.isLeaf('folder')).toBe(false)
      expect(nested.isLeaf('file')).toBe(true)
    })

    it('should unregister and clean up relationships', () => {
      const nested = createNested()

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'child', value: 'Child', parent: 'root' },
      ])

      nested.unregister('child')

      expect(nested.has('child')).toBe(false)
      expect(nested.parents.value.has('child')).toBe(false)
      expect(nested.childrenMap.value.get('root')).toEqual([])
    })
  })

  describe('path utilities', () => {
    it('should get path from root to node', () => {
      const nested = createNested()

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'folder', value: 'Folder', parent: 'root' },
        { id: 'subfolder', value: 'Subfolder', parent: 'folder' },
        { id: 'file', value: 'File', parent: 'subfolder' },
      ])

      expect(nested.getPath('file')).toEqual(['root', 'folder', 'subfolder', 'file'])
      expect(nested.getPath('folder')).toEqual(['root', 'folder'])
      expect(nested.getPath('root')).toEqual(['root'])
    })

    it('should get all descendants of a node', () => {
      const nested = createNested()

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'child-1', value: 'Child 1', parent: 'root' },
        { id: 'child-2', value: 'Child 2', parent: 'root' },
        { id: 'grandchild', value: 'Grandchild', parent: 'child-1' },
      ])

      const descendants = nested.getDescendants('root')
      expect(descendants).toContain('child-1')
      expect(descendants).toContain('child-2')
      expect(descendants).toContain('grandchild')
      expect(descendants).toHaveLength(3)
    })

    it('should get all ancestors of a node', () => {
      const nested = createNested()

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'folder', value: 'Folder', parent: 'root' },
        { id: 'file', value: 'File', parent: 'folder' },
      ])

      expect(nested.getAncestors('file')).toEqual(['folder', 'root'])
      expect(nested.getAncestors('folder')).toEqual(['root'])
      expect(nested.getAncestors('root')).toEqual([])
    })
  })

  describe('classic strategy', () => {
    it('should propagate selection down to descendants', () => {
      const nested = createNested({ strategy: 'classic' })

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'child-1', value: 'Child 1', parent: 'root' },
        { id: 'child-2', value: 'Child 2', parent: 'root' },
      ])

      nested.select('root')

      expect(nested.getState('root')).toBe('on')
      expect(nested.getState('child-1')).toBe('on')
      expect(nested.getState('child-2')).toBe('on')
    })

    it('should propagate unselection down to descendants', () => {
      const nested = createNested({ strategy: 'classic' })

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'child-1', value: 'Child 1', parent: 'root' },
        { id: 'child-2', value: 'Child 2', parent: 'root' },
      ])

      nested.select('root')
      nested.unselect('root')

      expect(nested.getState('root')).toBe('off')
      expect(nested.getState('child-1')).toBe('off')
      expect(nested.getState('child-2')).toBe('off')
    })

    it('should calculate parent indeterminate state', () => {
      const nested = createNested({ strategy: 'classic' })

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'child-1', value: 'Child 1', parent: 'root' },
        { id: 'child-2', value: 'Child 2', parent: 'root' },
      ])

      nested.select('child-1')

      expect(nested.getState('child-1')).toBe('on')
      expect(nested.getState('child-2')).toBe('off')
      expect(nested.getState('root')).toBe('indeterminate')
    })

    it('should set parent to on when all children selected', () => {
      const nested = createNested({ strategy: 'classic' })

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'child-1', value: 'Child 1', parent: 'root' },
        { id: 'child-2', value: 'Child 2', parent: 'root' },
      ])

      nested.select('child-1')
      nested.select('child-2')

      expect(nested.getState('root')).toBe('on')
    })

    it('should handle deep hierarchy', () => {
      const nested = createNested({ strategy: 'classic' })

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'level-1', value: 'Level 1', parent: 'root' },
        { id: 'level-2', value: 'Level 2', parent: 'level-1' },
        { id: 'level-3', value: 'Level 3', parent: 'level-2' },
      ])

      nested.select('level-3')

      expect(nested.getState('level-3')).toBe('on')
      expect(nested.getState('level-2')).toBe('on')
      expect(nested.getState('level-1')).toBe('on')
      expect(nested.getState('root')).toBe('on')
    })

    it('should output only leaf nodes', () => {
      const nested = createNested({ strategy: 'classic' })

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'folder', value: 'Folder', parent: 'root' },
        { id: 'file-1', value: 'File 1', parent: 'folder' },
        { id: 'file-2', value: 'File 2', parent: 'folder' },
      ])

      nested.select('root')

      // selectedValues should only contain leaf nodes
      expect(nested.selectedValues.value).toContain('file-1')
      expect(nested.selectedValues.value).toContain('file-2')
      expect(nested.selectedValues.value).not.toContain('folder')
      expect(nested.selectedValues.value).not.toContain('root')
    })
  })

  describe('independent strategy', () => {
    it('should not propagate selection', () => {
      const nested = createNested({ strategy: 'independent' })

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'child-1', value: 'Child 1', parent: 'root' },
        { id: 'child-2', value: 'Child 2', parent: 'root' },
      ])

      nested.select('root')

      expect(nested.getState('root')).toBe('on')
      expect(nested.getState('child-1')).toBe('off')
      expect(nested.getState('child-2')).toBe('off')
    })

    it('should allow selecting any node independently', () => {
      const nested = createNested({ strategy: 'independent' })

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'child', value: 'Child', parent: 'root' },
      ])

      nested.select('child')

      expect(nested.getState('child')).toBe('on')
      expect(nested.getState('root')).toBe('off')
    })
  })

  describe('single-independent strategy', () => {
    it('should only allow one selection', () => {
      const nested = createNested({ strategy: 'single-independent' })

      nested.onboard([
        { id: 'item-1', value: 'Item 1' },
        { id: 'item-2', value: 'Item 2' },
        { id: 'item-3', value: 'Item 3' },
      ])

      nested.select('item-1')
      expect(nested.getState('item-1')).toBe('on')

      nested.select('item-2')
      expect(nested.getState('item-1')).toBe('off')
      expect(nested.getState('item-2')).toBe('on')
    })
  })

  describe('leaf strategy', () => {
    it('should only allow selecting leaf nodes', () => {
      const nested = createNested({ strategy: 'leaf' })

      nested.onboard([
        { id: 'folder', value: 'Folder' },
        { id: 'file-1', value: 'File 1', parent: 'folder' },
        { id: 'file-2', value: 'File 2', parent: 'folder' },
      ])

      // Try to select folder (should be ignored)
      nested.select('folder')
      expect(nested.getState('folder')).toBe('off')

      // Select a leaf (should work)
      nested.select('file-1')
      expect(nested.getState('file-1')).toBe('on')
    })

    it('should allow multi-selection of leaves', () => {
      const nested = createNested({ strategy: 'leaf' })

      nested.onboard([
        { id: 'folder', value: 'Folder' },
        { id: 'file-1', value: 'File 1', parent: 'folder' },
        { id: 'file-2', value: 'File 2', parent: 'folder' },
      ])

      nested.select(['file-1', 'file-2'])

      expect(nested.getState('file-1')).toBe('on')
      expect(nested.getState('file-2')).toBe('on')
    })
  })

  describe('single-leaf strategy', () => {
    it('should only allow one leaf selection', () => {
      const nested = createNested({ strategy: 'single-leaf' })

      nested.onboard([
        { id: 'folder', value: 'Folder' },
        { id: 'file-1', value: 'File 1', parent: 'folder' },
        { id: 'file-2', value: 'File 2', parent: 'folder' },
      ])

      nested.select('file-1')
      expect(nested.getState('file-1')).toBe('on')

      nested.select('file-2')
      expect(nested.getState('file-1')).toBe('off')
      expect(nested.getState('file-2')).toBe('on')
    })
  })

  describe('trunk strategy', () => {
    it('should output highest selected ancestors', () => {
      const nested = createNested({ strategy: 'trunk' })

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'folder-1', value: 'Folder 1', parent: 'root' },
        { id: 'folder-2', value: 'Folder 2', parent: 'root' },
        { id: 'file-1', value: 'File 1', parent: 'folder-1' },
        { id: 'file-2', value: 'File 2', parent: 'folder-1' },
      ])

      // Select only folder-1 (not folder-2, so root is indeterminate)
      nested.select('folder-1')

      // folder-1 should be output (highest fully selected ancestor)
      // root is indeterminate, not 'on', so folder-1 is the highest
      expect(nested.selectedValues.value).toContain('folder-1')
      expect(nested.selectedValues.value).not.toContain('file-1')
      expect(nested.selectedValues.value).not.toContain('file-2')
      expect(nested.selectedValues.value).not.toContain('root')
    })

    it('should output root when all children selected', () => {
      const nested = createNested({ strategy: 'trunk' })

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'folder', value: 'Folder', parent: 'root' },
        { id: 'file', value: 'File', parent: 'folder' },
      ])

      nested.select('root')

      // Root is the highest, should only output root
      expect(nested.selectedValues.value).toEqual(['root'])
    })
  })

  describe('disabled nodes', () => {
    it('should not select disabled nodes', () => {
      const nested = createNested({ strategy: 'classic' })

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'child-1', value: 'Child 1', parent: 'root' },
        { id: 'child-2', value: 'Child 2', parent: 'root', disabled: true },
      ])

      nested.select('root')

      expect(nested.getState('child-1')).toBe('on')
      expect(nested.getState('child-2')).toBe('off')
    })

    it('should exclude disabled from parent state calculation', () => {
      const nested = createNested({ strategy: 'classic' })

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'child-1', value: 'Child 1', parent: 'root' },
        { id: 'child-2', value: 'Child 2', parent: 'root', disabled: true },
      ])

      nested.select('child-1')

      // Parent should be 'on' since the only selectable child is selected
      expect(nested.getState('root')).toBe('on')
    })
  })

  describe('mandatory option', () => {
    it('should prevent deselecting last item', () => {
      const nested = createNested({ strategy: 'independent', mandatory: true })

      nested.onboard([
        { id: 'item-1', value: 'Item 1' },
        { id: 'item-2', value: 'Item 2' },
      ])

      nested.select('item-1')
      expect(nested.getState('item-1')).toBe('on')

      nested.unselect('item-1')
      // Should still be selected
      expect(nested.getState('item-1')).toBe('on')
    })

    it('should allow deselecting when multiple selected', () => {
      const nested = createNested({ strategy: 'independent', mandatory: true })

      nested.onboard([
        { id: 'item-1', value: 'Item 1' },
        { id: 'item-2', value: 'Item 2' },
      ])

      nested.select(['item-1', 'item-2'])
      nested.unselect('item-1')

      expect(nested.getState('item-1')).toBe('off')
      expect(nested.getState('item-2')).toBe('on')
    })
  })

  describe('bulk operations', () => {
    it('should select all leaf nodes', () => {
      const nested = createNested({ strategy: 'classic' })

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'folder', value: 'Folder', parent: 'root' },
        { id: 'file-1', value: 'File 1', parent: 'folder' },
        { id: 'file-2', value: 'File 2', parent: 'folder' },
      ])

      nested.selectAll()

      expect(nested.isAllSelected.value).toBe(true)
      expect(nested.getState('file-1')).toBe('on')
      expect(nested.getState('file-2')).toBe('on')
    })

    it('should unselect all nodes', () => {
      const nested = createNested({ strategy: 'classic' })

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'file-1', value: 'File 1', parent: 'root' },
      ])

      nested.select('root')
      nested.unselectAll()

      expect(nested.isNoneSelected.value).toBe(true)
    })

    it('should toggle all nodes', () => {
      const nested = createNested({ strategy: 'classic' })

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'file-1', value: 'File 1', parent: 'root' },
        { id: 'file-2', value: 'File 2', parent: 'root' },
      ])

      nested.toggleAll()
      expect(nested.isAllSelected.value).toBe(true)

      nested.toggleAll()
      expect(nested.isNoneSelected.value).toBe(true)
    })
  })

  describe('indeterminate state tracking', () => {
    it('should report isIndeterminate correctly', () => {
      const nested = createNested({ strategy: 'classic' })

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'child-1', value: 'Child 1', parent: 'root' },
        { id: 'child-2', value: 'Child 2', parent: 'root' },
      ])

      expect(nested.isNoneSelected.value).toBe(true)
      expect(nested.isIndeterminate.value).toBe(false)

      nested.select('child-1')

      expect(nested.isNoneSelected.value).toBe(false)
      expect(nested.isAllSelected.value).toBe(false)
      expect(nested.isIndeterminate.value).toBe(true)

      nested.select('child-2')

      expect(nested.isAllSelected.value).toBe(true)
      expect(nested.isIndeterminate.value).toBe(false)
    })
  })

  describe('ticket properties', () => {
    it('should provide state computed on ticket', () => {
      const nested = createNested({ strategy: 'classic' })

      const tickets = nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'child', value: 'Child', parent: 'root' },
      ])
      const root = tickets[0]!
      const child = tickets[1]!

      expect(root.state.value).toBe('off')
      expect(child.state.value).toBe('off')

      nested.select('child')

      expect(root.state.value).toBe('on')
      expect(child.state.value).toBe('on')
    })

    it('should provide isLeaf computed on ticket', () => {
      const nested = createNested()

      const tickets = nested.onboard([
        { id: 'folder', value: 'Folder' },
        { id: 'file', value: 'File', parent: 'folder' },
      ])
      const folder = tickets[0]!
      const file = tickets[1]!

      expect(folder.isLeaf.value).toBe(false)
      expect(file.isLeaf.value).toBe(true)
    })

    it('should provide children computed on ticket', () => {
      const nested = createNested()

      const tickets = nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'child-1', value: 'Child 1', parent: 'root' },
        { id: 'child-2', value: 'Child 2', parent: 'root' },
      ])
      const root = tickets[0]!

      expect(root.children.value).toEqual(['child-1', 'child-2'])
    })

    it('should provide select/unselect/toggle methods on ticket', () => {
      const nested = createNested({ strategy: 'independent' })

      const tickets = nested.onboard([
        { id: 'item', value: 'Item' },
      ])
      const item = tickets[0]!

      item.select()
      expect(nested.getState('item')).toBe('on')

      item.unselect()
      expect(nested.getState('item')).toBe('off')

      item.toggle()
      expect(nested.getState('item')).toBe('on')
    })
  })

  describe('edge cases', () => {
    it('should handle empty registry', () => {
      const nested = createNested()

      expect(nested.roots.value).toHaveLength(0)
      expect(nested.isNoneSelected.value).toBe(true)
      expect(nested.isAllSelected.value).toBe(false)
    })

    it('should handle selecting non-existent ID', () => {
      const nested = createNested()

      nested.select('non-existent')
      expect(nested.selectedIds.value.size).toBe(0)
    })

    it('should handle registering with non-existent parent', () => {
      const nested = createNested()

      nested.register({ id: 'child', value: 'Child', parent: 'non-existent' })

      // Should be registered as root since parent doesn't exist
      expect(nested.has('child')).toBe(true)
      expect(nested.isRoot('child')).toBe(true)
    })

    it('should reset all state', () => {
      const nested = createNested({ strategy: 'classic' })

      nested.onboard([
        { id: 'root', value: 'Root' },
        { id: 'child', value: 'Child', parent: 'root' },
      ])

      nested.select('root')
      nested.reset()

      expect(nested.size).toBe(0)
      expect(nested.parents.value.size).toBe(0)
      expect(nested.childrenMap.value.size).toBe(0)
      expect(nested.selectionState.value.size).toBe(0)
    })
  })
})
