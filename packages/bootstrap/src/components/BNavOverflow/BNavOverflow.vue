<script lang="ts">
  // Framework
  import {
    IN_BROWSER,
    createContext,
    createOverflow,
    isArray,
    isNullOrUndefined,
    isObject,
    isString,
    isUndefined,
    pxToNumber,
    useClickOutside,
    useId,
    useLocale,
    usePopover,
  } from '@vuetify/v0'

  // Utilities
  import { nextTick, onMounted, ref, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { Ref } from 'vue'

  export interface BNavOverflowProps {
    /**
     * Pixel gap between measured items. Omit it and the gap is the nav's
     * `column-gap`.
     */
    gap?: number
    /** Label on the menu of items that do not fit. */
    more?: string
  }

  export interface BNavOverflowTicket {
    el: HTMLElement | null
    id: string
    keep: boolean
  }

  export interface BNavOverflowContext {
    bucketId: string
    capacity: Readonly<Ref<number>>
    indexOf: (id: string) => number
    measure: (index: number, el: Element | undefined) => void
    menuReady: Readonly<Ref<boolean>>
    register: (ticket: BNavOverflowTicket) => void
    unregister: (id: string) => void
    update: (id: string, patch: Partial<Pick<BNavOverflowTicket, 'el' | 'keep'>>) => void
  }

  const [useBNavOverflow, provideBNavOverflow] = createContext<BNavOverflowContext>('bootstrap:nav-overflow')

  export { useBNavOverflow }

  function hasKeep (value: unknown): boolean {
    if (isString(value)) return value.split(/\s+/).includes('nav-overflow-keep')
    if (isArray(value)) return value.includes('nav-overflow-keep')
    if (isObject(value)) return value['nav-overflow-keep'] === true
    return false
  }

  export { hasKeep }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BNavOverflow' })

  defineSlots<{
    /** A `.nav` whose items are `BNavOverflow.Item`. */
    default?: () => any
  }>()

  const { gap: gapProp, more } = defineProps<BNavOverflowProps>()

  const locale = useLocale()
  const label = toRef(() => more ?? locale.ti('NavOverflow.more') ?? 'More')

  const rootEl = useTemplateRef<HTMLElement>('root')
  const moreEl = useTemplateRef<HTMLButtonElement>('more')
  const menuEl = useTemplateRef<HTMLElement>('menu')
  const tickets = ref<BNavOverflowTicket[]>([])
  const list = shallowRef<Element | null>(null)
  const measuredGap = shallowRef(0)
  const keepWidth = shallowRef(0)
  const moreWidth = shallowRef(0)
  const reserveMore = shallowRef(false)
  const menuOpen = shallowRef(false)
  const menuReady = shallowRef(false)
  // The pin keeps `.nav` at visibility:hidden until this class exists.
  const initialized = shallowRef(false)
  const bucketId = `bs-overflow-${useId()}`.replaceAll(':', '')

  const overflow = createOverflow({
    container: () => rootEl.value,
    gap: () => isUndefined(gapProp) ? measuredGap.value : gapProp,
    reserved: () => keepWidth.value + (reserveMore.value ? moreWidth.value : 0),
  })

  const popover = usePopover({
    isOpen: menuOpen,
    positionArea: 'block-end span-inline-end',
  })

  // showPopover() throws until the popover attribute exists, and that
  // attribute promotes the menu to the top layer, which fights `.menu`.
  watch(menuEl, element => {
    if (isNullOrUndefined(element)) return
    element.showPopover = () => {}
  }, { flush: 'sync' })

  popover.attachAnchor(moreEl)
  popover.attach(menuEl)

  const outside = useClickOutside([moreEl, menuEl], () => {
    menuOpen.value = false
  })

  watch(menuOpen, open => {
    if (open) outside.resume()
    else outside.pause()
  }, { immediate: true })

  const anchorStyle = toRef(() => popover.anchorStyles.value)
  const menuStyle = toRef(() => popover.contentStyles.value)

  function indexOf (id: string) {
    let index = 0
    for (const ticket of tickets.value) {
      if (ticket.keep) continue
      if (ticket.id === id) return index
      index++
    }
    return -1
  }

  function register (ticket: BNavOverflowTicket) {
    tickets.value = [...tickets.value.filter(item => item.id !== ticket.id), ticket]
  }

  function unregister (id: string) {
    tickets.value = tickets.value.filter(item => item.id !== id)
  }

  function update (id: string, patch: Partial<Pick<BNavOverflowTicket, 'el' | 'keep'>>) {
    tickets.value = tickets.value.map(item => item.id === id ? { ...item, ...patch } : item)
  }

  function syncList () {
    list.value = rootEl.value?.querySelector('.nav') ?? null
  }

  function syncGap () {
    if (!IN_BROWSER || !isUndefined(gapProp)) return
    const nav = rootEl.value?.querySelector('.nav')
    if (isNullOrUndefined(nav)) return
    const raw = getComputedStyle(nav).columnGap
    measuredGap.value = raw === 'normal' ? 0 : pxToNumber(raw)
  }

  function syncKeep () {
    if (!IN_BROWSER) return
    let sum = 0
    for (const ticket of tickets.value) {
      if (!ticket.keep || isNullOrUndefined(ticket.el)) continue
      const style = getComputedStyle(ticket.el)
      sum += ticket.el.offsetWidth + pxToNumber(style.marginLeft) + pxToNumber(style.marginRight)
    }
    keepWidth.value = sum
  }

  function syncMore () {
    const element = moreEl.value
    if (isNullOrUndefined(element) || element.offsetWidth <= 0) return
    moreWidth.value = element.offsetWidth
  }

  function sync () {
    syncList()
    syncGap()
    syncKeep()
    syncMore()
  }

  watch(() => overflow.width.value, sync)
  watch(tickets, syncKeep, { deep: true })
  watch(moreEl, syncMore)

  watch(() => overflow.isOverflowing.value, value => {
    reserveMore.value = value
    menuReady.value = false
    if (!value) {
      menuOpen.value = false
      return
    }
    // The menu is created this flush. Teleport finds it on the next one.
    nextTick(() => {
      if (overflow.isOverflowing.value) menuReady.value = true
    })
  })

  onMounted(() => {
    sync()
    initialized.value = true
  })

  function onToggle () {
    menuOpen.value = !menuOpen.value
  }

  const classes = toRef(() => {
    const list = ['nav-overflow']
    if (initialized.value) list.push('nav-overflow-initialized')
    return list
  })

  const menuClasses = toRef(() => {
    const list = ['menu']
    if (menuOpen.value) list.push('show')
    return list
  })

  function onKeydown (event: KeyboardEvent) {
    if (event.key !== 'Escape' || !menuOpen.value) return
    event.preventDefault()
    menuOpen.value = false
  }

  provideBNavOverflow({
    bucketId,
    capacity: overflow.capacity,
    indexOf,
    measure: overflow.measure,
    menuReady,
    register,
    unregister,
    update,
  })
</script>

<template>
  <div
    ref="root"
    :class="classes"
  >
    <slot />

    <Teleport
      v-if="overflow.isOverflowing.value && list"
      :to="list"
    >
      <li class="nav-item">
        <button
          ref="more"
          :aria-controls="popover.id"
          :aria-expanded="menuOpen"
          aria-haspopup="menu"
          class="nav-link"
          :style="anchorStyle"
          type="button"
          @click="onToggle"
          @keydown="onKeydown"
        >
          <span class="nav-overflow-text">{{ label }}</span>
        </button>

        <div
          :id="bucketId"
          ref="menu"
          :class="menuClasses"
          data-bs-placement="bottom-start"
          :style="menuStyle"
          @keydown="onKeydown"
        />
      </li>
    </Teleport>
  </div>
</template>
