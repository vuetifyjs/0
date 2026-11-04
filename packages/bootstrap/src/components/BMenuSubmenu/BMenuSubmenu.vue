<script lang="ts">
  // Framework
  import {
    IN_BROWSER,
    isNullOrUndefined,
    isString,
    useDelay,
    useEventListener,
    useId,
    useLocale,
    usePopover,
    useRovingFocus,
  } from '@vuetify/v0'

  // Utilities
  import { orphan } from '../../utilities/context'
  import { onBeforeUnmount, onMounted, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { BMenuRegistration } from '../BMenu/BMenu.vue'

  import { provideBMenu, useBMenu } from '../BMenu/BMenu.vue'

  export interface BMenuSubmenuProps {
    /** Trigger text. The chevron comes from `.submenu > .menu-item::after`. */
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BMenuSubmenu' })

  defineSlots<{
    /** Items inside the nested menu. */
    default?: () => any
  }>()

  const { label = '' } = defineProps<BMenuSubmenuProps>()

  const locale = useLocale()
  const named = toRef(() => isString(label) && label.length > 0)
  const fallback = toRef(() => locale.ti('Menu.submenu') ?? 'Submenu')

  const parent = useBMenu()
  const rootEl = useTemplateRef<HTMLElement>('root')
  const triggerEl = useTemplateRef<HTMLButtonElement>('trigger')
  const menuEl = useTemplateRef<HTMLElement>('menu')
  const shown = shallowRef(false)
  const items = shallowRef<BMenuRegistration[]>([])
  const id = useId()

  orphan('BMenuSubmenu', 'BMenu', parent)

  const popover = usePopover({
    isOpen: shown,
    positionArea: 'inline-end span-block-end',
  })

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

  const delay = useDelay(opening => {
    shown.value = opening
  }, { openDelay: 0, closeDelay: 100 })

  function register (item: BMenuRegistration) {
    items.value = [...items.value.filter(entry => entry.id !== item.id), item]
  }

  function unregister (itemId: string) {
    items.value = items.value.filter(entry => entry.id !== itemId)
  }

  function shut () {
    delay.stop()
    shown.value = false
  }

  function open () {
    delay.stop()
    shown.value = true
    roving.first()
  }

  // mouseenter opens before click. A click that entered a closed submenu
  // keeps it open; a later click toggles.
  let fresh = false

  function onEnter () {
    fresh = !shown.value
    delay.start(true)
  }

  function onLeave () {
    fresh = false
    delay.start(false)
  }

  function onToggle () {
    delay.stop()
    if (fresh) {
      fresh = false
      shown.value = true
      return
    }
    shown.value = !shown.value
  }

  provideBMenu({
    open: shown,
    register,
    unregister,
    close: shut,
    activate: () => parent?.activate(),
  })

  if (!isNullOrUndefined(parent)) {
    watch(parent.open, value => {
      if (!value) shut()
    })
  }

  function side () {
    const element = rootEl.value
    if (isNullOrUndefined(element) || !IN_BROWSER) return 'right'
    return getComputedStyle(element).direction === 'rtl' ? 'left' : 'right'
  }

  function onKey (event: KeyboardEvent) {
    const back = side() === 'left' ? 'ArrowRight' : 'ArrowLeft'
    const forward = side() === 'left' ? 'ArrowLeft' : 'ArrowRight'
    if (
      event.key === 'ArrowDown'
      || event.key === 'ArrowUp'
      || event.key === 'Home'
      || event.key === 'End'
      || event.key === back
      || event.key === forward
    ) {
      event.stopPropagation()
    }
    if (event.key === forward) {
      const current = items.value.find(item => item.id === roving.focusedId.value)
      if (isNullOrUndefined(current?.open)) return
      event.preventDefault()
      current.open()
      return
    }
    if (event.key !== back) return
    event.preventDefault()
    shut()
    triggerEl.value?.focus()
  }

  const anchorStyle = toRef(() => popover.anchorStyles.value)
  // `.submenu > .menu { top: 0 }` would pin the nested menu to the viewport.
  const menuStyle = toRef(() => ({
    ...popover.contentStyles.value,
    inset: 'auto',
  }))

  useEventListener(menuEl, 'keydown', onKey)
  useEventListener(rootEl, 'mouseenter', onEnter)
  useEventListener(rootEl, 'mouseleave', onLeave)

  onMounted(() => {
    const element = triggerEl.value
    if (isNullOrUndefined(element) || isNullOrUndefined(parent)) return
    parent.register({
      id,
      el: element,
      disabled: () => false,
      open,
      close: shut,
    })
  })

  onBeforeUnmount(() => {
    parent?.unregister(id)
  })
</script>

<template>
  <div
    ref="root"
    class="submenu"
    :class="{ show: shown }"
  >
    <button
      ref="trigger"
      :aria-controls="popover.id"
      :aria-expanded="shown"
      aria-haspopup="true"
      :aria-label="named ? undefined : fallback"
      class="menu-item"
      :style="anchorStyle"
      tabindex="-1"
      type="button"
      @click="onToggle"
    >
      {{ label }}
    </button>

    <div
      :id="popover.id"
      ref="menu"
      class="menu"
      :class="{ show: shown }"
      :data-bs-placement="`${side()}-start`"
      :style="menuStyle"
    >
      <slot />
    </div>
  </div>
</template>
