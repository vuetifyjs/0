<script lang="ts">
  // Framework
  import { createStorage, IN_BROWSER, useEventListener, useTheme } from '@vuetify/v0'

  // Composables
  import { useExamples } from '@/composables/useExamples'

  // Utilities
  import { nextTick, onScopeDispose, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { GnDocsExampleFile } from '@paper/genesis'
  import type { StorageContext } from '@vuetify/v0'
  import type { Ref } from 'vue'

  // Frame padding (2 × 1.5rem) plus one Bulma control — the resting height of
  // the shortest example that exists. A first-ever visit reserves this and grows
  // once; reserving more would mean the box shrinking on arrival, which reads
  // far worse than growing.
  const RESERVE = 88

  let store: StorageContext | null = null

  // Where an example comes to rest is a property of the example, not of the
  // visit — but it can only be learned by loading it once. Remembering it for
  // the session means every load after the first reserves the right box and
  // nothing moves. Session, not local: an example's height changes when its
  // source does, and a stale reserve should not outlive the tab.
  function reserve (entry: string): Ref<number> {
    if (!IN_BROWSER) return shallowRef(RESERVE)

    store ??= createStorage({ adapter: window.sessionStorage })

    // Bucketed by width: the same example wraps differently across viewports,
    // and a height learned at one width is not a promise at another.
    return store.get(`sandbox:${entry}:${Math.round(window.innerWidth / 160)}`, RESERVE)
  }

  // Page-level state. Every example on a page promotes into the same viewport
  // and lifts the same ancestor stacking contexts, so both have to be owned
  // once rather than per instance — two instances lifting the same ancestors
  // would each record the other's `9999` as the value to restore, and the last
  // one out would leave the page permanently raised.
  let owner: symbol | null = null
  let lifted: { el: HTMLElement, z: string }[] = []

  const releases = new Map<symbol, () => void>()

  // The frame sits inside AppMain's `z-0` stacking context, a sibling of the
  // app bar's `z-1` — so no z-index on the frame itself can paint it over the
  // chrome. The contexts between it and the body have to be lifted instead.
  // Moving the frame in the DOM would be the other way out, and is not one:
  // re-parenting an iframe reloads it, taking the open overlay with it.
  function raise (el: HTMLElement | null | undefined) {
    if (lifted.length > 0) return

    for (let node = el?.parentElement; node && node !== document.body; node = node.parentElement) {
      const style = getComputedStyle(node)

      if (style.position === 'static' || style.zIndex === 'auto') continue

      lifted.push({ el: node, z: node.style.zIndex })
      node.style.zIndex = '9999'
    }
  }

  function lower () {
    for (const { el, z } of lifted) el.style.zIndex = z

    lifted = []
  }

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
</script>

<script setup lang="ts">
  defineOptions({ name: 'DocsSystemExample' })

  const { filePath, filePaths } = defineProps<DocsSystemExampleProps>()

  // Emerald mounts inline under `[data-theme="emerald-light"]` — its tokens
  // do not reset host elements, so it can share the docs document. Systems
  // that reset `button`/`input` (Bulma) cannot; those run in an iframe
  // against `sandbox/<system>.html`. Source is still resolved here for the
  // code pane, playground, and bin actions on the iframe path.
  const examples = useExamples()

  const paths = toRef(() => filePaths ?? (filePath ? [filePath] : []))

  const entry = toRef(() => paths.value.at(-1)?.replace(/\.vue$/, '') ?? '')

  const single = toRef(() => (filePath ? examples.resolve(filePath) : undefined))
  const multi = toRef(() => (filePaths?.length ? examples.resolveMultiple(filePaths) : undefined))

  const code = toRef(() => single.value?.code)
  const files = toRef<GnDocsExampleFile[] | undefined>(() => multi.value?.files)
  const name = toRef(() => `${entry.value.split('/').pop()}.vue`)

  const theme = useTheme()

  const segments = toRef(() => entry.value.replace(/^\//, '').split('/'))
  const framed = toRef(() => segments.value[1] !== 'emerald')
  const inlineTheme = toRef(() => theme.isDark.value ? 'emerald-dark' : 'emerald-light')

  // Snapshot, not a binding: folding the theme into a reactive `src` would
  // reload the frame — dropping any open overlay — on every toggle. It only
  // buys a correct first paint; live changes ride the message channel below.
  const scheme = theme.isDark.value ? 'dark' : 'light'

  // What the box looks like before the frame's document exists. A frame's
  // canvas is opaque from the moment it is attached and the UA colors it from
  // the embedder's `color-scheme`, so that is declared here rather than left to
  // inherit whatever the docs root happens to carry. The matching background
  // makes the gap before load read as the surface the example settles on
  // instead of the page behind it. Bulma's own values, mirroring the critical
  // style in `sandbox/bulma.html`.
  const surface = toRef(() => (theme.isDark.value
    ? { colorScheme: 'dark', backgroundColor: '#14161a' }
    : { colorScheme: 'light', backgroundColor: '#fff' }))

  // `/systems/bulma/modal/basic` -> system `bulma`, example `modal/basic`
  const src = toRef(() => {
    const [, system, ...rest] = segments.value

    return `/sandbox/${system}.html?e=${rest.join('/')}&theme=${scheme}`
  })

  // Two different questions. `height` is what the box is right now and follows
  // every measurement the sandbox sends, up or down. `saved` is what the
  // example is worth reserving for next time, and only the first settled
  // measurement answers that — everything after it is the reader interacting (a
  // hover menu, a validation message), and reserving one of those would open
  // the box too tall on the next load and shrink.
  const saved = reserve(entry.value)
  const height = shallowRef(saved.value)
  const overlay = shallowRef(false)

  let rested = false
  const frame = useTemplateRef<HTMLIFrameElement>('frame')

  // An iframe paints an opaque canvas — a transparent document inside it does
  // not make the frame see-through. So a promoted frame is clipped to the
  // regions the sandbox says it is actually painting: the example box and
  // whatever floats out of it. Everything else is cut away and the docs page
  // shows through, which is what puts an open menu *over* the page instead of
  // behind a white sheet.
  const clip = shallowRef<string | undefined>()

  function shape (rects: { top: number, left: number, width: number, height: number }[]) {
    if (!rects?.length) {
      clip.value = undefined

      return
    }

    clip.value = rects
      .map(r => `M${r.left} ${r.top}H${r.left + r.width}V${r.top + r.height}H${r.left}Z`)
      .join('')
  }

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

  const token = Symbol('docs-system-example')

  // Give the page back exactly what promotion took: the frame's own geometry,
  // the clip, and the ancestor z-indexes. Runs on close, on being displaced by
  // another example, and on teardown — the residue from a half-restore is what
  // makes examples pile on top of each other.
  function release () {
    overlay.value = false
    clip.value = undefined

    if (owner !== token) return

    owner = null
    lower()
  }

  // One promoted frame per page. A second example asking to promote displaces
  // the first — it is dismissed and fully restored before this one takes over,
  // so the lift is only ever held by one instance.
  //
  // Only the overlay tier lifts. A modal is meant to cover the page chrome; a
  // dropdown is page content, so the frame stays inside AppMain's stacking
  // context and the sticky app bar occludes the menu on scroll, exactly as it
  // occludes the prose around the example.
  function claim (tier: string) {
    if (owner !== token) {
      for (const [key, dismiss] of releases) {
        if (key !== token) dismiss()
      }

      owner = token
    }

    if (tier === 'overlay') raise(frame.value)
    else lower()
  }

  releases.set(token, () => {
    post({ type: 'v0:sandbox:dismiss' })
    release()
  })

  onScopeDispose(() => {
    releases.delete(token)
    release()
  })

  watch(() => theme.isDark.value, sync)

  if (IN_BROWSER && framed.value) {
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

          // The example as it comes up, with nothing spilling out of it: that
          // is the box worth reserving next time. Once taken, it is not
          // revisited — later measurements are the reader, not the example.
          if (!rested && !event.data.grown) {
            rested = true
            saved.value = event.data.height
          }

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
          if (event.data.open) {
            claim(event.data.tier)
            overlay.value = true
            shape(event.data.rects)
          } else {
            release()
          }

          // Correct any staleness now that the frame has left the flow; the
          // placeholder keeps its geometry either way.
          nextTick(place)
          break
        }
        // A menu can resize under its own content while it stays open, and a
        // dropdown opened inside a modal escalates float to overlay.
        case 'v0:sandbox:rects': {
          claim(event.data.tier)
          shape(event.data.rects)
          break
        }
      }
    })

    // Clipped-away regions are not hit-testable, so a click on the docs page
    // never reaches the sandbox — hand it over, or an open menu would sit there
    // while the reader clicks around it.
    useEventListener(document, 'pointerdown', (event: PointerEvent) => {
      if (!overlay.value || event.target === frame.value) return

      post({ type: 'v0:sandbox:dismiss' })
    })

    // A resize moves the box the pinned content sits on. So does a scroll: the
    // clipped frame no longer swallows the page's wheel events, and the page
    // can scroll itself anyway (hash jumps, scroll-spy), which would leave the
    // pinned content stranded at the coordinates it was promoted with.
    useEventListener(window, 'resize', place)
    useEventListener(window, 'scroll', () => {
      if (overlay.value) place()
    }, { passive: true })
  }
</script>

<template>
  <DocsGenesisExample
    v-if="!framed"
    :id
    :collapse
    :file-orders
    :file-path
    :file-paths
    :peek
    :theme="inlineTheme"
    :title
  >
    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
  </DocsGenesisExample>

  <DocsGenesisExample
    v-else
    :id
    :code
    :collapse
    :file="name"
    :file-orders
    :files
    :peek
    :title
  >
    <div class="relative w-full rounded" :style="[surface, { height: `${height}px` }]">
      <iframe
        ref="frame"
        :class="overlay
          ? 'fixed inset-0 z-[9999] h-full w-full border-0'
          : 'absolute inset-0 h-full w-full rounded border-0'"
        loading="lazy"
        :src
        :style="[surface, overlay && clip ? { clipPath: `path('${clip}')` } : undefined]"
        :title="`${name} example`"
      />
    </div>

    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
  </DocsGenesisExample>
</template>
