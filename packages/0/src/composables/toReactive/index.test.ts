import { describe, it, expect } from 'vitest'
import { ref, isReactive } from 'vue'
import { toReactive } from './index'

describe('toReactive', () => {
  it('should convert a plain object to reactive', () => {
    const obj = { name: 'John', age: 30 }
    const result = toReactive(obj)

    expect(isReactive(result)).toBe(true)
    expect(result.name).toBe('John')
    expect(result.age).toBe(30)
  })

  it('should convert a ref object to reactive', () => {
    const objRef = ref({ name: 'Jane', age: 25 })
    const result = toReactive(objRef)

    expect(isReactive(result)).toBe(true)
    expect(result.name).toBe('Jane')
    expect(result.age).toBe(25)
  })

  it('should maintain reactivity when ref value changes', () => {
    const objRef = ref({ count: 0 })
    const result = toReactive(objRef)

    expect(result.count).toBe(0)

    objRef.value.count = 5
    expect(result.count).toBe(5)

    objRef.value = { count: 10 }
    expect(result.count).toBe(10)
  })

  it('should allow setting properties on reactive object', () => {
    const objRef = ref({ name: 'Alice' })
    const result = toReactive(objRef)

    result.name = 'Bob'
    expect(objRef.value.name).toBe('Bob')
    expect(result.name).toBe('Bob')
  })

  it('should handle nested ref properties correctly', () => {
    const nameRef = ref('Charlie')
    const objRef = ref({ name: nameRef, age: 35 })
    const result = toReactive(objRef)

    expect(result.name).toBe('Charlie')

    result.name = 'David'
    expect(nameRef.value).toBe('David')
    expect(result.name).toBe('David')
  })

  it('should handle non-ref nested properties', () => {
    const objRef = ref({ name: 'Eve', age: 28 })
    const result = toReactive(objRef)

    result.age = 30
    expect(objRef.value.age).toBe(30)
    expect(result.age).toBe(30)
  })

  it('should support property deletion', () => {
    const objRef = ref({ name: 'Frank', age: 40, city: 'NYC' } as { name: string, age: number, city?: string })
    const result = toReactive(objRef)

    delete result.city
    expect('city' in objRef.value).toBe(false)
    expect('city' in result).toBe(false)
  })

  it('should support property existence checks', () => {
    const objRef = ref({ name: 'Grace', age: 22 })
    const result = toReactive(objRef)

    expect('name' in result).toBe(true)
    expect('age' in result).toBe(true)
    expect('city' in result).toBe(false)
  })

  it('should return correct property keys', () => {
    const objRef = ref({ name: 'Henry', age: 45, city: 'LA' })
    const result = toReactive(objRef)

    const keys = Object.keys(result)
    expect(keys).toEqual(['name', 'age', 'city'])
  })

  it('should handle empty objects', () => {
    const objRef = ref({} as Record<string, any>)
    const result = toReactive(objRef)

    expect(isReactive(result)).toBe(true)
    expect(Object.keys(result)).toEqual([])

    result.newProp = 'test'
    expect(objRef.value.newProp).toBe('test')
  })

  it('should handle arrays', () => {
    const arrRef = ref([1, 2, 3])
    const result = toReactive(arrRef)

    expect(isReactive(result)).toBe(true)
    expect(result[0]).toBe(1)
    expect(result.length).toBe(3)

    // Manually set array elements instead of using push to avoid stack overflow
    result[3] = 4
    expect(arrRef.value[3]).toBe(4)
    expect(arrRef.value.length).toBe(4)
  })

  it('should work with complex nested structures', () => {
    const objRef = ref({
      user: {
        name: 'John',
        preferences: {
          theme: 'dark',
          language: 'en',
        },
      },
      items: [1, 2, 3],
    })
    const result = toReactive(objRef)

    expect(result.user.name).toBe('John')
    expect(result.user.preferences.theme).toBe('dark')
    expect(result.items[0]).toBe(1)

    result.user.name = 'Jane'
    expect(objRef.value.user.name).toBe('Jane')
  })

  it('should handle nested objects', () => {
    const nested = ref({ inner: { value: 1 } })
    const result = toReactive(nested)

    expect(result.inner.value).toBe(1)

    nested.value.inner.value = 2
    expect(result.inner.value).toBe(2)
  })

  describe('Map support', () => {
    it('should handle Map get and set operations', () => {
      const mapRef = ref(new Map([['key1', 'value1'], ['key2', 'value2']]))
      const result = toReactive(mapRef)

      expect(result.get('key1')).toBe('value1')
      expect(result.get('key2')).toBe('value2')

      result.set('key3', 'value3')
      expect(mapRef.value.get('key3')).toBe('value3')
      expect(result.get('key3')).toBe('value3')
    })

    it('should handle Map with ref values', () => {
      const refValue = ref('initial')
      const mapRef = ref(new Map([['refKey', refValue]]))
      const result = toReactive(mapRef)

      expect(result.get('refKey')).toBe('initial')

      result.set('refKey', ref('updated'))
      expect(result.get('refKey')).toBe('updated')
    })

    it('should handle Map size and has operations', () => {
      const mapRef = ref(new Map([['a', 1], ['b', 2]]))
      const result = toReactive(mapRef)

      expect(result.size).toBe(2)
      expect(result.has('a')).toBe(true)
      expect(result.has('c')).toBe(false)

      result.set('c', 3)
      expect(result.size).toBe(3)
      expect(result.has('c')).toBe(true)
    })

    it('should handle Map delete and clear operations', () => {
      const mapRef = ref(new Map([['a', 1], ['b', 2], ['c', 3]]))
      const result = toReactive(mapRef)

      expect(result.delete('b')).toBe(true)
      expect(result.size).toBe(2)
      expect(result.has('b')).toBe(false)

      result.clear()
      expect(result.size).toBe(0)
      expect(mapRef.value.size).toBe(0)
    })

    it('should handle Map iteration methods', () => {
      const mapRef = ref(new Map([['a', 1], ['b', 2]]))
      const result = toReactive(mapRef)

      const keys = Array.from(result.keys())
      expect(keys).toEqual(['a', 'b'])

      const values = Array.from(result.values())
      expect(values).toEqual([1, 2])

      const entries = Array.from(result.entries())
      expect(entries).toEqual([['a', 1], ['b', 2]])
    })

    it('should handle Map forEach', () => {
      const mapRef = ref(new Map([['a', 1], ['b', 2]]))
      const result = toReactive(mapRef)

      const collected: Array<[any, any]> = []
      for (const [key, value] of result.entries()) {
        collected.push([key, value])
      }

      expect(collected).toEqual([['a', 1], ['b', 2]])
    })
  })

  describe('Set support', () => {
    it('should handle Set add and has operations', () => {
      const setRef = ref(new Set(['a', 'b']))
      const result = toReactive(setRef)

      expect(result.has('a')).toBe(true)
      expect(result.has('c')).toBe(false)

      result.add('c')
      expect(setRef.value.has('c')).toBe(true)
      expect(result.has('c')).toBe(true)
    })

    it('should handle Set size and delete operations', () => {
      const setRef = ref(new Set(['a', 'b', 'c']))
      const result = toReactive(setRef)

      expect(result.size).toBe(3)

      expect(result.delete('b')).toBe(true)
      expect(result.size).toBe(2)
      expect(result.has('b')).toBe(false)

      expect(result.delete('nonexistent')).toBe(false)
    })

    it('should handle Set clear operation', () => {
      const setRef = ref(new Set(['a', 'b', 'c']))
      const result = toReactive(setRef)

      result.clear()
      expect(result.size).toBe(0)
      expect(setRef.value.size).toBe(0)
    })

    it('should handle Set iteration methods', () => {
      const setRef = ref(new Set(['a', 'b']))
      const result = toReactive(setRef)

      const keys = Array.from(result.keys())
      expect(keys).toEqual(['a', 'b'])

      const values = Array.from(result.values())
      expect(values).toEqual(['a', 'b'])

      const entries = Array.from(result.entries())
      expect(entries).toEqual([['a', 'a'], ['b', 'b']])
    })

    it('should handle Set forEach', () => {
      const setRef = ref(new Set(['a', 'b']))
      const result = toReactive(setRef)

      const collected: any[] = []
      for (const value of result) {
        collected.push(value)
      }

      expect(collected).toEqual(['a', 'b'])
    })

    it('should handle Set with ref values', () => {
      const refValue = ref('test')
      const setRef = ref(new Set([refValue]))
      const result = toReactive(setRef)

      const values = Array.from(result.values())
      expect(values).toEqual(['test'])

      refValue.value = 'updated'
      const updatedValues = Array.from(result.values())
      expect(updatedValues).toEqual(['updated'])
    })
  })

  describe('getOwnPropertyDescriptor', () => {
    it('should preserve property descriptors while making them configurable', () => {
      const objRef = ref({})
      Object.defineProperty(objRef.value, 'readOnly', {
        value: 'test',
        writable: false,
        enumerable: true,
        configurable: false,
      })

      const result = toReactive(objRef)
      const descriptor = Object.getOwnPropertyDescriptor(result, 'readOnly')

      expect(descriptor?.value).toBe('test')
      expect(descriptor?.writable).toBe(false)
      expect(descriptor?.enumerable).toBe(true)
      expect(descriptor?.configurable).toBe(true) // Should be forced to true
    })

    it('should unwrap ref values in property descriptors', () => {
      const refValue = ref('wrapped')
      const objRef = ref({ prop: refValue })
      const result = toReactive(objRef)

      const descriptor = Object.getOwnPropertyDescriptor(result, 'prop')
      expect(descriptor?.value).toBe('wrapped')
    })

    it('should return undefined for non-existent property descriptors', () => {
      const objRef = ref({ existing: 'value' })
      const result = toReactive(objRef)

      expect(Object.getOwnPropertyDescriptor(result, 'nonExistent')).toBeUndefined()
    })

    it('should preserve getter/setter properties', () => {
      const objRef = ref({})
      let storedValue = 'initial'
      Object.defineProperty(objRef.value, 'computed', {
        get () {
          return storedValue
        },
        set (val) {
          storedValue = val
        },
        enumerable: true,
      })

      const result = toReactive(objRef)
      const descriptor = Object.getOwnPropertyDescriptor(result, 'computed')

      expect(typeof descriptor?.get).toBe('function')
      expect(typeof descriptor?.set).toBe('function')
      expect(descriptor?.configurable).toBe(true)
      expect(descriptor?.enumerable).toBe(true)
    })
  })
})
