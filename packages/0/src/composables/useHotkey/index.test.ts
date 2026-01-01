import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { effectScope } from 'vue'

import { createHotkey, createHotkeyContext } from './index'
import { splitKeyCombination, splitKeySequence } from './parsing'
import { normalizeKey } from './aliases'

describe('createHotkey', () => {
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
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback })
      })

      window.dispatchEvent(createKeyboardEvent('a'))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('does not call callback for non-matching key', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback })
      })

      window.dispatchEvent(createKeyboardEvent('b'))

      expect(callback).not.toHaveBeenCalled()
    })

    it('ticket.stop() removes the listener', () => {
      const callback = vi.fn()

      let ticket: ReturnType<ReturnType<typeof createHotkey>['register']>
      scope.run(() => {
        const hotkeys = createHotkey()
        ticket = hotkeys.register({ pattern: 'a', callback })
      })

      ticket!.stop()
      window.dispatchEvent(createKeyboardEvent('a'))

      expect(callback).not.toHaveBeenCalled()
    })

    it('unregister() removes the listener', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        const ticket = hotkeys.register({ pattern: 'a', callback })
        hotkeys.unregister(ticket.id)
      })

      window.dispatchEvent(createKeyboardEvent('a'))

      expect(callback).not.toHaveBeenCalled()
    })

    it('cleans up on scope disposal', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback })
      })

      scope.stop()
      window.dispatchEvent(createKeyboardEvent('a'))

      expect(callback).not.toHaveBeenCalled()
    })

    it('returns ticket with expected properties', () => {
      let ticket: ReturnType<ReturnType<typeof createHotkey>['register']>

      scope.run(() => {
        const hotkeys = createHotkey()
        ticket = hotkeys.register({ pattern: 'ctrl+k', callback: vi.fn() })
      })

      expect(ticket!).toHaveProperty('id')
      expect(ticket!).toHaveProperty('pattern', 'ctrl+k')
      expect(ticket!).toHaveProperty('callback')
      expect(ticket!).toHaveProperty('isActive')
      expect(ticket!).toHaveProperty('isPaused', false)
      expect(ticket!).toHaveProperty('pause')
      expect(ticket!).toHaveProperty('resume')
      expect(ticket!).toHaveProperty('stop')
    })
  })

  describe('key combinations', () => {
    it('handles ctrl+key', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'ctrl+k', callback })
      })

      window.dispatchEvent(createKeyboardEvent('k', { ctrlKey: true }))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles shift+key', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'shift+enter', callback })
      })

      window.dispatchEvent(createKeyboardEvent('Enter', { shiftKey: true }))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles alt+key', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'alt+x', callback })
      })

      window.dispatchEvent(createKeyboardEvent('x', { altKey: true }))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('handles multiple modifiers', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'ctrl+shift+k', callback })
      })

      window.dispatchEvent(createKeyboardEvent('k', { ctrlKey: true, shiftKey: true }))

      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('does not trigger without required modifier', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'ctrl+k', callback })
      })

      window.dispatchEvent(createKeyboardEvent('k'))

      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('key sequences', () => {
    it('handles two-key sequence', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'g-h', callback })
      })

      window.dispatchEvent(createKeyboardEvent('g'))
      expect(callback).not.toHaveBeenCalled()

      window.dispatchEvent(createKeyboardEvent('h'))
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('resets sequence on wrong key', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'g-h', callback })
      })

      window.dispatchEvent(createKeyboardEvent('g'))
      window.dispatchEvent(createKeyboardEvent('x'))
      window.dispatchEvent(createKeyboardEvent('h'))

      expect(callback).not.toHaveBeenCalled()
    })

    it('resets sequence on timeout', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'g-h', callback, sequenceTimeout: 500 })
      })

      window.dispatchEvent(createKeyboardEvent('g'))
      vi.advanceTimersByTime(600)
      window.dispatchEvent(createKeyboardEvent('h'))

      expect(callback).not.toHaveBeenCalled()
    })

    it('completes sequence before timeout', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'g-h', callback, sequenceTimeout: 500 })
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
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback, preventDefault: true })
      })

      const event = createKeyboardEvent('a')
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      window.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('does not prevent default when preventDefault is false', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback, preventDefault: false })
      })

      const event = createKeyboardEvent('a')
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      window.dispatchEvent(event)

      expect(preventDefaultSpy).not.toHaveBeenCalled()
    })

    it('uses default options from createHotkey', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey({ preventDefault: false })
        hotkeys.register({ pattern: 'a', callback })
      })

      const event = createKeyboardEvent('a')
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')
      window.dispatchEvent(event)

      expect(preventDefaultSpy).not.toHaveBeenCalled()
    })
  })

  describe('multiple hotkeys', () => {
    it('supports multiple hotkeys in same registry', () => {
      const callbackA = vi.fn()
      const callbackB = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback: callbackA })
        hotkeys.register({ pattern: 'b', callback: callbackB })
      })

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callbackA).toHaveBeenCalledTimes(1)
      expect(callbackB).not.toHaveBeenCalled()

      window.dispatchEvent(createKeyboardEvent('b'))
      expect(callbackB).toHaveBeenCalledTimes(1)
    })

    it('tracks size correctly', () => {
      let hotkeys: ReturnType<typeof createHotkey>

      scope.run(() => {
        hotkeys = createHotkey()
        expect(hotkeys.size).toBe(0)

        const ticket1 = hotkeys.register({ pattern: 'a', callback: vi.fn() })
        expect(hotkeys.size).toBe(1)

        hotkeys.register({ pattern: 'b', callback: vi.fn() })
        expect(hotkeys.size).toBe(2)

        hotkeys.unregister(ticket1.id)
        expect(hotkeys.size).toBe(1)
      })
    })
  })

  describe('pause/resume per-ticket', () => {
    it('ticket.pause() stops responding to hotkeys', () => {
      const callback = vi.fn()
      let ticket: ReturnType<ReturnType<typeof createHotkey>['register']>

      scope.run(() => {
        const hotkeys = createHotkey()
        ticket = hotkeys.register({ pattern: 'a', callback })
      })

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1)

      ticket!.pause()
      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1) // still 1
    })

    it('ticket.resume() re-enables hotkeys after pause', () => {
      const callback = vi.fn()
      let ticket: ReturnType<ReturnType<typeof createHotkey>['register']>

      scope.run(() => {
        const hotkeys = createHotkey()
        ticket = hotkeys.register({ pattern: 'a', callback })
      })

      ticket!.pause()
      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).not.toHaveBeenCalled()

      ticket!.resume()
      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('isPaused reflects pause state', () => {
      let ticket: ReturnType<ReturnType<typeof createHotkey>['register']>

      scope.run(() => {
        const hotkeys = createHotkey()
        ticket = hotkeys.register({ pattern: 'a', callback: vi.fn() })
      })

      expect(ticket!.isPaused).toBe(false)

      ticket!.pause()
      expect(ticket!.isPaused).toBe(true)

      ticket!.resume()
      expect(ticket!.isPaused).toBe(false)
    })

    it('isActive reflects listener state', () => {
      let ticket: ReturnType<ReturnType<typeof createHotkey>['register']>

      scope.run(() => {
        const hotkeys = createHotkey()
        ticket = hotkeys.register({ pattern: 'a', callback: vi.fn() })
      })

      expect(ticket!.isActive.value).toBe(true)

      ticket!.pause()
      expect(ticket!.isActive.value).toBe(false)

      ticket!.resume()
      expect(ticket!.isActive.value).toBe(true)
    })
  })

  describe('pauseAll/resumeAll', () => {
    it('pauseAll() stops all hotkeys', () => {
      const callbackA = vi.fn()
      const callbackB = vi.fn()
      let hotkeys: ReturnType<typeof createHotkey>

      scope.run(() => {
        hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback: callbackA })
        hotkeys.register({ pattern: 'b', callback: callbackB })
      })

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callbackA).toHaveBeenCalledTimes(1)

      hotkeys!.pauseAll()

      window.dispatchEvent(createKeyboardEvent('a'))
      window.dispatchEvent(createKeyboardEvent('b'))
      expect(callbackA).toHaveBeenCalledTimes(1) // still 1
      expect(callbackB).not.toHaveBeenCalled()
    })

    it('resumeAll() re-enables all hotkeys', () => {
      const callbackA = vi.fn()
      const callbackB = vi.fn()
      let hotkeys: ReturnType<typeof createHotkey>

      scope.run(() => {
        hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback: callbackA })
        hotkeys.register({ pattern: 'b', callback: callbackB })
        hotkeys.pauseAll()
      })

      hotkeys!.resumeAll()

      window.dispatchEvent(createKeyboardEvent('a'))
      window.dispatchEvent(createKeyboardEvent('b'))
      expect(callbackA).toHaveBeenCalledTimes(1)
      expect(callbackB).toHaveBeenCalledTimes(1)
    })

    it('isGloballyPaused reflects global pause state', () => {
      let hotkeys: ReturnType<typeof createHotkey>

      scope.run(() => {
        hotkeys = createHotkey()
      })

      expect(hotkeys!.isGloballyPaused.value).toBe(false)

      hotkeys!.pauseAll()
      expect(hotkeys!.isGloballyPaused.value).toBe(true)

      hotkeys!.resumeAll()
      expect(hotkeys!.isGloballyPaused.value).toBe(false)
    })

    it('resumeAll() respects per-ticket pause state', () => {
      const callbackA = vi.fn()
      const callbackB = vi.fn()
      let hotkeys: ReturnType<typeof createHotkey>
      let ticketA: ReturnType<ReturnType<typeof createHotkey>['register']>

      scope.run(() => {
        hotkeys = createHotkey()
        ticketA = hotkeys.register({ pattern: 'a', callback: callbackA })
        hotkeys.register({ pattern: 'b', callback: callbackB })

        // Pause ticket A individually, then pause all
        ticketA.pause()
        hotkeys.pauseAll()
      })

      // Resume all - ticket A should still be paused
      hotkeys!.resumeAll()

      window.dispatchEvent(createKeyboardEvent('a'))
      window.dispatchEvent(createKeyboardEvent('b'))
      expect(callbackA).not.toHaveBeenCalled() // individually paused
      expect(callbackB).toHaveBeenCalledTimes(1) // resumed
    })
  })

  describe('clear/dispose', () => {
    it('clear() removes all hotkeys', () => {
      const callbackA = vi.fn()
      const callbackB = vi.fn()
      let hotkeys: ReturnType<typeof createHotkey>

      scope.run(() => {
        hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback: callbackA })
        hotkeys.register({ pattern: 'b', callback: callbackB })
      })

      hotkeys!.clear()
      expect(hotkeys!.size).toBe(0)

      window.dispatchEvent(createKeyboardEvent('a'))
      window.dispatchEvent(createKeyboardEvent('b'))
      expect(callbackA).not.toHaveBeenCalled()
      expect(callbackB).not.toHaveBeenCalled()
    })

    it('dispose() cleans up everything', () => {
      const callback = vi.fn()
      let hotkeys: ReturnType<typeof createHotkey>

      scope.run(() => {
        hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback })
      })

      hotkeys!.dispose()

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).not.toHaveBeenCalled()
    })
  })

  describe('input focus detection', () => {
    afterEach(() => {
      document.body.innerHTML = ''
    })

    it('skips hotkeys when input is focused and inputs: false', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback, inputs: false })
      })

      const input = document.createElement('input')
      document.body.append(input)
      input.focus()

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).not.toHaveBeenCalled()

      input.blur()
      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('triggers hotkeys in inputs when inputs: true', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback, inputs: true })
      })

      const input = document.createElement('input')
      document.body.append(input)
      input.focus()

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('skips hotkeys in textarea elements', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback, inputs: false })
      })

      const textarea = document.createElement('textarea')
      document.body.append(textarea)
      textarea.focus()

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).not.toHaveBeenCalled()
    })

    it('skips hotkeys in contenteditable elements', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback, inputs: false })
      })

      const editable = document.createElement('div')
      editable.contentEditable = 'true'
      document.body.append(editable)
      editable.focus()

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).not.toHaveBeenCalled()
    })

    it('uses default inputs option from createHotkey', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey({ inputs: true })
        hotkeys.register({ pattern: 'a', callback })
      })

      const input = document.createElement('input')
      document.body.append(input)
      input.focus()

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('event type option', () => {
    function createKeyupEvent (key: string, options: Partial<KeyboardEvent> = {}): KeyboardEvent {
      return new KeyboardEvent('keyup', {
        key,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        altKey: false,
        bubbles: true,
        ...options,
      })
    }

    it('responds to keydown by default', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback })
      })

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('responds to keyup when specified', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback, event: 'keyup' })
      })

      window.dispatchEvent(createKeyupEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('does not trigger keyup for keydown listeners', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback, event: 'keydown' })
      })

      window.dispatchEvent(createKeyupEvent('a'))
      expect(callback).not.toHaveBeenCalled()
    })

    it('does not trigger keydown for keyup listeners', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback, event: 'keyup' })
      })

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).not.toHaveBeenCalled()
    })

    it('uses default event option from createHotkey', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey({ event: 'keyup' })
        hotkeys.register({ pattern: 'a', callback })
      })

      window.dispatchEvent(createKeyupEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('sequence timeout edge cases', () => {
    it('each sequence step resets timeout', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'g-h-i', callback, sequenceTimeout: 500 })
      })

      window.dispatchEvent(createKeyboardEvent('g'))
      vi.advanceTimersByTime(400)

      window.dispatchEvent(createKeyboardEvent('h'))
      vi.advanceTimersByTime(400)

      window.dispatchEvent(createKeyboardEvent('i'))
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('resets correctly after failed sequence attempt', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'g-h', callback, sequenceTimeout: 500 })
      })

      window.dispatchEvent(createKeyboardEvent('g'))
      window.dispatchEvent(createKeyboardEvent('x'))

      vi.advanceTimersByTime(600)

      window.dispatchEvent(createKeyboardEvent('h'))
      expect(callback).not.toHaveBeenCalled()
    })

    it('can restart sequence after failure', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'g-h', callback })
      })

      window.dispatchEvent(createKeyboardEvent('g'))
      window.dispatchEvent(createKeyboardEvent('x'))

      window.dispatchEvent(createKeyboardEvent('g'))
      window.dispatchEvent(createKeyboardEvent('h'))
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('uses per-hotkey sequence timeout', () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey({ sequenceTimeout: 1000 })
        hotkeys.register({ pattern: 'g-h', callback: callback1, sequenceTimeout: 300 })
        hotkeys.register({ pattern: 'a-b', callback: callback2, sequenceTimeout: 2000 })
      })

      // Test short timeout (300ms)
      window.dispatchEvent(createKeyboardEvent('g'))
      vi.advanceTimersByTime(400)
      window.dispatchEvent(createKeyboardEvent('h'))
      expect(callback1).not.toHaveBeenCalled() // timeout expired

      // Test long timeout (2000ms)
      window.dispatchEvent(createKeyboardEvent('a'))
      vi.advanceTimersByTime(1500)
      window.dispatchEvent(createKeyboardEvent('b'))
      expect(callback2).toHaveBeenCalledTimes(1) // still within timeout
    })

    it('sequence can be triggered multiple times', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'g-h', callback })
      })

      window.dispatchEvent(createKeyboardEvent('g'))
      window.dispatchEvent(createKeyboardEvent('h'))
      expect(callback).toHaveBeenCalledTimes(1)

      window.dispatchEvent(createKeyboardEvent('g'))
      window.dispatchEvent(createKeyboardEvent('h'))
      expect(callback).toHaveBeenCalledTimes(2)
    })
  })

  describe('multiple hotkey interactions', () => {
    it('overlapping sequences trigger independently', () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'g-h', callback: callback1 })
        hotkeys.register({ pattern: 'g-h-i', callback: callback2 })
      })

      window.dispatchEvent(createKeyboardEvent('g'))
      window.dispatchEvent(createKeyboardEvent('h'))

      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback2).not.toHaveBeenCalled()

      window.dispatchEvent(createKeyboardEvent('i'))
      expect(callback2).toHaveBeenCalledTimes(1)
    })

    it('pausing one hotkey does not affect others', () => {
      const callback1 = vi.fn()
      const callback2 = vi.fn()
      let ticket1: ReturnType<ReturnType<typeof createHotkey>['register']>

      scope.run(() => {
        const hotkeys = createHotkey()
        ticket1 = hotkeys.register({ pattern: 'a', callback: callback1 })
        hotkeys.register({ pattern: 'b', callback: callback2 })
      })

      ticket1!.pause()

      window.dispatchEvent(createKeyboardEvent('a'))
      window.dispatchEvent(createKeyboardEvent('b'))

      expect(callback1).not.toHaveBeenCalled()
      expect(callback2).toHaveBeenCalledTimes(1)
    })

    it('same key with different modifiers triggers correct hotkey', () => {
      const callbackCtrl = vi.fn()
      const callbackShift = vi.fn()
      const callbackPlain = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'ctrl+k', callback: callbackCtrl })
        hotkeys.register({ pattern: 'shift+k', callback: callbackShift })
        hotkeys.register({ pattern: 'k', callback: callbackPlain })
      })

      window.dispatchEvent(createKeyboardEvent('k', { ctrlKey: true }))
      expect(callbackCtrl).toHaveBeenCalledTimes(1)
      expect(callbackShift).not.toHaveBeenCalled()
      expect(callbackPlain).not.toHaveBeenCalled()

      window.dispatchEvent(createKeyboardEvent('k', { shiftKey: true }))
      expect(callbackShift).toHaveBeenCalledTimes(1)

      window.dispatchEvent(createKeyboardEvent('k'))
      expect(callbackPlain).toHaveBeenCalledTimes(1)
    })
  })

  describe('callback arguments', () => {
    it('passes KeyboardEvent to callback', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback })
      })

      window.dispatchEvent(createKeyboardEvent('a'))

      expect(callback).toHaveBeenCalledWith(expect.any(KeyboardEvent))
    })

    it('callback receives correct key in event', () => {
      let receivedKey: string | undefined

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({
          pattern: 'k',
          callback: e => {
            receivedKey = e.key
          },
        })
      })

      window.dispatchEvent(createKeyboardEvent('k'))

      expect(receivedKey).toBe('k')
    })

    it('callback receives modifier state in event', () => {
      let ctrlKey: boolean | undefined
      let shiftKey: boolean | undefined

      scope.run(() => {
        const hotkeys = createHotkey()
        hotkeys.register({
          pattern: 'ctrl+shift+k',
          callback: e => {
            ctrlKey = e.ctrlKey
            shiftKey = e.shiftKey
          },
        })
      })

      window.dispatchEvent(createKeyboardEvent('k', { ctrlKey: true, shiftKey: true }))

      expect(ctrlKey).toBe(true)
      expect(shiftKey).toBe(true)
    })
  })

  describe('cleanup and memory management', () => {
    it('clears event listeners when stopping ticket', () => {
      const callback = vi.fn()
      let ticket: ReturnType<ReturnType<typeof createHotkey>['register']>

      scope.run(() => {
        const hotkeys = createHotkey()
        ticket = hotkeys.register({ pattern: 'a', callback })
      })

      expect(ticket!.cleanupRef).not.toBeNull()

      ticket!.stop()

      expect(ticket!.cleanupRef).toBeNull()
      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).not.toHaveBeenCalled()
    })

    it('clears sequence timers when unregistering', () => {
      const callback = vi.fn()
      let hotkeys: ReturnType<typeof createHotkey>
      let ticket: ReturnType<ReturnType<typeof createHotkey>['register']>

      scope.run(() => {
        hotkeys = createHotkey()
        ticket = hotkeys.register({ pattern: 'g-h', callback, sequenceTimeout: 500 })
      })

      window.dispatchEvent(createKeyboardEvent('g'))
      expect(ticket!.sequenceTimer).toBeDefined()

      hotkeys!.unregister(ticket!.id)

      vi.advanceTimersByTime(600)
      window.dispatchEvent(createKeyboardEvent('h'))
      expect(callback).not.toHaveBeenCalled()
    })

    it('clears sequence timers when clearing registry', () => {
      const callback = vi.fn()
      let hotkeys: ReturnType<typeof createHotkey>

      scope.run(() => {
        hotkeys = createHotkey()
        hotkeys.register({ pattern: 'g-h', callback, sequenceTimeout: 500 })
      })

      window.dispatchEvent(createKeyboardEvent('g'))

      hotkeys!.clear()

      vi.advanceTimersByTime(600)
      window.dispatchEvent(createKeyboardEvent('h'))
      expect(callback).not.toHaveBeenCalled()
    })

    it('does not leak listeners when pauseAll/resumeAll cycles', () => {
      const callback = vi.fn()
      let hotkeys: ReturnType<typeof createHotkey>

      scope.run(() => {
        hotkeys = createHotkey()
        hotkeys.register({ pattern: 'a', callback })
      })

      for (let i = 0; i < 5; i++) {
        hotkeys!.pauseAll()
        hotkeys!.resumeAll()
      }

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1)
    })

    it('does not leak listeners when pause/resume cycles on ticket', () => {
      const callback = vi.fn()
      let ticket: ReturnType<ReturnType<typeof createHotkey>['register']>

      scope.run(() => {
        const hotkeys = createHotkey()
        ticket = hotkeys.register({ pattern: 'a', callback })
      })

      for (let i = 0; i < 5; i++) {
        ticket!.pause()
        ticket!.resume()
      }

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })

  describe('invalid pattern handling', () => {
    it('handles empty pattern gracefully', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        const ticket = hotkeys.register({ pattern: '', callback })
        expect(ticket.keyGroups.length).toBe(0)
        expect(ticket.isActive.value).toBe(false)
      })

      window.dispatchEvent(createKeyboardEvent('a'))
      expect(callback).not.toHaveBeenCalled()
    })

    it('normalizes pattern to lowercase', () => {
      const callback = vi.fn()

      scope.run(() => {
        const hotkeys = createHotkey()
        const ticket = hotkeys.register({ pattern: 'CTRL+K', callback })
        expect(ticket.pattern).toBe('ctrl+k')
      })

      window.dispatchEvent(createKeyboardEvent('k', { ctrlKey: true }))
      expect(callback).toHaveBeenCalledTimes(1)
    })
  })
})

describe('createHotkeyContext', () => {
  it('returns trinity tuple', () => {
    const scope = effectScope()

    scope.run(() => {
      const trinity = createHotkeyContext()

      expect(trinity).toHaveLength(3)
      expect(typeof trinity[0]).toBe('function') // useHotkey
      expect(typeof trinity[1]).toBe('function') // provideHotkey
      expect(typeof trinity[2]).toBe('object') // context
    })

    scope.stop()
  })

  it('context has registry methods', () => {
    const scope = effectScope()

    scope.run(() => {
      const [,, context] = createHotkeyContext()

      expect(context).toHaveProperty('register')
      expect(context).toHaveProperty('unregister')
      expect(context).toHaveProperty('pauseAll')
      expect(context).toHaveProperty('resumeAll')
      expect(context).toHaveProperty('size')
    })

    scope.stop()
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
