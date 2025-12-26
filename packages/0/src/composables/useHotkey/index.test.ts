import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { effectScope, ref, nextTick } from 'vue'

import { useHotkey } from './index'
import { splitKeyCombination, splitKeySequence } from './parsing'
import { normalizeKey } from './aliases'

describe('useHotkey', () => {
  let scope: ReturnType<typeof effectScope>

  beforeEach(() => {
    scope = effectScope()
    vi.useFakeTimers()
  })

  afterEach(() => {
    scope.stop()
    vi.useRealTimers()
  })

  function createKeyboardEvent (key: string, options: Partial<KeyboardEvent> = {}): KeyboardEvent {
    return new KeyboardEvent('keydown', {
      key,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      altKey: false,
      bubbles: true,
      ...options,
    })
  }

  describe('basic functionality', () => {
    it('calls callback when hotkey is pressed', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('a', callback)
      })

      window.dispatchEvent(createKeyboardEvent('a'))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('does not call callback for non-matching key', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('a', callback)
      })

      window.dispatchEvent(createKeyboardEvent('b'))

      expect(callback).not.toHaveBeenCalled()
    })

    it('stop() removes the listener', () => {
      const callback = vi.fn()
      let stop: () => void

      scope.run(() => {
        ;({ stop } = useHotkey('a', callback))
      })

      stop!()
      window.dispatchEvent(createKeyboardEvent('a'))

      expect(callback).not.toHaveBeenCalled()
    })

    it('cleans up on scope disposal', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('a', callback)
      })

      scope.stop()
      window.dispatchEvent(createKeyboardEvent('a'))

      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('key combinations', () => {
    it('handles ctrl+key', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('ctrl+k', callback)
      })

      window.dispatchEvent(createKeyboardEvent('k', { ctrlKey: true }))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles shift+key', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('shift+enter', callback)
      })

      window.dispatchEvent(createKeyboardEvent('Enter', { shiftKey: true }))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles alt+key', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('alt+x', callback)
      })

      window.dispatchEvent(createKeyboardEvent('x', { altKey: true }))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles multiple modifiers', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('ctrl+shift+k', callback)
      })

      window.dispatchEvent(createKeyboardEvent('k', { ctrlKey: true, shiftKey: true }))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('does not trigger without required modifier', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('ctrl+k', callback)
      })

      window.dispatchEvent(createKeyboardEvent('k'))

      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('key sequences', () => {
    it('handles two-key sequence', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('g-h', callback)
      })

      window.dispatchEvent(createKeyboardEvent('g'))
      expect(callback).not.toHaveBeenCalled()

      window.dispatchEvent(createKeyboardEvent('h'))
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('resets sequence on wrong key', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('g-h', callback)
      })

      window.dispatchEvent(createKeyboardEvent('g'))
      window.dispatchEvent(createKeyboardEvent('x'))
      window.dispatchEvent(createKeyboardEvent('h'))

      expect(callback).not.toHaveBeenCalled()
    })

    it('resets sequence on timeout', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('g-h', callback, { sequenceTimeout: 500 })
      })

      window.dispatchEvent(createKeyboardEvent('g'))
      vi.advanceTimersByTime(600)
      window.dispatchEvent(createKeyboardEvent('h'))

      expect(callback).not.toHaveBeenCalled()
    })

    it('completes sequence before timeout', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('g-h', callback, { sequenceTimeout: 500 })
      })

      window.dispatchEvent(createKeyboardEvent('g'))
      vi.advanceTimersByTime(400)
      window.dispatchEvent(createKeyboardEvent('h'))

      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('options', () => {
    it('prevents default when preventDefault is true', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('a', callback, { preventDefault: true })
      })

      const event = createKeyboardEvent('a')
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      window.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('does not prevent default when preventDefault is false', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('a', callback, { preventDefault: false })
      })

      const event = createKeyboardEvent('a')
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      window.dispatchEvent(event)

      expect(preventDefaultSpy).not.toHaveBeenCalled()
    })
  })

  describe('reactive keys', () => {
    it('updates when keys ref changes', async () => {
      const callback = vi.fn()
      const keys = ref('a')

      scope.run(() => {
        useHotkey(keys, callback)
      })

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1)

      keys.value = 'b'
      await nextTick()

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1) // still 1

      window.dispatchEvent(createKeyboardEvent('b'))
      expect(callback).toHaveBeenCalledTimes(2)
    })

    it('handles undefined keys', async () => {
      const callback = vi.fn()
      const keys = ref<string | undefined>('a')

      scope.run(() => {
        useHotkey(keys, callback)
      })

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1)

      keys.value = undefined
      await nextTick()

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1) // listener removed
    })
  })

  describe('pause/resume', () => {
    it('pause() stops responding to hotkeys', () => {
      const callback = vi.fn()
      let pause: () => void

      scope.run(() => {
        ;({ pause } = useHotkey('a', callback))
      })

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1)

      pause!()
      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1) // still 1
    })

    it('resume() re-enables hotkeys after pause', () => {
      const callback = vi.fn()
      let pause: () => void
      let resume: () => void

      scope.run(() => {
        ;({ pause, resume } = useHotkey('a', callback))
      })

      pause!()
      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).not.toHaveBeenCalled()

      resume!()
      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('isPaused reflects pause state', () => {
      let isPaused: { value: boolean }
      let pause: () => void
      let resume: () => void

      scope.run(() => {
        ;({ isPaused, pause, resume } = useHotkey('a', vi.fn()))
      })

      expect(isPaused!.value).toBe(false)

      pause!()
      expect(isPaused!.value).toBe(true)

      resume!()
      expect(isPaused!.value).toBe(false)
    })

    it('isActive reflects listener state', async () => {
      const keys = ref<string | undefined>('a')
      let isActive: { value: boolean }
      let pause: () => void
      let resume: () => void

      scope.run(() => {
        ;({ isActive, pause, resume } = useHotkey(keys, vi.fn()))
      })

      expect(isActive!.value).toBe(true)

      pause!()
      expect(isActive!.value).toBe(false)

      resume!()
      expect(isActive!.value).toBe(true)

      keys.value = undefined
      await nextTick()
      expect(isActive!.value).toBe(false)
    })

    it('changing keys while paused does not setup listener', async () => {
      const callback = vi.fn()
      const keys = ref('a')
      let pause: () => void
      let isActive: { value: boolean }

      scope.run(() => {
        ;({ pause, isActive } = useHotkey(keys, callback))
      })

      pause!()
      keys.value = 'b'
      await nextTick()

      expect(isActive!.value).toBe(false)
      window.dispatchEvent(createKeyboardEvent('b'))
      expect(callback).not.toHaveBeenCalled()
    })

    it('resume after keys change uses new keys', async () => {
      const callback = vi.fn()
      const keys = ref('a')
      let pause: () => void
      let resume: () => void

      scope.run(() => {
        ;({ pause, resume } = useHotkey(keys, callback))
      })

      pause!()
      keys.value = 'b'
      await nextTick()
      resume!()

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).not.toHaveBeenCalled()

      window.dispatchEvent(createKeyboardEvent('b'))
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })
})

