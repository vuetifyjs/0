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

    it('handles modifier-only hotkey', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('ctrl', callback)
      })

      window.dispatchEvent(createKeyboardEvent('Control', { ctrlKey: true }))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles multiple modifiers without key', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('ctrl+shift', callback)
      })

      window.dispatchEvent(createKeyboardEvent('Shift', { ctrlKey: true, shiftKey: true }))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('does not trigger modifier-only with extra modifier', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('ctrl', callback)
      })

      window.dispatchEvent(createKeyboardEvent('Control', { ctrlKey: true, shiftKey: true }))

      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('platform-aware modifiers', () => {
    it('cmd maps to metaKey on Mac', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('cmd+k', callback, {}, { isMac: true })
      })

      window.dispatchEvent(createKeyboardEvent('k', { metaKey: true }))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('cmd maps to ctrlKey on non-Mac', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('cmd+k', callback, {}, { isMac: false })
      })

      window.dispatchEvent(createKeyboardEvent('k', { ctrlKey: true }))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('meta maps to metaKey on Mac', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('meta+k', callback, {}, { isMac: true })
      })

      window.dispatchEvent(createKeyboardEvent('k', { metaKey: true }))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('meta maps to ctrlKey on non-Mac', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('meta+k', callback, {}, { isMac: false })
      })

      window.dispatchEvent(createKeyboardEvent('k', { ctrlKey: true }))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('ctrl always maps to ctrlKey regardless of platform', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('ctrl+k', callback, {}, { isMac: true })
      })

      window.dispatchEvent(createKeyboardEvent('k', { ctrlKey: true }))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('cmd on Mac does not trigger with ctrlKey', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('cmd+k', callback, {}, { isMac: true })
      })

      window.dispatchEvent(createKeyboardEvent('k', { ctrlKey: true }))

      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('key aliases integration', () => {
    it('handles arrow key aliases', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('up', callback)
      })

      window.dispatchEvent(createKeyboardEvent('ArrowUp'))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles escape alias', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('esc', callback)
      })

      window.dispatchEvent(createKeyboardEvent('Escape'))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles space alias', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('space', callback)
      })

      window.dispatchEvent(createKeyboardEvent(' '))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles return alias for enter', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('return', callback)
      })

      window.dispatchEvent(createKeyboardEvent('Enter'))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles delete alias', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('del', callback)
      })

      window.dispatchEvent(createKeyboardEvent('Delete'))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles alias in combination', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('ctrl+return', callback)
      })

      window.dispatchEvent(createKeyboardEvent('Enter', { ctrlKey: true }))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles arrow keys in sequence', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('up-down', callback)
      })

      window.dispatchEvent(createKeyboardEvent('ArrowUp'))
      expect(callback).not.toHaveBeenCalled()

      window.dispatchEvent(createKeyboardEvent('ArrowDown'))
      expect(callback).toHaveBeenCalledTimes(1)
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

    it('handles three-key sequence', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('g-i-t', callback)
      })

      window.dispatchEvent(createKeyboardEvent('g'))
      expect(callback).not.toHaveBeenCalled()

      window.dispatchEvent(createKeyboardEvent('i'))
      expect(callback).not.toHaveBeenCalled()

      window.dispatchEvent(createKeyboardEvent('t'))
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles three-key sequence with modifier on first key', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('ctrl+g-i-t', callback)
      })

      window.dispatchEvent(createKeyboardEvent('g', { ctrlKey: true }))
      window.dispatchEvent(createKeyboardEvent('i'))
      window.dispatchEvent(createKeyboardEvent('t'))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('resets three-key sequence on wrong key at any position', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('g-i-t', callback)
      })

      // Wrong key at position 2
      window.dispatchEvent(createKeyboardEvent('g'))
      window.dispatchEvent(createKeyboardEvent('x'))
      window.dispatchEvent(createKeyboardEvent('t'))
      expect(callback).not.toHaveBeenCalled()

      // Start over and complete correctly
      window.dispatchEvent(createKeyboardEvent('g'))
      window.dispatchEvent(createKeyboardEvent('i'))
      window.dispatchEvent(createKeyboardEvent('t'))
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles timeout between any keys in three-key sequence', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('g-i-t', callback, { sequenceTimeout: 500 })
      })

      window.dispatchEvent(createKeyboardEvent('g'))
      window.dispatchEvent(createKeyboardEvent('i'))
      vi.advanceTimersByTime(600) // Timeout between second and third
      window.dispatchEvent(createKeyboardEvent('t'))

      expect(callback).not.toHaveBeenCalled()
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

    it('stops propagation when stopPropagation is true', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('a', callback, { stopPropagation: true })
      })

      const event = createKeyboardEvent('a')
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation')
      window.dispatchEvent(event)

      expect(stopPropagationSpy).toHaveBeenCalled()
    })

    it('does not stop propagation when stopPropagation is false', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('a', callback, { stopPropagation: false })
      })

      const event = createKeyboardEvent('a')
      const stopPropagationSpy = vi.spyOn(event, 'stopPropagation')
      window.dispatchEvent(event)

      expect(stopPropagationSpy).not.toHaveBeenCalled()
    })
  })

  describe('input focus detection', () => {
    it('ignores hotkey when input is focused', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('a', callback)
      })

      const input = document.createElement('input')
      document.body.append(input)
      input.focus()

      window.dispatchEvent(createKeyboardEvent('a'))

      expect(callback).not.toHaveBeenCalled()
      input.remove()
    })

    it('ignores hotkey when textarea is focused', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('a', callback)
      })

      const textarea = document.createElement('textarea')
      document.body.append(textarea)
      textarea.focus()

      window.dispatchEvent(createKeyboardEvent('a'))

      expect(callback).not.toHaveBeenCalled()
      textarea.remove()
    })

    it('ignores hotkey when contentEditable element is focused', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('a', callback)
      })

      const div = document.createElement('div')
      div.contentEditable = 'true'
      document.body.append(div)
      div.focus()

      window.dispatchEvent(createKeyboardEvent('a'))

      expect(callback).not.toHaveBeenCalled()
      div.remove()
    })

    it('fires hotkey when inputs option is true even if input focused', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('a', callback, { inputs: true })
      })

      const input = document.createElement('input')
      document.body.append(input)
      input.focus()

      window.dispatchEvent(createKeyboardEvent('a'))

      expect(callback).toHaveBeenCalledTimes(1)
      input.remove()
    })

    it('uses reactive inputs option', async () => {
      const callback = vi.fn()
      const inputs = ref(false)

      scope.run(() => {
        useHotkey('a', callback, { inputs })
      })

      const input = document.createElement('input')
      document.body.append(input)
      input.focus()

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).not.toHaveBeenCalled()

      inputs.value = true

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1)

      input.remove()
    })
  })

  describe('event type option', () => {
    it('listens to keyup when event option is keyup', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('a', callback, { event: 'keyup' })
      })

      const event = new KeyboardEvent('keyup', {
        key: 'a',
        bubbles: true,
      })
      window.dispatchEvent(event)

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('does not listen to keydown when event is keyup', () => {
      const callback = vi.fn()

      scope.run(() => {
        useHotkey('a', callback, { event: 'keyup' })
      })

      window.dispatchEvent(createKeyboardEvent('a'))

      expect(callback).not.toHaveBeenCalled()
    })

    it('switches listener when event option changes reactively', async () => {
      const callback = vi.fn()
      const event = ref<'keydown' | 'keyup'>('keydown')

      scope.run(() => {
        useHotkey('a', callback, { event })
      })

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1)

      event.value = 'keyup'
      await nextTick()

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1) // still 1, not listening to keydown

      const keyupEvent = new KeyboardEvent('keyup', {
        key: 'a',
        bubbles: true,
      })
      window.dispatchEvent(keyupEvent)
      expect(callback).toHaveBeenCalledTimes(2)
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

  describe('SSR safety', () => {
    it('isActive is false when keys is undefined', () => {
      const callback = vi.fn()
      let isActive: { value: boolean }

      scope.run(() => {
        ;({ isActive } = useHotkey(undefined, callback))
      })

      // No listener set up for undefined keys
      expect(isActive!.value).toBe(false)
    })

    it('pause/resume/stop do not throw when keys is undefined', () => {
      const callback = vi.fn()
      let pause: () => void
      let resume: () => void
      let stop: () => void

      scope.run(() => {
        ;({ pause, resume, stop } = useHotkey(undefined, callback))
      })

      // These should not throw even with undefined keys
      expect(() => pause!()).not.toThrow()
      expect(() => resume!()).not.toThrow()
      expect(() => stop!()).not.toThrow()
    })

    it('handles transition from undefined to defined keys', async () => {
      const callback = vi.fn()
      const keys = ref<string | undefined>(undefined)
      let isActive: { value: boolean }

      scope.run(() => {
        ;({ isActive } = useHotkey(keys, callback))
      })

      expect(isActive!.value).toBe(false)

      keys.value = 'a'
      await nextTick()

      expect(isActive!.value).toBe(true)
      window.dispatchEvent(createKeyboardEvent('a'))
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

  describe('warnings', () => {
    it('warns on empty combination', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      splitKeyCombination('')

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid hotkey combination'),
      )
      warnSpy.mockRestore()
    })

    it('warns on invalid leading separator', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      splitKeyCombination('+a')

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid hotkey combination'),
      )
      warnSpy.mockRestore()
    })

    it('warns on double plus separator', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      splitKeyCombination('ctrl++k')

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid hotkey combination'),
      )
      warnSpy.mockRestore()
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

  it('splits three-key sequence', () => {
    expect(splitKeySequence('g-i-t')).toEqual(['g', 'i', 't'])
  })

  describe('warnings', () => {
    it('warns on empty sequence', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      splitKeySequence('')

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid hotkey sequence'),
      )
      warnSpy.mockRestore()
    })

    it('warns on invalid leading separator', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      splitKeySequence('-a')

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid hotkey sequence'),
      )
      warnSpy.mockRestore()
    })

    it('warns on invalid trailing separator', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      splitKeySequence('a-')

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid hotkey sequence'),
      )
      warnSpy.mockRestore()
    })
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
