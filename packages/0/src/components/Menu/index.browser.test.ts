import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Context
import { useMenuSub } from './MenuSub.vue'

import { Menu, useMenuRoot } from './index'

// Utilities
import { isBoolean, isString } from '#v0/utilities'
import { mount as baseMount } from '@vue/test-utils'
import { defineComponent, h, nextTick, shallowRef } from 'vue'

// Types
import type { ID } from '#v0/types'
import type { MenuRootContext } from './MenuRoot.vue'
import type { VueWrapper } from '@vue/test-utils'
import type { VNode } from 'vue'

const wrappers: VueWrapper[] = []

function mount (component: ReturnType<typeof defineComponent>): VueWrapper {
  const wrapper = baseMount(component, { attachTo: document.body })
  wrappers.push(wrapper)
  return wrapper
}

beforeEach(async () => {
  await userEvent.unhover(document.body)
})

afterEach(() => {
  while (wrappers.length > 0) {
    wrappers.pop()?.unmount()
  }
})

async function settle () {
  await nextTick()
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 0))
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 0))
}

async function click (target: { element: Element }) {
  target.element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }))
  await nextTick()
}

function wait (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function captureMenu (slot: { api?: MenuRootContext }) {
  return defineComponent({
    name: 'MenuCoverageProbe',
    setup () {
      slot.api = useMenuRoot('v0:menu')
      return () => null
    },
  })
}

function captureSub (slot: { id?: ID }) {
  return defineComponent({
    name: 'MenuSubProbe',
    setup () {
      slot.id = useMenuSub().id
      return () => null
    },
  })
}

function item (wrapper: VueWrapper, role: string, text: string) {
  const found = wrapper.findAll(`[role="${role}"]`).find(node => node.text() === text)
  expect(found, `${role} ${text}`).toBeTruthy()
  return found!
}

function openMenus (wrapper: VueWrapper) {
  return wrapper.findAll('[role="menu"][data-open="true"]')
}

function submenuOpen (wrapper: VueWrapper, label: string) {
  return openMenus(wrapper).some(node => {
    const text = node.text()
    return text.includes(label) && !text.includes('Share') && !text.includes('Export') && !text.includes('Copy')
  })
}

describe('menu', () => {
  function dropdown (extra?: () => VNode[]) {
    return defineComponent({
      setup () {
        return () => h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
          default: () => [
            h(Menu.Activator, null, () => 'Actions'),
            h(Menu.Content, null, () => [
              h(Menu.Item, null, () => 'Copy'),
              h(Menu.Item, null, () => 'Paste'),
              ...(extra?.() ?? []),
            ]),
          ],
        })
      },
    })
  }

  it('should open on click and expose menu items', async () => {
    const wrapper = mount(dropdown())

    expect(openMenus(wrapper)).toHaveLength(0)

    await click(wrapper.get('button'))
    await settle()

    const menus = openMenus(wrapper)
    expect(menus).toHaveLength(1)
    expect(menus[0]?.attributes('role')).toBe('menu')
    expect(item(wrapper, 'menuitem', 'Copy').exists()).toBe(true)
    expect(item(wrapper, 'menuitem', 'Paste').exists()).toBe(true)
  })

  it('should return focus to the activator on escape', async () => {
    const wrapper = mount(dropdown())
    const trigger = wrapper.get('button')

    await click(trigger)
    await settle()
    await openMenus(wrapper)[0]?.trigger('keydown', { key: 'Escape' })
    await settle()

    expect(openMenus(wrapper)).toHaveLength(0)
    expect(document.activeElement).toBe(trigger.element)
  })

  it('should open a submenu with arrow right and close one level with arrow left', async () => {
    const wrapper = mount(dropdown(() => [
      h(Menu.Sub, null, () => [
        h(Menu.SubActivator, null, () => 'Share'),
        h(Menu.SubContent, null, () => [
          h(Menu.Item, null, () => 'Email'),
        ]),
      ]),
    ]))

    await click(wrapper.get('button'))
    await settle()

    const menu = openMenus(wrapper)[0]
    await menu?.trigger('keydown', { key: 'ArrowDown' })
    await menu?.trigger('keydown', { key: 'ArrowDown' })
    await menu?.trigger('keydown', { key: 'ArrowDown' })
    await menu?.trigger('keydown', { key: 'ArrowRight' })
    await settle()

    const submenu = openMenus(wrapper).find(node => !node.text().includes('Copy'))
    expect(submenu?.text()).toContain('Email')
    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Email').element)

    await submenu?.trigger('keydown', { key: 'ArrowLeft' })
    await settle()

    expect(openMenus(wrapper).some(node => !node.text().includes('Copy'))).toBe(false)
    expect(openMenus(wrapper)).toHaveLength(1)
    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Share').element)
  })

  it('should keep a click-opened submenu open after the pointer leaves', async () => {
    const wrapper = mount(dropdown(() => [
      h(Menu.Sub, null, () => [
        h(Menu.SubActivator, null, () => 'Share'),
        h(Menu.SubContent, null, () => [
          h(Menu.Item, null, () => 'Email'),
        ]),
      ]),
    ]))

    await click(wrapper.get('button'))
    await settle()
    await item(wrapper, 'menuitem', 'Share').trigger('click')
    await settle()

    const submenu = openMenus(wrapper).find(node => !node.text().includes('Copy'))
    expect(submenu).toBeTruthy()
    await submenu?.trigger('pointerleave')
    await settle()

    expect(openMenus(wrapper).some(node => node.text().includes('Email'))).toBe(true)
  })

  it('should open from a context menu event', async () => {
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Menu.Root, null, {
          default: () => [
            h(Menu.Context, null, () => 'Surface'),
            h(Menu.Content, null, () => [
              h(Menu.Item, null, () => 'Copy'),
            ]),
          ],
        })
      },
    }))

    await wrapper.get('div').trigger('contextmenu', { clientX: 12, clientY: 24 })
    await settle()

    expect(openMenus(wrapper)).toHaveLength(1)
    expect(item(wrapper, 'menuitem', 'Copy').exists()).toBe(true)
    expect(document.activeElement).toBe(openMenus(wrapper)[0]?.element)
    expect(item(wrapper, 'menuitem', 'Copy').attributes('data-highlighted')).toBeUndefined()
  })

  it('should move across a menubar and open the focused menu', async () => {
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Menu.Root, null, {
          default: () => [
            h(Menu.Bar, null, () => [
              h(Menu.Activator, { value: 'file' }, () => 'File'),
              h(Menu.Activator, { value: 'edit' }, () => 'Edit'),
            ]),
            h(Menu.Content, { value: 'file' }, () => [
              h(Menu.Item, null, () => 'New'),
            ]),
            h(Menu.Content, { value: 'edit' }, () => [
              h(Menu.Item, null, () => 'Undo'),
            ]),
          ],
        })
      },
    }))

    const file = item(wrapper, 'menuitem', 'File')
    ;(file.element as HTMLElement).focus()
    await settle()

    await file.trigger('keydown', { key: 'ArrowRight' })
    await settle()

    const edit = item(wrapper, 'menuitem', 'Edit')
    expect(document.activeElement).toBe(edit.element)

    await edit.trigger('keydown', { key: 'ArrowDown' })
    await settle()

    const menu = openMenus(wrapper)
    expect(menu).toHaveLength(1)
    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Undo').element)
  })

  it('should focus a matching item from typeahead', async () => {
    const wrapper = mount(dropdown())

    await click(wrapper.get('button'))
    await settle()
    await openMenus(wrapper)[0]?.trigger('keydown', { key: 'p' })
    await settle()

    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Paste').element)
  })

  it('should cycle typeahead through items sharing a repeated letter', async () => {
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Menu.Root, null, {
          default: () => [
            h(Menu.Activator, null, () => 'Fruit'),
            h(Menu.Content, null, () => [
              h(Menu.Item, null, () => 'Apple'),
              h(Menu.Item, null, () => 'Banana'),
              h(Menu.Item, null, () => 'Avocado'),
            ]),
          ],
        })
      },
    }))

    await click(wrapper.get('button'))
    await settle()

    await userEvent.keyboard('a')
    await settle()
    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Apple').element)

    await userEvent.keyboard('a')
    await settle()
    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Avocado').element)

    await userEvent.keyboard('a')
    await settle()
    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Apple').element)
  })

  it('should open on the first item from enter or space on the activator', async () => {
    const wrapper = mount(dropdown())
    const trigger = wrapper.get('button')

    for (const key of ['{Enter}', '{ }']) {
      ;(trigger.element as HTMLElement).focus()
      await userEvent.keyboard(key)
      await settle()

      expect(openMenus(wrapper)).toHaveLength(1)
      expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Copy').element)
      expect(item(wrapper, 'menuitem', 'Copy').attributes('data-highlighted')).toBe('true')

      await userEvent.keyboard('{Escape}')
      await settle()
      expect(openMenus(wrapper)).toHaveLength(0)
    }
  })

  it('should keep focus on an outside input after a light dismiss', async () => {
    const dropdownMenu = dropdown()
    const contextMenu = defineComponent({
      setup () {
        return () => h(Menu.Root, null, {
          default: () => [
            h(Menu.Context, null, () => 'Surface'),
            h(Menu.Content, null, () => [
              h(Menu.Item, null, () => 'Copy'),
            ]),
          ],
        })
      },
    })
    const wrapper = mount(defineComponent({
      setup () {
        return () => h('div', [
          h('input', { 'aria-label': 'Outside' }),
          h(dropdownMenu),
          h(contextMenu),
        ])
      },
    }))
    const input = wrapper.get('input').element

    await click(wrapper.get('button'))
    await settle()
    expect(openMenus(wrapper)).toHaveLength(1)

    await userEvent.click(input)
    await settle()
    expect(openMenus(wrapper)).toHaveLength(0)
    expect(document.activeElement).toBe(input)

    const host = wrapper.findAll('div').find(node => node.text() === 'Surface')
    await host?.trigger('contextmenu', { clientX: 12, clientY: 24 })
    await settle()
    expect(openMenus(wrapper)).toHaveLength(1)

    await userEvent.click(input)
    await settle()
    expect(openMenus(wrapper)).toHaveLength(0)
    expect(document.activeElement).toBe(input)
  })

  it('should toggle a checkbox without closing', async () => {
    const checked = shallowRef(false)
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Menu.Root, null, {
          default: () => [
            h(Menu.Activator, null, () => 'Format'),
            h(Menu.Content, null, () => [
              h(Menu.CheckboxItem, {
                'checked': checked.value,
                'onUpdate:checked': (value: unknown) => {
                  if (isBoolean(value)) checked.value = value
                },
              }, () => 'Bold'),
            ]),
          ],
        })
      },
    }))

    await click(wrapper.get('button'))
    await settle()
    await item(wrapper, 'menuitemcheckbox', 'Bold').trigger('click')
    await settle()

    expect(checked.value).toBe(true)
    expect(item(wrapper, 'menuitemcheckbox', 'Bold').attributes('aria-checked')).toBe('true')
    expect(openMenus(wrapper)).toHaveLength(1)
  })

  it('should select a radio without closing', async () => {
    const align = shallowRef('left')
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Menu.Root, null, {
          default: () => [
            h(Menu.Activator, null, () => 'Format'),
            h(Menu.Content, null, () => [
              h(Menu.RadioGroup, {
                'modelValue': align.value,
                'onUpdate:modelValue': (value: unknown) => {
                  if (isString(value)) align.value = value
                },
              }, () => [
                h(Menu.RadioItem, { value: 'left' }, () => 'Left'),
                h(Menu.RadioItem, { value: 'right' }, () => 'Right'),
              ]),
            ]),
          ],
        })
      },
    }))

    await click(wrapper.get('button'))
    await settle()
    await item(wrapper, 'menuitemradio', 'Right').trigger('click')
    await settle()

    expect(align.value).toBe('right')
    expect(item(wrapper, 'menuitemradio', 'Right').attributes('aria-checked')).toBe('true')
    expect(item(wrapper, 'menuitemradio', 'Left').attributes('aria-checked')).toBe('false')
    expect(openMenus(wrapper)).toHaveLength(1)
  })

  it('should keep arrow keys inside a submenu and not reopen after a nested action', async () => {
    const wrapper = mount(dropdown(() => [
      h(Menu.Sub, null, () => [
        h(Menu.SubActivator, null, () => 'Share'),
        h(Menu.SubContent, null, () => [
          h(Menu.Item, null, () => 'Email'),
          h(Menu.Item, null, () => 'Message'),
        ]),
      ]),
    ]))

    await click(wrapper.get('button'))
    await settle()
    await item(wrapper, 'menuitem', 'Share').trigger('click')
    await settle()

    const email = item(wrapper, 'menuitem', 'Email')
    ;(email.element as HTMLElement).focus()
    await email.trigger('keydown', { key: 'ArrowDown' })
    await settle()

    const message = item(wrapper, 'menuitem', 'Message')
    expect(document.activeElement).toBe(message.element)
    const submenu = openMenus(wrapper).find(node => !node.text().includes('Copy'))
    expect(submenu?.element.contains(document.activeElement)).toBe(true)

    await message.trigger('keydown', { key: 'Enter' })
    await settle()

    expect(openMenus(wrapper)).toHaveLength(0)
  })

  it('should move to the next menubar menu with arrow left when the root is rtl', async () => {
    const wrapper = mount(defineComponent({
      setup () {
        return () => h('div', { dir: 'rtl' }, [
          h(Menu.Root, null, {
            default: () => [
              h(Menu.Bar, null, () => [
                h(Menu.Activator, { value: 'file' }, () => 'File'),
                h(Menu.Activator, { value: 'edit' }, () => 'Edit'),
              ]),
              h(Menu.Content, { value: 'file' }, () => [
                h(Menu.Item, null, () => 'New'),
              ]),
              h(Menu.Content, { value: 'edit' }, () => [
                h(Menu.Item, null, () => 'Undo'),
              ]),
            ],
          }),
        ])
      },
    }))

    await click(item(wrapper, 'menuitem', 'File'))
    await settle()
    expect(document.activeElement).toBe(openMenus(wrapper)[0]?.element)
    expect(item(wrapper, 'menuitem', 'New').attributes('data-highlighted')).toBeUndefined()

    await openMenus(wrapper)[0]?.trigger('keydown', { key: 'ArrowLeft' })
    await settle()
    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Undo').element)

    await openMenus(wrapper)[0]?.trigger('keydown', { key: 'ArrowRight' })
    await settle()
    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'New').element)
  })

  it('should focus the menu when mounted with the layer already open', async () => {
    const open = shallowRef<string | null>('actions')
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Menu.Root, {
          'modelValue': open.value,
          'onUpdate:modelValue': (value: unknown) => {
            open.value = isString(value) ? value : null
          },
        }, {
          default: () => [
            h(Menu.Activator, { value: 'actions' }, () => 'Actions'),
            h(Menu.Content, { value: 'actions' }, () => [
              h(Menu.Item, null, () => 'Copy'),
              h(Menu.Item, null, () => 'Paste'),
            ]),
          ],
        })
      },
    }))

    await settle()

    expect(openMenus(wrapper)).toHaveLength(1)
    expect(document.activeElement).toBe(openMenus(wrapper)[0]?.element)
    expect(item(wrapper, 'menuitem', 'Copy').attributes('data-highlighted')).toBeUndefined()
  })

  it('should open the root value when the children omit value', async () => {
    const open = shallowRef<string | null>('actions')
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Menu.Root, {
          'value': 'actions',
          'modelValue': open.value,
          'onUpdate:modelValue': (value: unknown) => {
            open.value = isString(value) ? value : null
          },
        }, {
          default: () => [
            h(Menu.Activator, null, () => 'Actions'),
            h(Menu.Content, null, () => [
              h(Menu.Item, null, () => 'Copy'),
              h(Menu.Item, null, () => 'Paste'),
            ]),
          ],
        })
      },
    }))

    await settle()

    expect(openMenus(wrapper)).toHaveLength(1)
    expect(document.activeElement).toBe(openMenus(wrapper)[0]?.element)
    expect(item(wrapper, 'menuitem', 'Copy').attributes('data-highlighted')).toBeUndefined()
  })

  it('should return focus to the context host on escape', async () => {
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Menu.Root, null, {
          default: () => [
            h(Menu.Context, null, () => 'Surface'),
            h(Menu.Content, null, () => [
              h(Menu.Item, null, () => 'Copy'),
            ]),
          ],
        })
      },
    }))

    const host = wrapper.get('div')
    const sentinel = wrapper.get('[aria-hidden="true"]')

    await host.trigger('contextmenu', { clientX: 12, clientY: 24 })
    await settle()
    await openMenus(wrapper)[0]?.trigger('keydown', { key: 'Escape' })
    await settle()

    expect(openMenus(wrapper)).toHaveLength(0)
    expect(document.activeElement).toBe(host.element)
    expect(document.activeElement).not.toBe(document.body)
    expect(document.activeElement).not.toBe(sentinel.element)
  })

  it('should close on tab without taking focus back', async () => {
    const wrapper = mount(defineComponent({
      setup () {
        return () => h('div', [
          h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
            default: () => [
              h(Menu.Activator, null, () => 'Actions'),
              h(Menu.Content, null, () => [
                h(Menu.Item, null, () => 'Copy'),
              ]),
            ],
          }),
          h('input', { 'aria-label': 'After' }),
        ])
      },
    }))

    await click(wrapper.get('button'))
    await settle()

    const menu = openMenus(wrapper)[0]
    expect(menu).toBeTruthy()
    let prevented = true
    function onKeydown (event: Event) {
      prevented = event.defaultPrevented
    }
    const node = menu?.element
    expect(node).toBeInstanceOf(Element)
    node?.addEventListener('keydown', onKeydown)

    await userEvent.tab()
    node?.removeEventListener('keydown', onKeydown)
    await settle()

    expect(prevented).toBe(false)
    expect(openMenus(wrapper)).toHaveLength(0)
    expect(document.activeElement).toBe(wrapper.get('input').element)
    expect(document.activeElement).not.toBe(wrapper.get('button').element)
  })

  it('should close when the activator is clicked again', async () => {
    const wrapper = mount(dropdown())
    const trigger = wrapper.get('button')

    await click(trigger)
    await settle()
    expect(openMenus(wrapper)).toHaveLength(1)

    await click(trigger)
    await settle()
    expect(openMenus(wrapper)).toHaveLength(0)
  })

  it('should close when an action item is clicked', async () => {
    const wrapper = mount(dropdown())

    await click(wrapper.get('button'))
    await settle()
    await item(wrapper, 'menuitem', 'Copy').trigger('click')
    await settle()

    expect(openMenus(wrapper)).toHaveLength(0)
  })

  it('should open the first item from arrow down and the last from arrow up', async () => {
    const wrapper = mount(dropdown())
    const trigger = wrapper.get('button')

    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await settle()
    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Copy').element)

    await openMenus(wrapper)[0]?.trigger('keydown', { key: 'Escape' })
    await settle()
    expect(openMenus(wrapper)).toHaveLength(0)
    expect(document.activeElement).toBe(trigger.element)

    await trigger.trigger('keydown', { key: 'ArrowUp' })
    await settle()
    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Paste').element)
  })

  it('should ignore a click on a disabled item', async () => {
    const action = vi.fn()
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
          default: () => [
            h(Menu.Activator, null, () => 'Actions'),
            h(Menu.Content, null, () => [
              h(Menu.Item, { disabled: true, onClick: action }, () => 'Copy'),
            ]),
          ],
        })
      },
    }))

    await click(wrapper.get('button'))
    await settle()
    await item(wrapper, 'menuitem', 'Copy').trigger('click')
    await settle()

    expect(action).toHaveBeenCalledTimes(0)
    expect(openMenus(wrapper)).toHaveLength(1)
  })

  it('should ignore a click on a disabled checkbox, radio, or submenu item', async () => {
    const action = vi.fn()
    const checked = shallowRef(false)
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
          default: () => [
            h(Menu.Activator, null, () => 'Actions'),
            h(Menu.Content, null, () => [
              h(Menu.CheckboxItem, {
                'disabled': true,
                'checked': checked.value,
                'onUpdate:checked': (value: unknown) => {
                  if (isBoolean(value)) checked.value = value
                },
                'onClick': action,
              }, () => 'Bold'),
              h(Menu.RadioGroup, null, () => [
                h(Menu.RadioItem, { value: 'one', disabled: true, onClick: action }, () => 'One'),
              ]),
              h(Menu.Sub, null, () => [
                h(Menu.SubActivator, { disabled: true, onClick: action }, () => 'Share'),
                h(Menu.SubContent, null, () => [
                  h(Menu.Item, null, () => 'Email'),
                ]),
              ]),
            ]),
          ],
        })
      },
    }))

    await click(wrapper.get('button'))
    await settle()
    await item(wrapper, 'menuitemcheckbox', 'Bold').trigger('click')
    await item(wrapper, 'menuitemradio', 'One').trigger('click')
    await item(wrapper, 'menuitem', 'Share').trigger('click')
    await settle()

    expect(action).toHaveBeenCalledTimes(0)
    expect(checked.value).toBe(false)
    expect(openMenus(wrapper)).toHaveLength(1)
  })

  it('should highlight the item under the pointer', async () => {
    const wrapper = mount(dropdown())

    await click(wrapper.get('button'))
    await settle()
    await item(wrapper, 'menuitem', 'Paste').trigger('pointerenter')
    await settle()

    expect(item(wrapper, 'menuitem', 'Paste').attributes('data-highlighted')).toBe('true')
    expect(item(wrapper, 'menuitem', 'Copy').attributes('data-highlighted')).toBeUndefined()
    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Paste').element)
  })

  it('should prevent space and enter when no item is highlighted', async () => {
    const wrapper = mount(dropdown())

    await click(wrapper.get('button'))
    await settle()
    const menu = openMenus(wrapper)[0]
    expect(menu).toBeTruthy()

    for (const key of [' ', 'Enter']) {
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
      menu?.element.dispatchEvent(event)
      expect(event.defaultPrevented).toBe(true)
    }

    expect(openMenus(wrapper)).toHaveLength(1)
  })

  it('should leave the parent open when a submenu popover light-dismisses', async () => {
    const wrapper = mount(dropdown(() => [
      h(Menu.Sub, null, () => [
        h(Menu.SubActivator, null, () => 'Share'),
        h(Menu.SubContent, null, () => [
          h(Menu.Item, null, () => 'Email'),
        ]),
      ]),
    ]))

    await click(wrapper.get('button'))
    await settle()
    await item(wrapper, 'menuitem', 'Share').trigger('click')
    await settle()

    const submenu = openMenus(wrapper).find(node => !node.text().includes('Copy'))
    expect(submenu).toBeTruthy()
    if (submenu?.element instanceof HTMLElement) submenu.element.hidePopover()
    await settle()

    expect(openMenus(wrapper)).toHaveLength(1)
    expect(openMenus(wrapper)[0]?.text()).toContain('Copy')
    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Share').element)
  })

  it('should open from pointer enter and stay open after a click when open on hover', async () => {
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Menu.Root, { openOnHover: true, openDelay: 0, closeDelay: 0 }, {
          default: () => [
            h(Menu.Activator, null, () => 'Actions'),
            h(Menu.Content, null, () => [
              h(Menu.Item, null, () => 'Copy'),
            ]),
          ],
        })
      },
    }))

    const trigger = wrapper.get('button')

    await trigger.trigger('pointerenter')
    await settle()
    expect(openMenus(wrapper)).toHaveLength(1)

    await trigger.trigger('pointerleave')
    await settle()
    expect(openMenus(wrapper)).toHaveLength(0)

    await click(trigger)
    await settle()
    expect(openMenus(wrapper)).toHaveLength(1)

    await trigger.trigger('pointerleave')
    await settle()
    expect(openMenus(wrapper)).toHaveLength(1)
  })

  it('should keep a hover-opened menu open when the pointer leaves an item', async () => {
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Menu.Root, { openOnHover: true, openDelay: 0, closeDelay: 0 }, {
          default: () => [
            h(Menu.Activator, null, () => 'Actions'),
            h(Menu.Content, null, () => [
              h(Menu.Item, null, () => 'Copy'),
              h(Menu.Separator),
            ]),
          ],
        })
      },
    }))

    await wrapper.get('button').trigger('pointerenter')
    await settle()
    expect(openMenus(wrapper)).toHaveLength(1)

    await item(wrapper, 'menuitem', 'Copy').trigger('pointerleave')
    await settle()
    expect(openMenus(wrapper)).toHaveLength(1)

    await openMenus(wrapper)[0]?.trigger('pointerleave')
    await settle()
    expect(openMenus(wrapper)).toHaveLength(0)
  })

  it('should close when the open content unmounts', async () => {
    const shown = shallowRef(true)
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
          default: () => [
            h(Menu.Activator, null, () => 'Actions'),
            shown.value
              ? h(Menu.Content, null, () => [
                  h(Menu.Item, null, () => 'Copy'),
                ])
              : null,
          ],
        })
      },
    }))

    const trigger = wrapper.get('button')
    await click(trigger)
    await settle()
    expect(openMenus(wrapper)).toHaveLength(1)
    expect(trigger.attributes('aria-expanded')).toBe('true')

    shown.value = false
    await settle()

    expect(openMenus(wrapper)).toHaveLength(0)
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.attributes('data-open')).toBeUndefined()
  })

  it('should not reopen after the model is cleared during a submenu delay', async () => {
    const open = shallowRef<string | null>(null)
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Menu.Root, {
          'modelValue': open.value,
          'onUpdate:modelValue': (value: unknown) => {
            open.value = isString(value) ? value : null
          },
          'openDelay': 80,
          'closeDelay': 0,
        }, {
          default: () => [
            h(Menu.Activator, { value: 'actions' }, () => 'Actions'),
            h(Menu.Content, { value: 'actions' }, () => [
              h(Menu.Sub, null, () => [
                h(Menu.SubActivator, null, () => 'Share'),
                h(Menu.SubContent, null, () => [
                  h(Menu.Item, null, () => 'Email'),
                ]),
              ]),
            ]),
          ],
        })
      },
    }))

    await click(wrapper.get('button'))
    await settle()
    expect(open.value).toBe('actions')

    await item(wrapper, 'menuitem', 'Share').trigger('pointerenter')
    open.value = null
    await settle()
    expect(openMenus(wrapper)).toHaveLength(0)

    await new Promise(resolve => setTimeout(resolve, 120))
    expect(openMenus(wrapper)).toHaveLength(0)
    expect(open.value).toBeNull()
  })

  it('should highlight the first item on arrow down and the last on arrow up after a click', async () => {
    const wrapper = mount(dropdown())
    const trigger = wrapper.get('button')

    await click(trigger)
    await settle()

    const menu = openMenus(wrapper)[0]
    expect(menu).toBeTruthy()
    expect(document.activeElement).toBe(menu?.element)
    expect(item(wrapper, 'menuitem', 'Copy').attributes('data-highlighted')).toBeUndefined()

    await menu?.trigger('keydown', { key: 'ArrowDown' })
    await settle()
    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Copy').element)
    expect(item(wrapper, 'menuitem', 'Copy').attributes('data-highlighted')).toBe('true')

    await menu?.trigger('keydown', { key: 'Escape' })
    await settle()

    await click(trigger)
    await settle()
    await openMenus(wrapper)[0]?.trigger('keydown', { key: 'ArrowUp' })
    await settle()
    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Paste').element)
    expect(item(wrapper, 'menuitem', 'Paste').attributes('data-highlighted')).toBe('true')
  })

  it('should move the menubar highlight when hovering another activator', async () => {
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Menu.Root, null, {
          default: () => [
            h(Menu.Bar, null, () => [
              h(Menu.Activator, { value: 'file' }, () => 'File'),
              h(Menu.Activator, { value: 'edit' }, () => 'Edit'),
            ]),
            h(Menu.Content, { value: 'file' }, () => [
              h(Menu.Item, null, () => 'New'),
            ]),
            h(Menu.Content, { value: 'edit' }, () => [
              h(Menu.Item, null, () => 'Undo'),
            ]),
          ],
        })
      },
    }))

    await click(item(wrapper, 'menuitem', 'Edit'))
    await settle()
    expect(item(wrapper, 'menuitem', 'Edit').attributes('data-highlighted')).toBe('true')
    expect(item(wrapper, 'menuitem', 'Undo').attributes('data-highlighted')).toBeUndefined()

    await item(wrapper, 'menuitem', 'File').trigger('pointerenter')
    await settle()

    expect(item(wrapper, 'menuitem', 'Edit').attributes('data-highlighted')).toBeUndefined()
    expect(item(wrapper, 'menuitem', 'File').attributes('data-highlighted')).toBe('true')
    expect(openMenus(wrapper)).toHaveLength(1)
    expect(openMenus(wrapper)[0]?.text()).toContain('New')
    expect(item(wrapper, 'menuitem', 'New').attributes('data-highlighted')).toBeUndefined()
  })

  it('should close a sibling submenu before the next one opens', async () => {
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Menu.Root, { openDelay: 80, closeDelay: 0 }, {
          default: () => [
            h(Menu.Activator, null, () => 'Actions'),
            h(Menu.Content, null, () => [
              h(Menu.Sub, null, () => [
                h(Menu.SubActivator, null, () => 'Share'),
                h(Menu.SubContent, null, () => [
                  h(Menu.Item, null, () => 'Email'),
                ]),
              ]),
              h(Menu.Sub, null, () => [
                h(Menu.SubActivator, null, () => 'Export'),
                h(Menu.SubContent, null, () => [
                  h(Menu.Item, null, () => 'PDF'),
                ]),
              ]),
            ]),
          ],
        })
      },
    }))

    await click(wrapper.get('button'))
    await settle()
    await item(wrapper, 'menuitem', 'Share').trigger('click')
    await settle()
    expect(submenuOpen(wrapper, 'Email')).toBe(true)

    await item(wrapper, 'menuitem', 'Export').trigger('pointerenter')
    await settle()

    expect(submenuOpen(wrapper, 'Email')).toBe(false)
    expect(submenuOpen(wrapper, 'PDF')).toBe(false)
    expect(openMenus(wrapper)).toHaveLength(1)

    await new Promise(resolve => setTimeout(resolve, 120))
    expect(submenuOpen(wrapper, 'PDF')).toBe(true)
    expect(submenuOpen(wrapper, 'Email')).toBe(false)
  })

  it('should open the next menubar menu when arrow keys move off a hover-opened activator', async () => {
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Menu.Root, { openOnHover: true, openDelay: 0, closeDelay: 0 }, {
          default: () => [
            h(Menu.Bar, null, () => [
              h(Menu.Activator, { value: 'file' }, () => 'File'),
              h(Menu.Activator, { value: 'edit' }, () => 'Edit'),
            ]),
            h(Menu.Content, { value: 'file' }, () => [
              h(Menu.Item, null, () => 'New'),
            ]),
            h(Menu.Content, { value: 'edit' }, () => [
              h(Menu.Item, null, () => 'Undo'),
            ]),
          ],
        })
      },
    }))

    const file = item(wrapper, 'menuitem', 'File')
    await file.trigger('pointerenter')
    await settle()

    expect(openMenus(wrapper)).toHaveLength(1)
    expect(openMenus(wrapper)[0]?.text()).toContain('New')
    expect(item(wrapper, 'menuitem', 'New').attributes('data-highlighted')).toBeUndefined()

    await file.trigger('keydown', { key: 'ArrowRight' })
    await settle()

    expect(openMenus(wrapper)).toHaveLength(1)
    expect(openMenus(wrapper)[0]?.text()).toContain('Undo')
    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Undo').element)
  })

  it('should forget the parent typeahead when a submenu opens', async () => {
    const wrapper = mount(dropdown(() => [
      h(Menu.Sub, null, () => [
        h(Menu.SubActivator, null, () => 'Share'),
        h(Menu.SubContent, null, () => [
          h(Menu.Item, null, () => 'Email'),
          h(Menu.Item, null, () => 'Link'),
        ]),
      ]),
    ]))

    await click(wrapper.get('button'))
    await settle()

    const menu = openMenus(wrapper)[0]
    await menu?.trigger('keydown', { key: 'x' })
    await menu?.trigger('keydown', { key: 'ArrowDown' })
    await menu?.trigger('keydown', { key: 'ArrowDown' })
    await menu?.trigger('keydown', { key: 'ArrowDown' })
    await menu?.trigger('keydown', { key: 'ArrowRight' })
    await settle()

    const submenu = openMenus(wrapper).find(node => node.text().includes('Email') && !node.text().includes('Copy'))
    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Email').element)

    await submenu?.trigger('keydown', { key: 'l' })
    await settle()

    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Link').element)
  })

  it('should clear typeahead when a pointer closes a submenu before the next one opens', async () => {
    const wrapper = mount(defineComponent({
      setup () {
        return () => h(Menu.Root, { openDelay: 80, closeDelay: 0 }, {
          default: () => [
            h(Menu.Activator, null, () => 'Actions'),
            h(Menu.Content, null, () => [
              h(Menu.Item, null, () => 'Copy'),
              h(Menu.Item, null, () => 'Paste'),
              h(Menu.Sub, null, () => [
                h(Menu.SubActivator, null, () => 'Share'),
                h(Menu.SubContent, null, () => [
                  h(Menu.Item, null, () => 'Email'),
                ]),
              ]),
              h(Menu.Sub, null, () => [
                h(Menu.SubActivator, null, () => 'Export'),
                h(Menu.SubContent, null, () => [
                  h(Menu.Item, null, () => 'PDF'),
                ]),
              ]),
            ]),
          ],
        })
      },
    }))

    await click(wrapper.get('button'))
    await settle()

    const menu = openMenus(wrapper)[0]
    await menu?.trigger('keydown', { key: 'ArrowDown' })
    await menu?.trigger('keydown', { key: 'ArrowDown' })
    await menu?.trigger('keydown', { key: 'ArrowDown' })
    await menu?.trigger('keydown', { key: 'ArrowRight' })
    await settle()

    const submenu = openMenus(wrapper).find(node => node.text().includes('Email') && !node.text().includes('Copy'))
    await submenu?.trigger('keydown', { key: 'x' })

    const exportItem = item(wrapper, 'menuitem', 'Export')
    await exportItem.trigger('pointerenter')
    await exportItem.trigger('pointerleave')
    await settle()

    expect(submenuOpen(wrapper, 'Email')).toBe(false)
    expect(submenuOpen(wrapper, 'PDF')).toBe(false)

    await menu?.trigger('keydown', { key: 'p' })
    await settle()
    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Paste').element)

    await new Promise(resolve => setTimeout(resolve, 120))
    expect(submenuOpen(wrapper, 'PDF')).toBe(false)
  })

  describe('coverage', () => {
    it('should ignore a disabled activator and open a non-button from enter or space', async () => {
      const wrapper = mount(defineComponent({
        setup () {
          return () => h('div', [
            h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
              default: () => [
                h(Menu.Activator, { disabled: true }, () => 'Locked'),
                h(Menu.Content, null, () => [
                  h(Menu.Item, null, () => 'Copy'),
                ]),
              ],
            }),
            h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
              default: () => [
                h(Menu.Activator, { as: 'div', disabled: true }, () => 'Off'),
                h(Menu.Content, null, () => [
                  h(Menu.Item, null, () => 'Copy'),
                ]),
              ],
            }),
            h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
              default: () => [
                h(Menu.Activator, null, () => 'Plain'),
                h(Menu.Content, null, () => [
                  h(Menu.Item, null, () => 'Copy'),
                ]),
              ],
            }),
            h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
              default: () => [
                h(Menu.Activator, { as: 'div' }, () => 'Actions'),
                h(Menu.Content, null, () => [
                  h(Menu.Item, null, () => 'Copy'),
                  h(Menu.Item, null, () => 'Paste'),
                ]),
              ],
            }),
          ])
        },
      }))

      const locked = wrapper.get('button')
      expect((locked.element as HTMLButtonElement).disabled).toBe(true)
      expect(locked.attributes('tabindex')).toBe('-1')
      expect(locked.attributes('aria-disabled')).toBeUndefined()

      const blocked = new MouseEvent('click', { bubbles: true, cancelable: true })
      locked.element.dispatchEvent(blocked)
      await settle()
      expect(blocked.defaultPrevented).toBe(true)
      expect(openMenus(wrapper)).toHaveLength(0)

      await locked.trigger('pointerenter')
      await settle()
      expect(openMenus(wrapper)).toHaveLength(0)

      const off = wrapper.findAll('[role="button"]').find(node => node.text() === 'Off')
      expect(off).toBeTruthy()
      expect(off?.attributes('aria-disabled')).toBe('true')
      expect(off?.attributes('disabled')).toBeUndefined()
      expect(off?.attributes('tabindex')).toBe('-1')
      await off?.trigger('pointerenter')
      await settle()
      expect(openMenus(wrapper)).toHaveLength(0)

      const plain = wrapper.findAll('button').find(node => node.text() === 'Plain')
      expect(plain).toBeTruthy()
      await plain?.trigger('keydown', { key: 'x' })
      await settle()
      expect(openMenus(wrapper)).toHaveLength(0)

      const opener = wrapper.findAll('[role="button"]').find(node => node.text() === 'Actions')
      expect(opener).toBeTruthy()
      expect(opener?.attributes('aria-disabled')).toBe('false')
      expect(opener?.attributes('tabindex')).toBe('0')

      await opener?.trigger('keydown', { key: 'x' })
      await settle()
      expect(openMenus(wrapper)).toHaveLength(0)

      await opener?.trigger('keydown', { key: 'Enter' })
      await settle()
      expect(openMenus(wrapper)).toHaveLength(1)

      await openMenus(wrapper)[0]?.trigger('keydown', { key: 'Escape' })
      await settle()
      expect(openMenus(wrapper)).toHaveLength(0)

      await opener?.trigger('keydown', { key: ' ' })
      await settle()
      expect(openMenus(wrapper)).toHaveLength(1)
    })

    it('should operate a menubar from the bar itself', async () => {
      const wrapper = mount(defineComponent({
        setup () {
          return () => h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
            default: () => [
              h(Menu.Bar, null, () => [
                h(Menu.Activator, { value: 'file' }, () => 'File'),
                h(Menu.Activator, { value: 'edit' }, () => 'Edit'),
              ]),
              h(Menu.Content, { value: 'file' }, () => [
                h(Menu.Item, null, () => 'New'),
                h(Menu.Item, null, () => 'Close'),
              ]),
              h(Menu.Content, { value: 'edit' }, () => [
                h(Menu.Item, null, () => 'Undo'),
              ]),
            ],
          })
        },
      }))

      const bar = wrapper.get('[role="menubar"]')
      const file = item(wrapper, 'menuitem', 'File')
      const edit = item(wrapper, 'menuitem', 'Edit')
      expect(file.attributes('tabindex')).toBe('0')
      expect(edit.attributes('tabindex')).toBe('-1')

      await file.trigger('pointerenter')
      await settle()
      expect(openMenus(wrapper)).toHaveLength(0)

      await bar.trigger('keydown', { key: 'ArrowDown' })
      await settle()
      expect(openMenus(wrapper)).toHaveLength(0)

      await file.trigger('keydown', { key: 'ArrowDown' })
      await settle()
      expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'New').element)

      await file.trigger('keydown', { key: 'ArrowUp' })
      await settle()
      expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Close').element)

      await file.trigger('keydown', { key: 'Enter' })
      await settle()
      expect(openMenus(wrapper)).toHaveLength(0)

      await edit.trigger('keydown', { key: ' ' })
      await settle()
      expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Undo').element)

      await edit.trigger('keydown', { key: 'Enter' })
      await settle()
      expect(openMenus(wrapper)).toHaveLength(0)
    })

    it('should ignore menubar keys while disabled, composing, or aimed at nothing', async () => {
      const disabled = mount(defineComponent({
        setup () {
          return () => h(Menu.Root, { disabled: true, openDelay: 0, closeDelay: 0 }, {
            default: () => [
              h(Menu.Bar, null, () => [
                h(Menu.Activator, { value: 'file' }, () => 'File'),
              ]),
              h(Menu.Content, { value: 'file' }, () => [
                h(Menu.Item, null, () => 'New'),
              ]),
            ],
          })
        },
      }))

      disabled.get('[role="menubar"]').element.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      }))
      await settle()
      expect(openMenus(disabled)).toHaveLength(0)

      const composing = mount(defineComponent({
        setup () {
          return () => h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
            default: () => [
              h(Menu.Bar, null, () => [
                h(Menu.Activator, { value: 'file' }, () => 'File'),
              ]),
              h(Menu.Content, { value: 'file' }, () => [
                h(Menu.Item, null, () => 'New'),
              ]),
            ],
          })
        },
      }))

      const host = composing.get('[role="menubar"]')
      const composingEvent = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
        isComposing: true,
      })
      if (!composingEvent.isComposing) {
        Object.defineProperty(composingEvent, 'isComposing', { get: () => true })
      }
      host.element.dispatchEvent(composingEvent)
      await settle()
      expect(composingEvent.defaultPrevented).toBe(false)
      expect(openMenus(composing)).toHaveLength(0)

      const empty = mount(defineComponent({
        setup () {
          return () => h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
            default: () => [
              h(Menu.Bar, null, () => []),
              h(Menu.Content, null, () => [
                h(Menu.Item, null, () => 'Copy'),
              ]),
            ],
          })
        },
      }))

      const bar = empty.get('[role="menubar"]')
      const text = document.createTextNode('')
      bar.element.append(text)
      text.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
      }))
      await bar.trigger('keydown', { key: 'ArrowDown' })
      await settle()
      expect(openMenus(empty)).toHaveLength(0)
    })

    it('should keep the open menu when the next menubar activator shares its layer', async () => {
      const wrapper = mount(defineComponent({
        setup () {
          return () => h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
            default: () => [
              h(Menu.Bar, null, () => [
                h(Menu.Activator, { value: 'file' }, () => 'File'),
                h(Menu.Activator, { value: 'file' }, () => 'Also'),
              ]),
              h(Menu.Content, { value: 'file' }, () => [
                h(Menu.Item, null, () => 'New'),
              ]),
            ],
          })
        },
      }))

      await click(item(wrapper, 'menuitem', 'File'))
      await settle()
      expect(openMenus(wrapper)).toHaveLength(1)

      await item(wrapper, 'menuitem', 'File').trigger('keydown', { key: 'ArrowRight' })
      await settle()
      expect(openMenus(wrapper)).toHaveLength(1)
      expect(openMenus(wrapper)[0]?.text()).toContain('New')
    })

    it('should read labels from the prop and from text, then forget the buffer', async () => {
      const wrapper = mount(defineComponent({
        setup () {
          return () => h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
            default: () => [
              h(Menu.Activator, null, () => 'Actions'),
              h(Menu.Content, null, () => [
                h(Menu.Item, { label: 'Quota' }, () => 'Copy'),
                h(Menu.Item, { label: '' }, () => 'Paste'),
                h(Menu.Item, { renderless: true }, () => 'Hidden'),
                h(Menu.CheckboxItem, { label: 'Emphasis' }, () => 'Bold'),
                h(Menu.CheckboxItem, null, () => 'Italic'),
                h(Menu.CheckboxItem, { renderless: true }, () => 'Gone'),
                h(Menu.RadioGroup, null, () => [
                  h(Menu.RadioItem, { value: 'left', label: 'Left side' }, () => 'Left'),
                  h(Menu.RadioItem, { value: 'right' }, () => 'Right'),
                  h(Menu.RadioItem, { value: 'none', renderless: true }, () => 'None'),
                ]),
                h(Menu.Sub, null, () => [
                  h(Menu.SubActivator, { label: 'Send out' }, () => 'Share'),
                  h(Menu.SubContent, null, () => [
                    h(Menu.Item, null, () => 'Email'),
                  ]),
                ]),
                h(Menu.Sub, null, () => [
                  h(Menu.SubActivator, null, () => 'Export'),
                  h(Menu.SubContent, null, () => [
                    h(Menu.Item, null, () => 'PDF'),
                  ]),
                ]),
                h(Menu.Sub, null, () => [
                  h(Menu.SubActivator, { renderless: true }, () => 'Quiet'),
                ]),
              ]),
            ],
          })
        },
      }))

      await click(wrapper.get('button'))
      await settle()
      const menu = openMenus(wrapper)[0]
      await menu?.trigger('keydown', { key: 'z' })
      await settle()
      expect(document.activeElement).toBe(menu?.element)

      await wait(800)
      await menu?.trigger('keydown', { key: 'p' })
      await settle()
      expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Paste').element)
    })

    it('should highlight checkbox and radio items from the pointer, including a disabled one', async () => {
      const wrapper = mount(defineComponent({
        setup () {
          return () => h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
            default: () => [
              h(Menu.Activator, null, () => 'Format'),
              h(Menu.Content, null, () => [
                h(Menu.CheckboxItem, null, () => 'Bold'),
                h(Menu.CheckboxItem, null, () => 'Italic'),
                h(Menu.CheckboxItem, { disabled: true }, () => 'Strike'),
                h(Menu.RadioGroup, null, () => [
                  h(Menu.RadioItem, { value: 'left' }, () => 'Left'),
                  h(Menu.RadioItem, { value: 'right' }, () => 'Right'),
                  h(Menu.RadioItem, { value: 'center', disabled: true }, () => 'Center'),
                ]),
                h(Menu.Sub, null, () => [
                  h(Menu.SubActivator, null, () => 'Share'),
                  h(Menu.SubContent, null, () => [
                    h(Menu.Item, null, () => 'Email'),
                  ]),
                ]),
                h(Menu.Sub, null, () => [
                  h(Menu.SubActivator, { disabled: true }, () => 'Export'),
                  h(Menu.SubContent, null, () => [
                    h(Menu.Item, null, () => 'PDF'),
                  ]),
                ]),
                h(Menu.Item, { disabled: true }, () => 'Rename'),
              ]),
            ],
          })
        },
      }))

      await click(wrapper.get('button'))
      await settle()

      const bold = item(wrapper, 'menuitemcheckbox', 'Bold')
      const italic = item(wrapper, 'menuitemcheckbox', 'Italic')
      expect(bold.attributes('tabindex')).toBe('0')
      expect(italic.attributes('tabindex')).toBe('-1')

      await italic.trigger('pointerenter')
      await italic.trigger('focus')
      await settle()
      expect(italic.attributes('data-highlighted')).toBe('true')

      const strike = item(wrapper, 'menuitemcheckbox', 'Strike')
      await strike.trigger('pointerenter')
      await strike.trigger('pointerleave')
      await settle()
      expect(strike.attributes('data-highlighted')).toBeUndefined()

      const right = item(wrapper, 'menuitemradio', 'Right')
      await right.trigger('pointerenter')
      await right.trigger('focus')
      await right.trigger('pointerleave')
      await settle()
      expect(right.attributes('data-highlighted')).toBe('true')

      const center = item(wrapper, 'menuitemradio', 'Center')
      await center.trigger('pointerenter')
      await center.trigger('pointerleave')
      await settle()
      expect(center.attributes('data-highlighted')).toBeUndefined()

      await item(wrapper, 'menuitem', 'Rename').trigger('pointerenter')
      await settle()
      expect(item(wrapper, 'menuitem', 'Rename').attributes('data-highlighted')).toBeUndefined()

      const share = item(wrapper, 'menuitem', 'Share')
      await share.trigger('pointerenter')
      await italic.trigger('pointerleave')
      await settle()
      expect(openMenus(wrapper).some(node => node.text().includes('Email') && !node.text().includes('Bold'))).toBe(false)

      await share.trigger('pointerenter')
      await settle()
      const submenu = openMenus(wrapper).find(node => node.text().includes('Email') && !node.text().includes('Bold'))
      expect(submenu).toBeTruthy()
      await submenu?.trigger('pointerenter')
      await share.trigger('pointerenter')
      await settle()
      expect(submenu?.attributes('data-open')).toBe('true')

      await item(wrapper, 'menuitem', 'Export').trigger('pointerenter')
      await settle()
      expect(openMenus(wrapper).some(node => node.text().includes('PDF'))).toBe(false)
    })

    it('should run every click listener passed as an array', async () => {
      const itemClicks = [vi.fn(), vi.fn()]
      const boxClicks = [vi.fn(), vi.fn()]
      const radioClicks = [vi.fn(), vi.fn()]
      const subClicks = [vi.fn(), vi.fn()]
      const checked = shallowRef(false)
      const wrapper = mount(defineComponent({
        setup () {
          return () => h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
            default: () => [
              h(Menu.Activator, null, () => 'Actions'),
              h(Menu.Content, null, () => [
                h(Menu.Item, { onClick: itemClicks }, () => 'Copy'),
                h(Menu.CheckboxItem, {
                  'checked': checked.value,
                  'onUpdate:checked': (value: unknown) => {
                    if (isBoolean(value)) checked.value = value
                  },
                  'onClick': boxClicks,
                }, () => 'Bold'),
                h(Menu.RadioGroup, null, () => [
                  h(Menu.RadioItem, { value: 'left', onClick: radioClicks }, () => 'Left'),
                ]),
                h(Menu.Sub, null, () => [
                  h(Menu.SubActivator, { onClick: subClicks }, () => 'Share'),
                  h(Menu.SubContent, null, () => [
                    h(Menu.Item, null, () => 'Email'),
                  ]),
                ]),
              ]),
            ],
          })
        },
      }))

      await click(wrapper.get('button'))
      await settle()
      await item(wrapper, 'menuitemcheckbox', 'Bold').trigger('click')
      await item(wrapper, 'menuitemradio', 'Left').trigger('click')
      await item(wrapper, 'menuitem', 'Share').trigger('click')
      await settle()

      expect(boxClicks[0]).toHaveBeenCalledTimes(1)
      expect(boxClicks[1]).toHaveBeenCalledTimes(1)
      expect(radioClicks[0]).toHaveBeenCalledTimes(1)
      expect(radioClicks[1]).toHaveBeenCalledTimes(1)
      expect(subClicks[0]).toHaveBeenCalledTimes(1)
      expect(subClicks[1]).toHaveBeenCalledTimes(1)
      expect(checked.value).toBe(true)
      expect(openMenus(wrapper).length).toBeGreaterThan(0)

      await item(wrapper, 'menuitem', 'Copy').trigger('click')
      await settle()
      expect(itemClicks[0]).toHaveBeenCalledTimes(1)
      expect(itemClicks[1]).toHaveBeenCalledTimes(1)
      expect(openMenus(wrapper)).toHaveLength(0)
    })

    it('should dismiss when the top menu popover light-dismisses', async () => {
      const wrapper = mount(dropdown())

      await click(wrapper.get('button'))
      await settle()
      const menu = openMenus(wrapper)[0]
      expect(menu).toBeTruthy()
      await menu?.trigger('pointerenter')

      if (menu?.element instanceof HTMLElement) menu.element.hidePopover()
      await settle()
      expect(openMenus(wrapper)).toHaveLength(0)
    })

    it('should keep a hover-opened menu open when the pointer enters it', async () => {
      const wrapper = mount(defineComponent({
        setup () {
          return () => h(Menu.Root, { openOnHover: true, openDelay: 0, closeDelay: 300 }, {
            default: () => [
              h(Menu.Activator, null, () => 'Actions'),
              h(Menu.Content, null, () => [
                h(Menu.Item, null, () => 'Copy'),
              ]),
            ],
          })
        },
      }))

      const trigger = wrapper.get('button')
      await trigger.trigger('pointerenter')
      await settle()
      expect(openMenus(wrapper)).toHaveLength(1)

      await trigger.trigger('pointerleave')
      await openMenus(wrapper)[0]?.trigger('pointerenter')
      await wait(400)
      expect(openMenus(wrapper)).toHaveLength(1)

      await openMenus(wrapper)[0]?.trigger('pointerleave')
      await wait(400)
      expect(openMenus(wrapper)).toHaveLength(0)
    })

    it('should ignore a context menu event while the menu is disabled', async () => {
      const slot: { api?: MenuRootContext } = {}
      const Probe = captureMenu(slot)
      const wrapper = mount(defineComponent({
        setup () {
          return () => h('div', [
            h(Menu.Root, { disabled: true, openDelay: 0, closeDelay: 0 }, {
              default: () => [
                h(Menu.Context, null, () => 'Surface'),
                h(Menu.Content, null, () => [
                  h(Menu.Item, null, () => 'Copy'),
                ]),
              ],
            }),
            h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
              default: () => [
                h(Probe),
                h(Menu.Context, { renderless: true }, () => 'Hidden'),
                h(Menu.Content, { renderless: true }, () => [
                  h(Menu.Item, null, () => 'Copy'),
                ]),
              ],
            }),
          ])
        },
      }))

      const surface = wrapper.findAll('div').find(node => node.text() === 'Surface')
      expect(surface).toBeTruthy()
      await surface?.trigger('contextmenu', { clientX: 8, clientY: 8 })
      await settle()
      expect(openMenus(wrapper)).toHaveLength(0)

      const api = slot.api
      expect(api).toBeTruthy()
      api?.reveal(api.defaultLayer, 'context')
      await settle()
      expect(api?.path.value).toHaveLength(1)
      api?.dismiss()
      await settle()
      expect(api?.path.value).toHaveLength(0)
    })

    it('should focus the nested activator when a deeper submenu closes', async () => {
      const wrapper = mount(dropdown(() => [
        h(Menu.Sub, null, () => [
          h(Menu.SubActivator, null, () => 'Share'),
          h(Menu.SubContent, null, () => [
            h(Menu.Item, null, () => 'Email'),
            h(Menu.Sub, null, () => [
              h(Menu.SubActivator, null, () => 'More'),
              h(Menu.SubContent, null, () => [
                h(Menu.Item, null, () => 'PDF'),
              ]),
            ]),
          ]),
        ]),
      ]))

      await click(wrapper.get('button'))
      await settle()
      const menu = openMenus(wrapper)[0]
      await menu?.trigger('keydown', { key: 'ArrowDown' })
      await menu?.trigger('keydown', { key: 'ArrowDown' })
      await menu?.trigger('keydown', { key: 'ArrowDown' })
      await menu?.trigger('keydown', { key: 'ArrowRight' })
      await settle()

      const share = openMenus(wrapper).find(node => node.text().includes('Email') && !node.text().includes('Copy'))
      expect(share).toBeTruthy()
      await share?.trigger('keydown', { key: 'ArrowDown' })
      await share?.trigger('keydown', { key: 'ArrowRight' })
      await settle()

      const nested = openMenus(wrapper).find(node => node.text().includes('PDF') && !node.text().includes('Email'))
      expect(nested).toBeTruthy()
      await nested?.trigger('keydown', { key: 'ArrowLeft' })
      await settle()

      expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'More').element)
      expect(openMenus(wrapper).some(node => node.text() === 'PDF')).toBe(false)
    })

    it('should ignore a light dismiss on a submenu that is not the open leaf', async () => {
      const root: { api?: MenuRootContext } = {}
      const nested: { id?: ID } = {}
      const Probe = captureMenu(root)
      const Sub = captureSub(nested)
      const wrapper = mount(dropdown(() => [
        h(Probe),
        h(Menu.Sub, null, () => [
          h(Menu.SubActivator, null, () => 'Share'),
          h(Menu.SubContent, null, () => [
            h(Menu.Item, null, () => 'Email'),
            h(Menu.Sub, null, () => [
              h(Sub),
              h(Menu.SubActivator, null, () => 'More'),
              h(Menu.SubContent, { renderless: true }, () => [
                h(Menu.Item, null, () => 'PDF'),
              ]),
            ]),
          ]),
        ]),
      ]))

      await click(wrapper.get('button'))
      await settle()
      const menu = openMenus(wrapper)[0]
      await menu?.trigger('keydown', { key: 'ArrowDown' })
      await menu?.trigger('keydown', { key: 'ArrowDown' })
      await menu?.trigger('keydown', { key: 'ArrowDown' })
      await menu?.trigger('keydown', { key: 'ArrowRight' })
      await settle()

      const share = openMenus(wrapper).find(node => node.text().includes('Email') && !node.text().includes('Copy'))
      await share?.trigger('keydown', { key: 'ArrowDown' })
      await share?.trigger('keydown', { key: 'ArrowRight' })
      await settle()
      expect(root.api?.path.value.at(-1)).toBe(nested.id)

      ;(share?.element as HTMLElement & { hidePopover?: () => void }).hidePopover?.()
      await settle()
      expect(root.api?.path.value.at(-1)).toBe(nested.id)
    })

    it('should open a submenu on its last item', async () => {
      const root: { api?: MenuRootContext } = {}
      const sub: { id?: ID } = {}
      const Probe = captureMenu(root)
      const Sub = captureSub(sub)
      const wrapper = mount(defineComponent({
        setup () {
          return () => h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
            default: () => [
              h(Probe),
              h(Menu.Activator, null, () => 'Actions'),
              h(Menu.Content, { eager: true }, () => [
                h(Menu.Sub, null, () => [
                  h(Sub),
                  h(Menu.SubActivator, null, () => 'Share'),
                  h(Menu.SubContent, null, () => [
                    h(Menu.Item, null, () => 'Email'),
                    h(Menu.Item, null, () => 'Link'),
                  ]),
                ]),
              ]),
            ],
          })
        },
      }))

      await settle()
      expect(root.api).toBeTruthy()
      expect(sub.id).toBeTruthy()
      root.api?.reveal(sub.id!, 'keyboard', 'last')
      await settle()
      expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Link').element)
    })

    it('should keep the parent open when an open submenu unmounts', async () => {
      const shown = shallowRef(true)
      const wrapper = mount(defineComponent({
        setup () {
          return () => h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
            default: () => [
              h(Menu.Activator, null, () => 'Actions'),
              h(Menu.Content, null, () => [
                h(Menu.Item, null, () => 'Copy'),
                shown.value
                  ? h(Menu.Sub, null, () => [
                      h(Menu.SubActivator, null, () => 'Share'),
                      h(Menu.SubContent, null, () => [
                        h(Menu.Item, null, () => 'Email'),
                      ]),
                    ])
                  : null,
              ]),
            ],
          })
        },
      }))

      await click(wrapper.get('button'))
      await settle()
      await item(wrapper, 'menuitem', 'Share').trigger('click')
      await settle()
      expect(openMenus(wrapper).some(node => node.text().includes('Email'))).toBe(true)

      shown.value = false
      await settle()
      expect(openMenus(wrapper)).toHaveLength(1)
      expect(openMenus(wrapper)[0]?.text()).toContain('Copy')
      expect(openMenus(wrapper)[0]?.text()).not.toContain('Email')
    })

    it('should leave a single menu in place when shift or pop has nowhere to go', async () => {
      const slot: { api?: MenuRootContext } = {}
      const Probe = captureMenu(slot)
      const off = shallowRef(false)
      const ran = vi.fn()
      const wrapper = mount(defineComponent({
        setup () {
          return () => h('div', [
            h(Menu.Root, { disabled: off.value, openDelay: 0, closeDelay: 0 }, {
              default: () => [
                h(Probe),
                h(Menu.Activator, null, () => 'Actions'),
                h(Menu.Content, null, () => [
                  h(Menu.Item, { disabled: true }, () => 'Copy'),
                  h(Menu.Item, null, () => 'Paste'),
                  h(Menu.Sub, null, () => [
                    h(Menu.SubActivator, null, () => 'Share'),
                    h(Menu.SubContent, null, () => [
                      h(Menu.Item, null, () => 'Email'),
                    ]),
                  ]),
                  h(Menu.Sub, null, () => [
                    h(Menu.SubActivator, null, () => 'Send'),
                    h(Menu.SubContent, { renderless: true }, () => [
                      h(Menu.Item, null, () => 'Link'),
                    ]),
                  ]),
                ]),
              ],
            }),
            h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
              default: () => [
                h(Menu.Activator, null, () => 'Graphic'),
                h(Menu.Content, { as: 'svg' }, () => []),
              ],
            }),
          ])
        },
      }))

      const api = slot.api
      expect(api).toBeTruthy()
      expect(api?.canShift()).toBe(false)
      expect(api?.parentOf(api.defaultLayer)).toBeNull()
      expect(api?.claimFocus('missing')).toBeUndefined()
      api?.shift(1)
      api?.pop()
      api?.dismiss()
      await settle()
      expect(api?.path.value).toHaveLength(0)

      api?.unbindAnchor(api.defaultLayer, () => null)
      const actions = wrapper.findAll('button').find(node => node.text() === 'Actions')
      expect(actions).toBeTruthy()
      await actions?.trigger('click')
      await settle()
      expect(api?.path.value).toHaveLength(1)

      const menu = openMenus(wrapper)[0]
      await menu?.trigger('keydown', { key: 'ArrowRight' })
      await menu?.trigger('keydown', { key: 'ArrowLeft' })
      await settle()
      expect(api?.path.value).toHaveLength(1)

      await wrapper.get('svg').trigger('keydown', { key: 'ArrowDown' })
      await settle()

      const copy = item(wrapper, 'menuitem', 'Copy')
      ;(copy.element as HTMLElement).focus()
      await copy.trigger('keydown', { key: 'Enter' })
      await settle()
      expect(api?.path.value).toHaveLength(1)

      menu?.element.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        bubbles: true,
        cancelable: true,
        isComposing: true,
      }))
      await settle()
      expect(document.activeElement).toBe(copy.element)

      await item(wrapper, 'menuitem', 'Share').trigger('click')
      await settle()
      const email = openMenus(wrapper).find(node => node.text().includes('Email') && !node.text().includes('Copy'))
      await email?.trigger('keydown', { key: 'ArrowRight' })
      await settle()
      expect(api?.path.value).toHaveLength(2)

      await item(wrapper, 'menuitem', 'Send').trigger('click')
      await settle()
      expect(api?.path.value.at(-1)).not.toBe(api?.defaultLayer)

      const ticket = api?.register({
        layerId: api.defaultLayer,
        kind: 'item',
        label: () => 'Custom',
        disabled: () => false,
        onActivate: ran,
      })
      off.value = true
      await nextTick()
      const leaf = api?.path.value.at(-1)
      api?.activate(ticket!)
      expect(ran).toHaveBeenCalledTimes(0)
      expect(api?.path.value.at(-1)).toBe(leaf)

      api?.registerLayer('ghost', api.defaultLayer)
      api?.reveal('ghost', 'click')
      await settle()
      expect(api?.path.value).toEqual([api?.defaultLayer, 'ghost'])
      api?.pop()
      await settle()
      expect(api?.path.value).toEqual([api?.defaultLayer])
    })

    it('should shift across a menubar and report each parent layer', async () => {
      const slot: { api?: MenuRootContext } = {}
      const sub: { id?: ID } = {}
      const Probe = captureMenu(slot)
      const Sub = captureSub(sub)
      const wrapper = mount(defineComponent({
        setup () {
          return () => h(Menu.Root, { openDelay: 0, closeDelay: 0 }, {
            default: () => [
              h(Probe),
              h(Menu.Bar, null, () => [
                h(Menu.Activator, { value: 'file' }, () => 'File'),
                h(Menu.Activator, { value: 'edit' }, () => 'Edit'),
                h(Menu.Activator, { value: 'twin' }, () => 'Twin'),
                h(Menu.Activator, { value: 'twin' }, () => 'Twin again'),
              ]),
              h(Menu.Content, { value: 'file', eager: true }, () => [
                h(Menu.Item, null, () => 'New'),
                h(Menu.Sub, null, () => [
                  h(Sub),
                  h(Menu.SubActivator, null, () => 'Share'),
                  h(Menu.SubContent, null, () => [
                    h(Menu.Item, null, () => 'Email'),
                  ]),
                ]),
              ]),
              h(Menu.Content, { value: 'edit' }, () => [
                h(Menu.Item, null, () => 'Undo'),
              ]),
              h(Menu.Content, { value: 'twin' }, () => [
                h(Menu.Item, null, () => 'Once'),
              ]),
            ],
          })
        },
      }))

      const api = slot.api
      expect(api).toBeTruthy()
      expect(api?.canShift()).toBe(true)
      expect(sub.id).toBeTruthy()
      expect(api?.parentOf('file')).toBeNull()
      expect(api?.parentOf(sub.id!)).toBe('file')

      api?.shift(1)
      await settle()
      expect(openMenus(wrapper)[0]?.text()).toContain('Undo')

      api?.shift(1)
      await settle()
      expect(openMenus(wrapper)[0]?.text()).toContain('Once')

      api?.reveal('twin', 'click')
      await settle()
      api?.shift(1)
      await settle()
      expect(api?.path.value[0]).toBe('twin')
    })
  })
})