describe('splitKeyCombination', () => {
  it('splits simple combination', () => {
    expect(splitKeyCombination('ctrl+k')).toEqual({
      keys: ['ctrl', 'k'],
      separators: ['+'],
    })
  })

  it('splits multiple modifiers', () => {
    expect(splitKeyCombination('ctrl+shift+k')).toEqual({
      keys: ['ctrl', 'shift', 'k'],
      separators: ['+', '+'],
    })
  })

  it('handles single key', () => {
    expect(splitKeyCombination('a')).toEqual({
      keys: ['a'],
      separators: [],
    })
  })

  it('normalizes key aliases', () => {
    expect(splitKeyCombination('control+esc')).toEqual({
      keys: ['ctrl', 'escape'],
      separators: ['+'],
    })
  })

  it('returns empty for invalid combinations', () => {
    expect(splitKeyCombination('')).toEqual({ keys: [], separators: [] })
    expect(splitKeyCombination('+a')).toEqual({ keys: [], separators: [] })
  })

  it('handles literal minus as key', () => {
    expect(splitKeyCombination('ctrl+-')).toEqual({
      keys: ['ctrl', '-'],
      separators: ['+'],
    })
  })
})

describe('splitKeySequence', () => {
  it('splits simple sequence', () => {
    expect(splitKeySequence('g-h')).toEqual(['g', 'h'])
  })

  it('splits sequence with combinations', () => {
    expect(splitKeySequence('ctrl+k-p')).toEqual(['ctrl+k', 'p'])
  })

  it('handles single key (not a sequence)', () => {
    expect(splitKeySequence('a')).toEqual(['a'])
  })

  it('returns empty for invalid sequences', () => {
    expect(splitKeySequence('')).toEqual([])
  })

  it('handles literal minus in combination', () => {
    expect(splitKeySequence('ctrl+-')).toEqual(['ctrl+-'])
  })
})

describe('normalizeKey', () => {
  it('normalizes modifier aliases', () => {
    expect(normalizeKey('control')).toBe('ctrl')
    expect(normalizeKey('command')).toBe('cmd')
    expect(normalizeKey('option')).toBe('alt')
  })

  it('normalizes arrow key aliases', () => {
    expect(normalizeKey('up')).toBe('arrowup')
    expect(normalizeKey('down')).toBe('arrowdown')
    expect(normalizeKey('left')).toBe('arrowleft')
    expect(normalizeKey('right')).toBe('arrowright')
  })

  it('normalizes common key aliases', () => {
    expect(normalizeKey('esc')).toBe('escape')
    expect(normalizeKey('space')).toBe(' ')
    expect(normalizeKey('return')).toBe('enter')
    expect(normalizeKey('del')).toBe('delete')
  })

  it('preserves unknown keys in lowercase', () => {
    expect(normalizeKey('Enter')).toBe('enter')
    expect(normalizeKey('F1')).toBe('f1')
  })
})
