import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope } from 'vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
}))

vi.mock('./useSettings', () => ({
  useSettings: () => ({ prefersReducedMotion: { value: true } }),
}))

// Composables
import { useRouterLinks } from './useRouterLinks'

function click (container: HTMLElement, href: string, target?: string) {
  const a = document.createElement('a')
  a.setAttribute('href', href)
  if (target) a.setAttribute('target', target)
  container.append(a)
  const event = new MouseEvent('click', { bubbles: true, cancelable: true })
  a.dispatchEvent(event)
  return event
}

describe('useRouterLinks', () => {
  let container: HTMLElement
  let scope: ReturnType<typeof effectScope>

  beforeEach(() => {
    push.mockClear()
    container = document.createElement('div')
    document.body.append(container)
    scope = effectScope()
    scope.run(() => {
      useRouterLinks(container)
    })
  })

  afterEach(() => {
    scope.stop()
    container.remove()
  })

  it('should router-push internal docs paths', () => {
    const event = click(container, '/systems/emerald')
    expect(event.defaultPrevented).toBe(true)
    expect(push).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/systems/emerald')
  })

  it('should not treat same-origin demo paths as router links', () => {
    const event = click(container, '/demo/emerald/')
    expect(event.defaultPrevented).toBe(false)
    expect(push).not.toHaveBeenCalled()
  })

  it('should skip new-tab links', () => {
    const event = click(container, '/systems/emerald', '_blank')
    expect(event.defaultPrevented).toBe(false)
    expect(push).not.toHaveBeenCalled()
  })
})
