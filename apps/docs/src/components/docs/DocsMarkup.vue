<script setup lang="ts">
  // Components
  import { GnPeek } from '@paper/genesis'

  // Framework
  import { useEventListener } from '@vuetify/v0'

  // Composables
  import { useCodeGroupExpand } from '@/composables/useCodeGroupExpand'
  import { useSettings } from '@/composables/useSettings'
  import { useSyncedRef } from '@/composables/useSyncedRef'

  // Utilities
  import { decodeBase64 } from '@/utilities/decodeBase64'
  import { nextTick, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  const {
    code,
    language,
    title,
    binTitle,
    playground,
    collapse,
    collapseLines = 15,
    hideFilename,
  } = defineProps<{
    code: string // base64 encoded
    language?: string
    title?: string
    binTitle?: string
    playground?: boolean
    collapse?: boolean
    collapseLines?: number
    hideFilename?: boolean
  }>()

  const settings = useSettings()
  const lineWrap = useSyncedRef(settings.lineWrap)
  const size = settings.codeSize

  const decodedCode = toRef(() => decodeBase64(code))

  const expanded = useCodeGroupExpand() ?? shallowRef(false)
  const lineCount = toRef(() => decodedCode.value.split('\n').length)
  const shouldCollapse = toRef(() => collapse && lineCount.value > collapseLines)
  const collapsedHeight = toRef(() => `${collapseLines * 1.5 + 2.5}rem`)

  const rootRef = useTemplateRef<HTMLElement>('root')
  const scrollerRef = useTemplateRef<HTMLElement>('scroller')
  // Set in the capture phase, before the peek toggles `expanded`, and only on
  // the fence that was clicked — a code group shares that flag.
  let reveal = false

  function onCollapseClick (event: MouseEvent) {
    const target = event.target
    const root = rootRef.value
    if (!(target instanceof Element) || !root?.contains(target)) return
    const button = target.closest('.genesis-peek')
    if (!button || button.getAttribute('aria-expanded') !== 'true') return
    reveal = true
  }

  useEventListener(rootRef, 'click', onCollapseClick, { capture: true })

  // Expanded fences take the height of the file. The cap lives on example
  // panes. Collapsing keeps overflow:hidden on this same box.
  const windowStyle = toRef(() => {
    if (!shouldCollapse.value || expanded.value) return undefined
    return { maxHeight: collapsedHeight.value, overflow: 'hidden' }
  })

  watch(expanded, (isOpen, wasOpen) => {
    if (!wasOpen || isOpen) return
    const el = scrollerRef.value
    if (el) {
      // The window is not the scrollport. A long line scrolls inside the code.
      el.scrollTop = 0
      el.scrollLeft = 0
      for (const node of el.querySelectorAll<HTMLElement>('.shiki, .shiki code')) {
        node.scrollTop = 0
        node.scrollLeft = 0
      }
    }
    if (!reveal) return
    reveal = false
    const root = rootRef.value
    nextTick(() => revealTop(root))
  })

  function headerOffset (): number {
    const raw = getComputedStyle(document.documentElement).scrollPaddingTop
    const value = Number.parseFloat(raw)
    return Number.isFinite(value) ? value : 48
  }

  function revealTop (root: HTMLElement | null) {
    if (!root) return
    const header = headerOffset()
    const top = root.getBoundingClientRect().top
    if (top >= header - 1) return
    window.scrollBy(0, top - header)
  }
</script>

<template>
  <div ref="root" class="relative my-4" :class="shouldCollapse && 'mb-8'">
    <div
      class="docs-markup relative group"
      :class="[
        { 'docs-markup--wrap': lineWrap },
        shouldCollapse && !expanded && 'overflow-hidden rounded-b-2 border-b border-divider'
      ]"
    >
      <span
        v-if="title || language"
        class="absolute top-3 start-3 z-10 px-1.5 py-0.5 text-xs font-mono opacity-50"
        :class="{ 'uppercase': !title || hideFilename }"
      >
        {{ hideFilename ? language : title ?? language }}
      </span>

      <div
        class="absolute top-2 end-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity max-md:opacity-100"
      >
        <DocsCodeActions
          v-model:size="size"
          v-model:wrap="lineWrap"
          bin
          :bin-title
          :code="decodedCode"
          :language
          :playground
          show-copy
          show-size
          show-wrap
          :title
        />
      </div>

      <div
        ref="scroller"
        class="docs-markup__window"
        :class="!settings.prefersReducedMotion.value && 'transition-[max-height] duration-300 ease-out'"
        :style="windowStyle"
      >
        <slot />
      </div>

      <div v-if="shouldCollapse && !expanded" class="docs-markup-fade absolute inset-x-0 bottom-0 h-16 rounded-b-2 pointer-events-none" />
    </div>

    <GnPeek
      v-if="shouldCollapse"
      v-slot="{ expanded: open }"
      v-model:expanded="expanded"
      collapsed-label="Expand code"
      expanded-label="Collapse code"
    >
      {{ open ? 'Collapse' : 'Expand' }}
    </GnPeek>
  </div>
</template>

<style>
  .docs-markup-fade {
    background: var(--v0-pre);
    mask: linear-gradient(transparent, var(--v0-primary));
  }
</style>
