import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

import { Menu } from './index'

// Utilities
import { isBoolean, isString } from '#v0/utilities'
import { mount as baseMount } from '@vue/test-utils'
import { defineComponent, h, nextTick, shallowRef } from 'vue'

// Types
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

    await wrapper.get('button').trigger('click')
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

    await trigger.trigger('click')
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

    await wrapper.get('button').trigger('click')
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

    await wrapper.get('button').trigger('click')
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

    await wrapper.get('button').trigger('click')
    await settle()
    await openMenus(wrapper)[0]?.trigger('keydown', { key: 'p' })
    await settle()

    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Paste').element)
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

    await wrapper.get('button').trigger('click')
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

    await wrapper.get('button').trigger('click')
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

    await wrapper.get('button').trigger('click')
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

    await item(wrapper, 'menuitem', 'File').trigger('click')
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

    await wrapper.get('button').trigger('click')
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

    await trigger.trigger('click')
    await settle()
    expect(openMenus(wrapper)).toHaveLength(1)

    await trigger.trigger('click')
    await settle()
    expect(openMenus(wrapper)).toHaveLength(0)
  })

  it('should close when an action item is clicked', async () => {
    const wrapper = mount(dropdown())

    await wrapper.get('button').trigger('click')
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

    await wrapper.get('button').trigger('click')
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

    await wrapper.get('button').trigger('click')
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

    await wrapper.get('button').trigger('click')
    await settle()
    await item(wrapper, 'menuitem', 'Paste').trigger('pointerenter')
    await settle()

    expect(item(wrapper, 'menuitem', 'Paste').attributes('data-highlighted')).toBe('true')
    expect(item(wrapper, 'menuitem', 'Copy').attributes('data-highlighted')).toBeUndefined()
    expect(document.activeElement).toBe(item(wrapper, 'menuitem', 'Paste').element)
  })

  it('should prevent space and enter when no item is highlighted', async () => {
    const wrapper = mount(dropdown())

    await wrapper.get('button').trigger('click')
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

    await wrapper.get('button').trigger('click')
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

    await trigger.trigger('click')
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
    await trigger.trigger('click')
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

    await wrapper.get('button').trigger('click')
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

    await trigger.trigger('click')
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

    await trigger.trigger('click')
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

    await item(wrapper, 'menuitem', 'Edit').trigger('click')
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

    await wrapper.get('button').trigger('click')
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

    await wrapper.get('button').trigger('click')
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

    await wrapper.get('button').trigger('click')
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
})
