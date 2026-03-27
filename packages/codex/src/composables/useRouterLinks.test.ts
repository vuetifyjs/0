import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope } from 'vue'

// Capture the click handler registered by useEventListener
let clickHandler: ((event: MouseEvent) => void) | undefined

vi.mock('@vuetify/v0', async importOriginal => {
  const actual = await importOriginal<Record<string, unknown>>()
  return {
    ...actual,
    useEventListener: vi.fn((_target: unknown, _event: string, handler: (event: MouseEvent) => void) => {
      clickHandler = handler
    }),
  }
})

// Composables
import { useRouterLinks } from './useRouterLinks'

describe('useRouterLinks', () => {
  let scope: ReturnType<typeof effectScope>
  let container: HTMLDivElement
  let navigate: (path: string) => void

  beforeEach(() => {
    scope = effectScope()
    container = document.createElement('div')
    navigate = vi.fn()
    clickHandler = undefined
  })

  afterEach(() => {
    scope.stop()
  })

  function setup () {
    scope.run(() => {
      useRouterLinks({ container, navigate })
    })
  }

  function createClickEvent (overrides: Partial<MouseEvent> = {}): MouseEvent {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      button: 0,
      ...overrides,
    })
    return event
  }

  it('calls navigate for internal links', () => {
    setup()

    const link = document.createElement('a')
    link.setAttribute('href', '/docs/guide')
    container.append(link)

    const event = createClickEvent()
    Object.defineProperty(event, 'target', { value: link })
    clickHandler!(event)

    expect(navigate).toHaveBeenCalledWith('/docs/guide')
  })

  it('skips external links', () => {
    setup()

    const link = document.createElement('a')
    link.setAttribute('href', 'https://external.com/page')
    container.append(link)

    const event = createClickEvent()
    Object.defineProperty(event, 'target', { value: link })
    clickHandler!(event)

    expect(navigate).not.toHaveBeenCalled()
  })

  it('skips links with target="_blank"', () => {
    setup()

    const link = document.createElement('a')
    link.setAttribute('href', '/docs/guide')
    link.setAttribute('target', '_blank')
    container.append(link)

    const event = createClickEvent()
    Object.defineProperty(event, 'target', { value: link })
    clickHandler!(event)

    expect(navigate).not.toHaveBeenCalled()
  })

  it('skips modified clicks (ctrl+click)', () => {
    setup()

    const link = document.createElement('a')
    link.setAttribute('href', '/docs/guide')
    container.append(link)

    const event = createClickEvent({ ctrlKey: true })
    Object.defineProperty(event, 'target', { value: link })
    clickHandler!(event)

    expect(navigate).not.toHaveBeenCalled()
  })
})
