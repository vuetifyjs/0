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

  describe('header anchors', () => {
    let writeText: ReturnType<typeof vi.fn>

    beforeEach(() => {
      writeText = vi.fn().mockResolvedValue(undefined)
      vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(writeText)
      const status = document.createElement('div')
      status.id = 'docs-copy-status'
      document.body.append(status)
    })

    afterEach(() => {
      document.querySelector('#docs-copy-status')?.remove()
      vi.restoreAllMocks()
    })

    function headerClick (init?: MouseEventInit) {
      const heading = document.createElement('h2')
      heading.id = 'usage'
      const anchor = document.createElement('a')
      anchor.className = 'header-anchor'
      anchor.href = '#usage'
      anchor.textContent = 'Usage'
      heading.append(anchor)
      container.append(heading)
      const event = new MouseEvent('click', { bubbles: true, cancelable: true, ...init })
      anchor.dispatchEvent(event)
      return { anchor, event }
    }

    it('should copy the absolute url of a heading permalink', async () => {
      const scroll = vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => {})
      const replace = vi.spyOn(history, 'replaceState')
      const { anchor, event } = headerClick()

      expect(event.defaultPrevented).toBe(true)
      expect(scroll).not.toHaveBeenCalled()
      expect(replace).not.toHaveBeenCalled()
      await vi.waitFor(() => {
        expect(anchor.classList.contains('header-anchor--copied')).toBe(true)
      })
      expect(writeText).toHaveBeenCalledTimes(1)
      expect(writeText).toHaveBeenCalledWith(new URL('#usage', window.location.href).href)
      expect(document.querySelector('#docs-copy-status')?.textContent).toBe('Link copied')
    })

    it('should not copy a hash link that is not a heading permalink', () => {
      const target = document.createElement('h2')
      target.id = 'usage'
      container.append(target)
      const event = click(container, '#usage')

      expect(event.defaultPrevented).toBe(true)
      expect(writeText).not.toHaveBeenCalled()
    })

    it('should not copy a heading permalink opened with a modifier', () => {
      const scroll = vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => {})
      const { event } = headerClick({ metaKey: true })
      expect(event.defaultPrevented).toBe(true)
      expect(scroll).not.toHaveBeenCalled()
      expect(writeText).not.toHaveBeenCalled()
    })
  })
})
