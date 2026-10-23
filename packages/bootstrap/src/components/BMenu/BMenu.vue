<script lang="ts">
  // Framework
  import {
    IN_BROWSER,
    createContext,
    isNullOrUndefined,
    useClickOutside,
    useEventListener,
    usePopover,
    useRovingFocus,
  } from '@vuetify/v0'

  // Utilities
  import { mergeProps, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { Ref } from 'vue'

  // `span-*` shares an edge with the anchor. A bare second keyword is the
  // diagonal tile, which is not a menu placement. Top and bottom use logical
  // values so `start` follows the writing direction. Left and right stay
  // physical.
  export const MENU_PLACEMENTS = {
    'bottom-start': 'block-end span-inline-end',
    'bottom': 'block-end',
    'bottom-end': 'block-end span-inline-start',
    'top-start': 'block-start span-inline-end',
    'top': 'block-start',
    'top-end': 'block-start span-inline-start',
    'left-start': 'left span-bottom',
    'left': 'left',
    'left-end': 'left span-top',
    'right-start': 'right span-bottom',
    'right': 'right',
    'right-end': 'right span-top',
  } as const

  export type BMenuPlacement = keyof typeof MENU_PLACEMENTS

  export type BMenuAutoClose = boolean | 'inside' | 'outside'

  export interface BMenuProps {
    /** Button text. The trigger is `button.btn-solid.theme-primary`. */
    label?: string
    /**
     * Where the menu sits, and the `data-bs-placement` styling hook.
     * Bootstrap's stylesheet keys `transform-origin` off that attribute.
     * Default matches Bootstrap's own engine: `bottom-start`.
     */
    placement?: BMenuPlacement
    /**
     * `true` closes on a click inside or outside. `'inside'` and `'outside'`
     * close on only that side. `false` leaves Escape and the trigger as the
     * ways out. Escape always closes.
     */
    autoClose?: BMenuAutoClose
  }

  export interface BMenuRegistration {
    id: string
    el: HTMLElement
    disabled: () => boolean
    open?: () => void
    close?: () => void
  }

  export interface BMenuContext {
    open: Ref<boolean>
    register: (item: BMenuRegistration) => void
    unregister: (id: string) => void
    close: (restore?: boolean) => void
    activate: () => void
  }

  const [useBMenu, provideBMenu] = createContext<BMenuContext | null>('bootstrap:menu', null)

  export { provideBMenu, useBMenu }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BMenu', inheritAttrs: false })

  defineSlots<{
    /** Items, headers, dividers, and submenus. */
    default?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    label = 'Toggle menu',
    placement = 'bottom-start',
    autoClose = true,
  } = defineProps<BMenuProps>()

  const model = defineModel<boolean>({ default: false })
  const attrs = useAttrs()
  const triggerEl = useTemplateRef<HTMLButtonElement>('trigger')
  const menuEl = useTemplateRef<HTMLElement>('menu')
  const items = shallowRef<BMenuRegistration[]>([])

  const popover = usePopover({
    isOpen: model,
    positionArea: () => MENU_PLACEMENTS[placement],
  })

  // attach() calls showPopover() on open. That throws without a popover
  // attribute, and the attribute would put the menu in the top layer, which
  // fights `.menu { position: absolute }`. The no-op keeps the adapter's
  // content element (Floating UI reads it) without the promotion.
  watch(menuEl, element => {
    if (isNullOrUndefined(element)) return
    element.showPopover = () => {}
  }, { flush: 'sync' })

  popover.attachAnchor(triggerEl)
  popover.attach(menuEl)

  const roving = useRovingFocus(() => items.value, {
    orientation: 'vertical',
    circular: true,
    target: menuEl,
  })

  const outside = useClickOutside([triggerEl, menuEl], () => {
    model.value = false
  })

  watch(() => {
    if (!model.value) return false
    return autoClose === true || autoClose === 'outside'
  }, listening => {
    if (listening) outside.resume()
    else outside.pause()
  }, { immediate: true })

  function register (item: BMenuRegistration) {
    items.value = [...items.value.filter(entry => entry.id !== item.id), item]
  }

  function unregister (id: string) {
    items.value = items.value.filter(entry => entry.id !== id)
  }

  function close (restore = false) {
    model.value = false
    if (restore) triggerEl.value?.focus()
  }

  function activate () {
    if (autoClose === true || autoClose === 'inside') model.value = false
  }

  provideBMenu({
    open: model,
    register,
    unregister,
    close,
    activate,
  })

  function onToggle () {
    model.value = !model.value
  }

  function onTriggerKey (event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      model.value = true
      roving.first()
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      model.value = true
      roving.last()
      return
    }
    if (event.key === 'Escape' && model.value) {
      event.preventDefault()
      close(true)
    }
  }

  function direction () {
    const element = menuEl.value
    if (isNullOrUndefined(element) || !IN_BROWSER) return false
    return getComputedStyle(element).direction === 'rtl'
  }

  function onMenuKey (event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault()
      close(true)
      return
    }
    if (event.key === 'Tab') {
      model.value = false
      return
    }

    const rtl = direction()
    const openKey = rtl ? 'ArrowLeft' : 'ArrowRight'
    const closeKey = rtl ? 'ArrowRight' : 'ArrowLeft'
    if (event.key !== openKey && event.key !== closeKey) return

    const current = items.value.find(item => item.id === roving.focusedId.value)
    if (event.key === openKey && !isNullOrUndefined(current?.open)) {
      event.preventDefault()
      current.open()
      return
    }
    if (event.key === closeKey) {
      for (const item of items.value) item.close?.()
    }
  }

  useEventListener(menuEl, 'keydown', onMenuKey)

  const anchorStyle = toRef(() => popover.anchorStyles.value)
  const menuStyle = toRef(() => popover.contentStyles.value)

  const triggerAttrs = toRef(() => ({
    'type': 'button' as const,
    'aria-expanded': model.value,
    'aria-haspopup': 'menu' as const,
    'aria-controls': popover.id,
    'style': anchorStyle.value,
    'onClick': onToggle,
    'onKeydown': onTriggerKey,
  }))

  const menuClass = toRef(() => ({
    menu: true,
    show: model.value,
  }))
</script>

<template>
  <button
    ref="trigger"
    class="btn-solid theme-primary"
    v-bind="mergeProps(attrs, triggerAttrs)"
  >
    {{ label }}
  </button>

  <div
    :id="popover.id"
    ref="menu"
    :class="menuClass"
    :data-bs-placement="placement"
    :style="menuStyle"
  >
    <slot />
  </div>
</template>
