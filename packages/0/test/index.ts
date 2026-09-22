export { commands, page, userEvent } from 'vitest/browser'
export { cleanup, render, screen } from '@testing-library/vue'

export function wait (timeout?: number) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

export function waitAnimationFrame () {
  return new Promise(resolve => requestAnimationFrame(resolve))
}

export function touch (element: Element) {
  function trigger (eventName: string) {
    return (clientX: number, clientY: number) => {
      const touches = [{ clientX, clientY }]
      const event = new Event(eventName) as Event & {
        touches: typeof touches
        changedTouches: typeof touches
      }
      event.touches = touches
      event.changedTouches = touches
      element.dispatchEvent(event)
      return touch(element)
    }
  }

  return {
    start: trigger('touchstart'),
    move: trigger('touchmove'),
    end: trigger('touchend'),
  }
}
