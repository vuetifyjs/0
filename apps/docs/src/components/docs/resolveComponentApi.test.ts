import { describe, expect, it } from 'vitest'

import { resolveComponentApi } from './resolveComponentApi'

interface Entry {
  name: string
}

function entry (name: string): Entry {
  return { name }
}

const components: Record<string, Entry> = {
  'Atom': entry('Atom'),
  'Avatar.Root': entry('Avatar.Root'),
  'Avatar.Image': entry('Avatar.Image'),
  'Button.Root': entry('Button.Root'),
  'Button.Group': entry('Button.Group'),
}

describe('resolveComponentApi', () => {
  it('should resolve a standalone component by its exact name', () => {
    expect(resolveComponentApi('Atom', components)?.name).toBe('Atom')
  })

  it('should resolve a bare compound namespace to its Root', () => {
    expect(resolveComponentApi('Avatar', components)?.name).toBe('Avatar.Root')
    expect(resolveComponentApi('Button', components)?.name).toBe('Button.Root')
  })

  it('should keep an explicit part lookup', () => {
    expect(resolveComponentApi('Button.Group', components)?.name).toBe('Button.Group')
    expect(resolveComponentApi('Avatar.Image', components)?.name).toBe('Avatar.Image')
  })

  it('should return undefined when nothing matches', () => {
    expect(resolveComponentApi('Missing', components)).toBeUndefined()
  })
})
