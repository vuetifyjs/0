import { afterEach, describe, expect, it, vi } from 'vitest'

// Context
import EmSnackbar from './EmSnackbar.vue'

// Utilities
import { createApp, h } from 'vue'

// Types
import type { EmSnackbarProps } from './EmSnackbar.vue'
import type { App } from 'vue'

const apps: App[] = []

function mount (props: EmSnackbarProps) {
  const host = document.createElement('div')

  document.body.append(host)

  const app = createApp({
    render: () => h(EmSnackbar, props, { default: () => 'Message' }),
  })

  apps.push(app)
  app.mount(host)

  return host
}

function role (host: HTMLElement) {
  return host.querySelector('.emerald-snackbar')?.getAttribute('role')
}

afterEach(() => {
  for (const app of apps.splice(0)) app.unmount()

  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('emSnackbar', () => {
  describe('urgency', () => {
    it('should announce role=alert for variant=error', () => {
      const host = mount({ variant: 'error' })

      expect(role(host)).toBe('alert')
    })

    it('should announce role=status for variant=success', () => {
      const host = mount({ variant: 'success' })

      expect(role(host)).toBe('status')
    })

    it('should announce role=status for variant=warning', () => {
      const host = mount({ variant: 'warning' })

      expect(role(host)).toBe('status')
    })

    it('should announce role=status by default (variant=neutral)', () => {
      const host = mount({})

      expect(role(host)).toBe('status')
    })

    it('should let an explicit urgent=true override a non-error variant', () => {
      const host = mount({ variant: 'warning', urgent: true })

      expect(role(host)).toBe('alert')
    })

    it('should let an explicit urgent=false override variant=error', () => {
      const host = mount({ variant: 'error', urgent: false })

      expect(role(host)).toBe('status')
    })
  })
})
