// Exemplar harness test: proves conform() against the breadcrumb fixture by
// mounting an inline Vue component that reproduces the documented Bulma
// markup verbatim. Component tests follow this same shape.
import { describe, expect, it } from 'vitest'

import { conform, loadFixture } from './conform'

// Utilities
import { createApp, defineComponent, h } from 'vue'

function crumb (label: string, active = false) {
  return h(
    'li',
    active ? { class: 'is-active' } : {},
    [h('a', active ? { 'href': '#', 'aria-current': 'page' } : { href: '#' }, label)],
  )
}

const Breadcrumb = defineComponent({
  render () {
    return h('nav', { 'class': 'breadcrumb', 'aria-label': 'breadcrumbs' }, [
      h('ul', [
        crumb('Bulma'),
        crumb('Documentation'),
        crumb('Components'),
        crumb('Breadcrumb', true),
      ]),
    ])
  },
})

function mount (component: Parameters<typeof createApp>[0]) {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp(component)
  app.mount(host)
  const el = host.firstElementChild!
  function unmount () {
    app.unmount()
    host.remove()
  }
  return { el, unmount }
}

describe('conform', () => {
  it('passes for markup matching the breadcrumb fixture', () => {
    const { el, unmount } = mount(Breadcrumb)
    conform(el, 'breadcrumb')
    unmount()
  })

  it('selects fixture blocks by index and label', () => {
    expect(loadFixture('breadcrumb:2').classList.contains('has-arrow-separator')).toBe(true)
    expect(loadFixture('breadcrumb:icons').querySelector('.icon')).not.toBeNull()
  })

  it('fails on a missing fixture class', () => {
    const { el, unmount } = mount(Breadcrumb)
    el.querySelector('li.is-active')!.classList.remove('is-active')
    expect(() => conform(el, 'breadcrumb')).toThrowError(/missing class "is-active"/)
    unmount()
  })

  it('tolerates extra aria attributes but rejects extra classes', () => {
    const { el, unmount } = mount(Breadcrumb)
    el.setAttribute('aria-busy', 'false')
    conform(el, 'breadcrumb')
    el.classList.add('is-large')
    expect(() => conform(el, 'breadcrumb')).toThrowError(/unexpected class "is-large"/)
    conform(el, 'breadcrumb', { allowExtraClasses: true })
    unmount()
  })
})
