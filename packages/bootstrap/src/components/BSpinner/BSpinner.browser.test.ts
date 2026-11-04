import { afterEach, describe, expect, it } from 'vitest'

// Framework
import { isNumber, isString } from '@vuetify/v0'

import { BSpinner } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { VNode } from 'vue'

import { conform } from '../../../harness/conform'
import { BAvatar } from '../BAvatar'
import { BBreadcrumb } from '../BBreadcrumb'
import { BListGroup } from '../BListGroup'
import { BPagination } from '../BPagination'
import { BPlaceholder } from '../BPlaceholder'
import { BProgress } from '../BProgress'

const teardowns: (() => void)[] = []

function mount (node: () => VNode): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: node })
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }
})

async function settle () {
  await nextTick()
  await nextTick()
}

describe('bootstrap display components', () => {
  it('should conform to the basic spinner fixture', async () => {
    const host = mount(() => h(BSpinner))
    await settle()
    const element = host.querySelector('.spinner-border')
    expect(element).not.toBeNull()
    conform(element!, 'spinner:basic')
  })

  it('should conform to the grow and small spinner fixtures', async () => {
    const host = mount(() => h('div', [
      h(BSpinner, { grow: true }),
      h(BSpinner, { small: true }),
    ]))
    await settle()
    conform(host.querySelector('.spinner-grow')!, 'spinner:grow')
    conform(host.querySelector('.spinner-border')!, 'spinner:small')
  })

  it('should conform to the rotate spinner fixture', async () => {
    const host = mount(() => h(BSpinner, { variant: 'rotate' }))
    await settle()
    const element = host.querySelector('.spinner-rotate')
    expect(element).not.toBeNull()
    conform(element!, 'spinner:rotate')
  })

  it('should conform to the placeholder fixtures', async () => {
    const host = mount(() => h('div', [
      h(BPlaceholder, { class: 'col-6' }),
      h(BPlaceholder, { size: 'lg' }),
    ]))
    await settle()
    const spans = host.querySelectorAll('.placeholder')
    conform(spans[0]!, 'placeholder:basic')
    conform(spans[1]!, 'placeholder:lg')
  })

  it('should conform to the progress fixtures', async () => {
    const host = mount(() => h('div', [
      h(BProgress, { modelValue: 25, label: 'Basic example' }),
      h(BProgress, { modelValue: 10, label: 'Default striped example', striped: true, animated: true }),
      h(BProgress, { modelValue: 25, label: 'Example with label' }, () => '25%'),
    ]))
    await settle()
    const bars = host.querySelectorAll('.progress')
    conform(bars[0]!, 'progress:basic', { ignoreAttrs: ['style'] })
    conform(bars[1]!, 'progress:striped', { ignoreAttrs: ['style'] })
    conform(bars[2]!, 'progress:label', { ignoreAttrs: ['style'] })
  })

  it('should conform to the breadcrumb fixture', async () => {
    const host = mount(() => h(BBreadcrumb, {}, () => [
      h(BBreadcrumb.Item, {}, () => h(BBreadcrumb.Link, { href: '#' }, () => 'Home')),
      h(BBreadcrumb.Divider, {}, () => '/'),
      h(BBreadcrumb.Item, {}, () => h(BBreadcrumb.Link, { href: '#' }, () => 'Library')),
      h(BBreadcrumb.Divider, {}, () => '/'),
      h(BBreadcrumb.Item, { current: true }, () => h(BBreadcrumb.Link, { href: '#', active: true }, () => 'Data')),
    ]))
    await settle()
    conform(host.querySelector('nav')!, 'breadcrumb:basic')
  })

  it('should conform to the pagination fixture', async () => {
    const page = shallowRef(1)
    const host = mount(() => h(BPagination, {
      'modelValue': page.value,
      'onUpdate:modelValue': (value: unknown) => {
        if (!isNumber(value)) return
        page.value = value
      },
      'total': 3,
      'label': 'Page navigation example',
    }, () => [
      h(BPagination.Prev),
      h(BPagination.Item, { value: 1 }, () => '1'),
      h(BPagination.Item, { value: 2 }, () => '2'),
      h(BPagination.Item, { value: 3 }, () => '3'),
      h(BPagination.Next),
    ]))
    await settle()
    conform(host.querySelector('nav')!, 'pagination:basic')
  })

  it('should advance the 1-based page model from a page link', async () => {
    const page = shallowRef(1)
    const host = mount(() => h(BPagination, {
      'modelValue': page.value,
      'onUpdate:modelValue': (value: unknown) => {
        if (!isNumber(value)) return
        page.value = value
      },
      'total': 3,
    }, () => [
      h(BPagination.Item, { value: 2 }, () => '2'),
    ]))
    await settle()
    const link = host.querySelector('.page-link') as HTMLAnchorElement
    link.click()
    await settle()
    expect(page.value).toBe(2)
  })

  it('should conform to the list group fixtures', async () => {
    const host = mount(() => h('div', [
      h(BListGroup, {}, () => [
        h(BListGroup.Item, {}, () => 'An item'),
        h(BListGroup.Item, { active: true }, () => 'An active item'),
        h(BListGroup.Item, {}, () => 'A third item'),
      ]),
      h(BListGroup, { flush: true }, () => h(BListGroup.Item, {}, () => 'An item')),
      h(BListGroup, { numbered: true }, () => [
        h(BListGroup.Item, {}, () => 'A list item'),
        h(BListGroup.Item, {}, () => 'A list item'),
      ]),
      h(BListGroup, { as: 'div' }, () => [
        h(BListGroup.Item, { action: true, active: true }, () => 'The current button'),
        h(BListGroup.Item, { action: true }, () => 'A second button item'),
      ]),
    ]))
    await settle()
    conform(host.querySelector('ul.list-group')!, 'list-group:basic')
    conform(host.querySelector('.list-group-flush')!, 'list-group:flush')
    conform(host.querySelector('ol.list-group')!, 'list-group:numbered')
    conform(host.querySelector('div.list-group')!, 'list-group:action')
  })

  it('should store the active id when a list group is selectable', async () => {
    const current = shallowRef('a')
    const host = mount(() => h(BListGroup, {
      'as': 'div',
      'selectable': true,
      'modelValue': current.value,
      'onUpdate:modelValue': (value: unknown) => {
        if (!isString(value)) return
        current.value = value
      },
    }, () => [
      h(BListGroup.Item, { action: true, value: 'a' }, () => 'First'),
      h(BListGroup.Item, { action: true, value: 'b' }, () => 'Second'),
    ]))
    await settle()
    const buttons = host.querySelectorAll('button')
    expect(buttons[0]?.classList.contains('active')).toBe(true)
    ;(buttons[1] as HTMLButtonElement).click()
    await settle()
    expect(current.value).toBe('b')
  })

  it('should conform to the avatar fixtures', async () => {
    const host = mount(() => h('div', [
      h(BAvatar, { src: 'https://github.com/mdo.png', alt: 'mdo' }),
      h(BAvatar, {}, () => 'AB'),
      h(BAvatar, { subtle: true }, () => 'CD'),
      h(BAvatar, { src: 'https://github.com/mdo.png', alt: 'mdo', status: 'online' }),
      h(BAvatar, { src: 'https://github.com/mdo.png', alt: 'mdo', size: 'sm' }),
    ]))
    await settle()
    const avatars = host.querySelectorAll('.avatar')
    conform(avatars[0]!, 'avatar:basic')
    conform(avatars[1]!, 'avatar:initials')
    conform(avatars[2]!, 'avatar:subtle')
    conform(avatars[3]!, 'avatar:status')
    conform(avatars[4]!, 'avatar:small')
  })
})
