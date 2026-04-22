import { describe, expect, it } from 'vitest'

import { computeDepth, extractLeaves, resolveHeaders } from './columns'

describe('columns', () => {
  describe('extractLeaves', () => {
    it('returns all columns when flat', () => {
      const columns = [
        { key: 'name', title: 'Name' },
        { key: 'email', title: 'Email' },
      ]
      expect(extractLeaves(columns)).toEqual(columns)
    })

    it('extracts leaf columns from nested tree', () => {
      const columns = [
        { key: 'name', title: 'Name' },
        {
          key: 'contact',
          title: 'Contact',
          children: [
            { key: 'email', title: 'Email' },
            { key: 'phone', title: 'Phone' },
          ],
        },
      ]
      expect(extractLeaves(columns)).toEqual([
        { key: 'name', title: 'Name' },
        { key: 'email', title: 'Email' },
        { key: 'phone', title: 'Phone' },
      ])
    })

    it('handles deeply nested columns', () => {
      const columns = [
        {
          key: 'group',
          children: [
            {
              key: 'subgroup',
              children: [
                { key: 'leaf', title: 'Leaf' },
              ],
            },
          ],
        },
      ]
      expect(extractLeaves(columns)).toEqual([
        { key: 'leaf', title: 'Leaf' },
      ])
    })

    it('returns empty array for empty input', () => {
      expect(extractLeaves([])).toEqual([])
    })
  })

  describe('computeDepth', () => {
    it('returns 0 for flat columns', () => {
      const columns = [
        { key: 'name' },
        { key: 'email' },
      ]
      expect(computeDepth(columns)).toBe(0)
    })

    it('returns 1 for one level of nesting', () => {
      const columns = [
        { key: 'name' },
        { key: 'contact', children: [
          { key: 'email' },
          { key: 'phone' },
        ] },
      ]
      expect(computeDepth(columns)).toBe(1)
    })

    it('returns 2 for two levels of nesting', () => {
      const columns = [
        { key: 'group', children: [
          { key: 'sub', children: [
            { key: 'leaf' },
          ] },
        ] },
      ]
      expect(computeDepth(columns)).toBe(2)
    })

    it('returns max depth across branches', () => {
      const columns = [
        { key: 'shallow', children: [{ key: 'a' }] },
        { key: 'deep', children: [
          { key: 'mid', children: [{ key: 'b' }] },
        ] },
      ]
      expect(computeDepth(columns)).toBe(2)
    })
  })

  describe('resolveHeaders', () => {
    it('returns single row for flat columns', () => {
      const columns = [
        { key: 'name', title: 'Name' },
        { key: 'email', title: 'Email' },
      ]
      const headers = resolveHeaders(columns)
      expect(headers).toEqual([[
        { key: 'name', title: 'Name', colspan: 1, rowspan: 1, depth: 0 },
        { key: 'email', title: 'Email', colspan: 1, rowspan: 1, depth: 0 },
      ]])
    })

    it('resolves nested columns into 2D grid', () => {
      const columns = [
        { key: 'name', title: 'Name' },
        {
          key: 'contact',
          title: 'Contact',
          children: [
            { key: 'email', title: 'Email' },
            { key: 'phone', title: 'Phone' },
          ],
        },
      ]
      const headers = resolveHeaders(columns)
      expect(headers).toEqual([
        [
          { key: 'name', title: 'Name', colspan: 1, rowspan: 2, depth: 0 },
          { key: 'contact', title: 'Contact', colspan: 2, rowspan: 1, depth: 0 },
        ],
        [
          { key: 'email', title: 'Email', colspan: 1, rowspan: 1, depth: 1 },
          { key: 'phone', title: 'Phone', colspan: 1, rowspan: 1, depth: 1 },
        ],
      ])
    })

    it('handles deeply nested columns', () => {
      const columns = [
        { key: 'a', title: 'A' },
        {
          key: 'g1',
          title: 'G1',
          children: [
            {
              key: 'g2',
              title: 'G2',
              children: [
                { key: 'b', title: 'B' },
                { key: 'c', title: 'C' },
              ],
            },
          ],
        },
      ]
      const headers = resolveHeaders(columns)
      expect(headers).toHaveLength(3)
      expect(headers[0]).toEqual([
        { key: 'a', title: 'A', colspan: 1, rowspan: 3, depth: 0 },
        { key: 'g1', title: 'G1', colspan: 2, rowspan: 1, depth: 0 },
      ])
      expect(headers[1]).toEqual([
        { key: 'g2', title: 'G2', colspan: 2, rowspan: 1, depth: 1 },
      ])
      expect(headers[2]).toEqual([
        { key: 'b', title: 'B', colspan: 1, rowspan: 1, depth: 2 },
        { key: 'c', title: 'C', colspan: 1, rowspan: 1, depth: 2 },
      ])
    })

    it('returns empty array for empty input', () => {
      expect(resolveHeaders([])).toEqual([])
    })
  })
})
