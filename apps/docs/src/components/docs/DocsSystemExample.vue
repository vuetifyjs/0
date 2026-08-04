<script setup lang="ts">
  // Framework
  import { IN_BROWSER, useEventListener, useTheme } from '@vuetify/v0'

  // Composables
  import { useExamples } from '@/composables/useExamples'

  // Utilities
  import { nextTick, onScopeDispose, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { GnDocsExampleFile } from '@paper/genesis'

  export interface DocsSystemExampleProps {
    /** Auto-resolve example by path (extensionless; .vue assumed) */
    filePath?: string
    /** Auto-resolve multi-file example by paths (extensions required) */
    filePaths?: string[]
    /** Display order for files (indices match filePaths) */
    fileOrders?: (number | undefined)[]
    /** Description title */
    title?: string
    /** Anchor id for deep linking */
    id?: string
    /** Enable description collapse toggle */
    collapse?: boolean
    /** Peek mode for single-file */
    peek?: boolean
  }

  const { filePath, filePaths } = defineProps<DocsSystemExampleProps>()

  // Design-system examples cannot share a document with the docs shell: the
  // system owns global CSS (Bulma resets `button`, `input`, `.title`, …) and
  // UnoCSS's preflight fights it in both directions. The example therefore runs
  // in an iframe against `sandbox/<system>.html`, and only its source is read
  // here — for the code pane, playground and bin actions.
  const examples = useExamples()

  const paths = toRef(() => filePaths ?? (filePath ? [filePath] : []))

  const entry = toRef(() => paths.value.at(-1)?.replace(/\.vue$/, '') ?? '')

  const single = toRef(() => (filePath ? examples.resolve(filePath) : undefined))
  const multi = toRef(() => (filePaths?.length ? examples.resolveMultiple(filePaths) : undefined))

  const code = toRef(() => single.value?.code)
  const files = toRef<GnDocsExampleFile[] | undefined>(() => multi.value?.files)
  const name = toRef(() => `${entry.value.split('/').pop()}.vue`)

  const theme = useTheme()

  // Snapshot, not a binding: folding the theme into a reactive `src` would
  // reload the frame — dropping any open overlay — on every toggle. It only
  // buys a correct first paint; live changes ride the message channel below.
  const scheme = theme.isDark.value ? 'dark' : 'light'

  // `/systems/bulma/modal/basic` -> system `bulma`, example `modal/basic`
  const segments = toRef(() => entry.value.replace(/^\//, '').split('/'))
  const src = toRef(() => {
    const [, system, ...rest] = segments.value

    return `/sandbox/${system}.html?e=${rest.join('/')}&theme=${scheme}`
  })

  const height = shallowRef(200)
  const overlay = shallowRef(false)
  const frame = useTemplateRef<HTMLIFrameElement>('frame')

  function post (message: Record<string, unknown>) {
    frame.value?.contentWindow?.postMessage(message, window.location.origin)
  }

  function sync () {
    post({ type: 'v0:sandbox:theme', dark: theme.isDark.value })
  }

  // The placeholder holds the inline box open whether or not the frame has been
  // promoted out of it, so its rect is what the sandbox pins its content to.
  // Kept fresh ahead of time: a promotion has to pin in the same tick it is
  // detected, or the trigger button visibly rides the frame to the viewport
  // corner on the way.
  function place () {
    const rect = frame.value?.parentElement?.getBoundingClientRect()

    if (!rect) return

    post({ type: 'v0:sandbox:box', box: { top: rect.top, left: rect.left, width: rect.width } })
  }

  // Ancestors whose z-index was lifted to let the promoted frame out.
  const lifted: { el: HTMLElement, z: string }[] = []

  // The frame sits inside AppMain's `z-0` stacking context, a sibling of the
  // app bar's `z-1` — so no z-index on the frame itself can paint it over the
  // chrome. The contexts between it and the body have to be lifted instead.
  // Moving the frame in the DOM would be the other way out, and is not one:
  // re-parenting an iframe reloads it, taking the open overlay with it.
  function lift (open: boolean) {
    if (!open) {
      for (const { el, z } of lifted) el.style.zIndex = z

      lifted.length = 0

      return
    }

    for (let el = frame.value?.parentElement; el && el !== document.body; el = el.parentElement) {
      const style = getComputedStyle(el)

      if (style.position === 'static' || style.zIndex === 'auto') continue

      lifted.push({ el, z: el.style.zIndex })
      el.style.zIndex = '9999'
    }
  }

  onScopeDispose(() => lift(false))

  watch(() => theme.isDark.value, sync)

  if (IN_BROWSER) {
    useEventListener(window, 'message', (event: MessageEvent) => {
      if (event.source !== frame.value?.contentWindow) return

      switch (event.data?.type) {
        // Sent on mount. The frame is lazy, so it can come up long after the
        // reader last touched the theme toggle.
        case 'v0:sandbox:ready': {
          sync()
          place()
          break
        }
        case 'v0:sandbox:size': {
          height.value = event.data.height
          // The box the sandbox pins to is the one this height produces.
          nextTick(place)
          break
        }
        // A fixed overlay is laid out against the frame's viewport, so inline it
        // can only ever be shown clipped. Promoting the frame to the page
        // viewport lets the modal and its backdrop cover the docs page the way
        // they would in a real app, while the example's CSS stays in its own
        // document. The placeholder holds the inline box open meanwhile, so
        // nothing reflows and the page keeps its scroll position.
        case 'v0:sandbox:overlay': {
          overlay.value = event.data.open
          lift(event.data.open)
          // Correct any staleness now that the frame has left the flow; the
          // placeholder keeps its geometry either way.
          nextTick(place)
          break
        }
      }
    })

    // Scroll is moot — the promoted frame swallows it — but a resize moves the
    // box the pinned content is sitting on.
    useEventListener(window, 'resize', place)
  }
</script>

<template>
  <DocsGenesisExample
    :id
    :code
    :collapse
    :file="name"
    :file-orders
    :files
    :peek
    :title
  >
    <div class="relative w-full" :style="{ height: `${height}px` }">
      <iframe
        ref="frame"
        :class="overlay
          ? 'fixed inset-0 z-[9999] h-full w-full border-0'
          : 'absolute inset-0 h-full w-full rounded border-0'"
        loading="lazy"
        :src
        :title="`${name} example`"
      />
    </div>

    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
  </DocsGenesisExample>
</template>
