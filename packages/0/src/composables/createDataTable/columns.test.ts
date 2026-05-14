import { describe, expect, it } from 'vitest'

import { computeDepth, extractLeaves, resolveHeaders } from './columns'

describe('columns', () => {
  describe('extractLeaves', () => {
    it('should return all columns when flat', () => {
      const columns = [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
      ]
      expect(extractLeaves(columns)).toEqual(columns)
    })

    it('should extract leaf columns from nested tree', () => {
      const columns = [
        { id: 'name', title: 'Name' },
        {
          id: 'contact',
          title: 'Contact',
          children: [
            { id: 'email', title: 'Email' },
            { id: 'phone', title: 'Phone' },
          ],
        },
      ]
      expect(extractLeaves(columns)).toEqual([
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Phone' },
      ])
    })

    it('should handle deeply nested columns', () => {
      const columns = [
        {
          id: 'group',
          children: [
            {
              id: 'subgroup',
              children: [
                { id: 'leaf', title: 'Leaf' },
              ],
            },
          ],
        },
      ]
      expect(extractLeaves(columns)).toEqual([
        { id: 'leaf', title: 'Leaf' },
      ])
    })

    it('should return empty array for empty input', () => {
      expect(extractLeaves([])).toEqual([])
    })
  })

  describe('computeDepth', () => {
    it('should return 0 for flat columns', () => {
      const columns = [
        { id: 'name' },
        { id: 'email' },
      ]
      expect(computeDepth(columns)).toBe(0)
    })

    it('should return 1 for one level of nesting', () => {
      const columns = [
        { id: 'name' },
        { id: 'contact', children: [
          { id: 'email' },
          { id: 'phone' },
        ] },
      ]
      expect(computeDepth(columns)).toBe(1)
    })

    it('should return 2 for two levels of nesting', () => {
      const columns = [
        { id: 'group', children: [
          { id: 'sub', children: [
            { id: 'leaf' },
          ] },
        ] },
      ]
      expect(computeDepth(columns)).toBe(2)
    })

    it('should return max depth across branches', () => {
      const columns = [
        { id: 'shallow', children: [{ id: 'a' }] },
        { id: 'deep', children: [
          { id: 'mid', children: [{ id: 'b' }] },
        ] },
      ]
      expect(computeDepth(columns)).toBe(2)
    })
  })

  describe('resolveHeaders', () => {
    it('should return single row for flat columns', () => {
      const columns = [
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
      ]
      const headers = resolveHeaders(columns)
      expect(headers).toEqual([[
        { id: 'name', title: 'Name', colspan: 1, rowspan: 1, depth: 0 },
        { id: 'email', title: 'Email', colspan: 1, rowspan: 1, depth: 0 },
      ]])
    })

    it('should resolve nested columns into 2D grid', () => {
      const columns = [
        { id: 'name', title: 'Name' },
        {
          id: 'contact',
          title: 'Contact',
          children: [
            { id: 'email', title: 'Email' },
            { id: 'phone', title: 'Phone' },
          ],
        },
      ]
      const headers = resolveHeaders(columns)
      expect(headers).toEqual([
        [
          { id: 'name', title: 'Name', colspan: 1, rowspan: 2, depth: 0 },
          { id: 'contact', title: 'Contact', colspan: 2, rowspan: 1, depth: 0 },
        ],
        [
          { id: 'email', title: 'Email', colspan: 1, rowspan: 1, depth: 1 },
          { id: 'phone', title: 'Phone', colspan: 1, rowspan: 1, depth: 1 },
        ],
      ])
    })

    it('should handle deeply nested columns', () => {
      const columns = [
        { id: 'a', title: 'A' },
        {
          id: 'g1',
          title: 'G1',
          children: [
            {
              id: 'g2',
              title: 'G2',
              children: [
                { id: 'b', title: 'B' },
                { id: 'c', title: 'C' },
              ],
            },
          ],
        },
      ]
      const headers = resolveHeaders(columns)
      expect(headers).toHaveLength(3)
      expect(headers[0]).toEqual([
        { id: 'a', title: 'A', colspan: 1, rowspan: 3, depth: 0 },
        { id: 'g1', title: 'G1', colspan: 2, rowspan: 1, depth: 0 },
      ])
      expect(headers[1]).toEqual([
        { id: 'g2', title: 'G2', colspan: 2, rowspan: 1, depth: 1 },
      ])
      expect(headers[2]).toEqual([
        { id: 'b', title: 'B', colspan: 1, rowspan: 1, depth: 2 },
        { id: 'c', title: 'C', colspan: 1, rowspan: 1, depth: 2 },
      ])
    })

    it('should return empty array for empty input', () => {
      expect(resolveHeaders([])).toEqual([])
    })

    it('should default missing title to empty string', () => {
      const columns = [
        { id: 'noTitle' },
        {
          id: 'group',
          children: [{ id: 'leaf' }],
        },
      ]
      const headers = resolveHeaders(columns)
      expect(headers[0]).toEqual([
        { id: 'noTitle', title: '', colspan: 1, rowspan: 2, depth: 0 },
        { id: 'group', title: '', colspan: 1, rowspan: 1, depth: 0 },
      ])
    })
  })
})
