<script setup lang="ts">
  // Framework
  import { useEventListener, usePopover, useTimer } from '@vuetify/v0'
  import { IN_BROWSER } from '@vuetify/v0/constants'

  // Composables
  import { useClipboard } from '@/composables/useClipboard'

  // Transformers
  import { clearTextMarks, paintTextFragment, readTextFragment, toFragmentUrl, toTextDirective, toTextQuote } from '@/composables/toTextFragment'

  // Utilities
  import { onMounted, shallowRef, useTemplateRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  const PROSE = '[data-docs-prose]'
  const PAD = 8

  const route = useRoute()
  const clipboard = useClipboard()
  const isOpen = shallowRef(false)
  const link = shallowRef('')
  const anchor = useTemplateRef<HTMLElement>('anchor')
  const panel = useTemplateRef<HTMLElement>('panel')
  const anchorBox = shallowRef({
    position: 'fixed',
    left: '0px',
    top: '0px',
    width: '0px',
    height: '0px',
  })

  const popover = usePopover({
    isOpen,
    positionArea: () => 'top',
    positionTry: () => 'bottom, top span-right, bottom span-right',
  })

  popover.attachAnchor(anchor)
  popover.attach(panel)

  const dismiss = useTimer(() => {
    isOpen.value = false
  }, { duration: 280 })

  let generation = 0
  let shown = ''

  function prose (): HTMLElement | undefined {
    const root = document.querySelector(PROSE)
    return root instanceof HTMLElement ? root : undefined
  }

  function selection (): Range | undefined {
    const selected = document.getSelection()
    if (!selected || selected.rangeCount === 0 || selected.isCollapsed) return undefined
    return selected.getRangeAt(0)
  }

  function hits (range: Range, x: number, y: number): boolean {
    for (const rect of range.getClientRects()) {
      if (x >= rect.left - PAD && x <= rect.right + PAD && y >= rect.top - PAD && y <= rect.bottom + PAD) {
        return true
      }
    }
    return false
  }

  function overPanel (event: Event): boolean {
    const root = panel.value
    return !!root && event.composedPath().includes(root)
  }

  function place (range: Range) {
    const rect = range.getClientRects()[0] ?? range.getBoundingClientRect()
    anchorBox.value = {
      position: 'fixed',
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.top}px`,
      width: '0px',
      height: '0px',
    }
  }

  function show (range: Range) {
    const root = prose()
    if (!root) return

    const parent = range.startContainer.parentElement
    const key = `${parent?.textContent ?? ''}:${range.startOffset}:${range.endOffset}:${range.toString()}`
    if (isOpen.value && shown === key) {
      dismiss.stop()
      return
    }

    const quote = toTextQuote(root, range)
    if (!quote) {
      if (isOpen.value) dismiss.start()
      return
    }

    place(range)
    shown = key
    link.value = toFragmentUrl(window.location.href, toTextDirective(quote.text, quote.quote, quote.at))
    dismiss.stop()
    isOpen.value = true
  }

  function onMove (event: PointerEvent) {
    if (event.buttons !== 0) return
    if (overPanel(event)) {
      dismiss.stop()
      return
    }

    const range = selection()
    if (range && hits(range, event.clientX, event.clientY)) {
      show(range)
      return
    }

    if (isOpen.value) dismiss.start()
  }

  function onUp (event: PointerEvent) {
    if (overPanel(event)) return

    const range = selection()
    if (!range) {
      if (isOpen.value) dismiss.start()
      return
    }

    if (hits(range, event.clientX, event.clientY)) {
      show(range)
      return
    }

    const target = event.target
    const block = range.startContainer.parentElement?.closest('p, li, h1, h2, h3, h4, h5, h6, td, th, dd, blockquote, figcaption')
    if (target instanceof Node && block?.contains(target)) {
      show(range)
      return
    }

    if (isOpen.value) dismiss.start()
  }

  function onKey (event: KeyboardEvent) {
    if (event.key === 'Escape') isOpen.value = false
  }

  function onScroll () {
    if (!isOpen.value) return

    const range = selection()
    if (!range) {
      isOpen.value = false
      return
    }

    const rect = range.getClientRects()[0] ?? range.getBoundingClientRect()
    const left = rect.left + rect.width / 2
    const moved = Math.abs(left - Number.parseFloat(anchorBox.value.left)) > 1
      || Math.abs(rect.top - Number.parseFloat(anchorBox.value.top)) > 1

    if (moved) isOpen.value = false
  }

  function onPress (event: Event) {
    event.preventDefault()
  }

  async function onCopy () {
    if (!link.value) return

    const ok = await clipboard.copy(link.value)
    if (!ok) return

    const live = document.querySelector('#docs-copy-status')
    if (!live) return
    live.textContent = ''
    live.textContent = 'Link copied'
  }

  function reveal (root: HTMLElement) {
    const mark = root.querySelector('.docs-text-mark')
    if (!mark) return

    const rect = mark.getBoundingClientRect()
    const hidden = rect.top < 80 || rect.bottom > window.innerHeight - 24
    if (!hidden) return

    // A heading link from another page jumps. Match that.
    mark.scrollIntoView({ block: 'center', behavior: 'auto' })
  }

  function wait (): Promise<void> {
    return new Promise(resolve => {
      requestAnimationFrame(() => resolve())
    })
  }

  async function paint () {
    if (!IN_BROWSER) return

    const token = ++generation
    clearTextMarks(document)
    // `route.hash` is empty on a fresh load: the browser strips the directive.
    // A later in-app navigation still has it, and that one wins.
    const directive = toTextDirective(route.hash) ?? readTextFragment()
    if (!directive) return

    for (let attempt = 0; attempt < 40; attempt++) {
      if (token !== generation) return

      const root = prose()
      if (root && paintTextFragment(root, directive)) {
        reveal(root)
        return
      }

      await wait()
    }
  }

  onMounted(() => {
    void paint()
  })

  watch(() => route.fullPath, () => {
    isOpen.value = false
    clipboard.reset()
    void paint()
  })

  useEventListener(window, 'pointermove', onMove)
  useEventListener(window, 'pointerup', onUp)
  useEventListener(window, 'keydown', onKey)
  useEventListener(window, 'scroll', onScroll, { capture: true })
</script>

<template>
  <span
    ref="anchor"
    class="pointer-events-none"
    :style="[popover.anchorStyles.value, anchorBox]"
  />

  <div
    ref="panel"
    class="rounded-md border border-divider bg-surface text-on-surface shadow-lg"
    data-docs-text-link
    v-bind="popover.contentAttrs.value"
    :style="[popover.contentStyles.value, { margin: '8px 0' }]"
  >
    <button
      :aria-label="clipboard.copied.value ? 'Link copied' : 'Copy link to this text'"
      class="inline-flex items-center gap-1 px-2 py-1 text-xs cursor-pointer"
      type="button"
      @click="onCopy"
      @mousedown="onPress"
    >
      <AppIcon :icon="clipboard.copied.value ? 'success' : 'copy'" size="14" />
      {{ clipboard.copied.value ? 'Copied' : 'Copy link' }}
    </button>
  </div>
</template>

<style>
  ::target-text {
    background-color: var(--v0-warning);
    color: var(--v0-on-warning);
  }

  .docs-text-mark {
    scroll-margin-top: calc(48px + var(--app-banner-h, 0px) + 1rem);
    scroll-margin-bottom: 1rem;
  }
</style>
