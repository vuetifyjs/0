<script lang="ts">
  // Framework
  import { createContext, useMutationObserver, useResizeObserver } from '@vuetify/v0'

  // Context
  import { orphan, useQuToolbar } from './QuToolbar.vue'

  // Utilities
  import { onBeforeUnmount, onMounted, shallowRef, toRef, useTemplateRef } from 'vue'

  /** Width to height, as `4:3`. */
  export type QuToolbarExtensionRatio = `${number}:${number}`

  export interface QuToolbarExtensionProps {
    /** A flexible-space image: it fills the app bar, row included, and takes the primary tint once the space collapses. */
    image?: string
    /** The flexible space's aspect ratio with an image (scrolling-techniques page example: 4:3). */
    ratio?: QuToolbarExtensionRatio
  }

  export interface QuToolbarExtensionContext {
    /** `QuToolbarTitle` registers when it sits in the extension: the large, collapsing title. Returns the release. */
    title: () => () => void
  }

  const [useQuToolbarExtension, provideQuToolbarExtension] = createContext<QuToolbarExtensionContext | null>('quantum:toolbar:extension', null)

  export { useQuToolbarExtension }

  /** A tab bar from `QuTabs`, whichever of its parts the consumer placed here. */
  const TABS = '.quantum-tabs, .quantum-tabs__bar'
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuToolbarExtension' })

  defineSlots<{
    /** A QuTabs bar, the large title, or related content. */
    default?: () => any
  }>()

  const { image, ratio = '4:3' } = defineProps<QuToolbarExtensionProps>()

  const context = useQuToolbar()

  orphan('QuToolbarExtension', context)

  const content = useTemplateRef<HTMLElement>('content')

  const measured = shallowRef(0)
  const tabs = shallowRef(false)
  const titles = shallowRef(0)

  useResizeObserver(content, entries => {
    measured.value = entries[0]?.contentRect.height ?? 0
  }, { immediate: true })

  function detect () {
    tabs.value = !!content.value?.querySelector(TABS)
  }

  onMounted(detect)

  useMutationObserver(content, detect, { childList: true, subtree: true })

  provideQuToolbarExtension({
    title () {
      titles.value++

      return () => {
        titles.value--
      }
    },
  })

  // With an image the whole bar takes the ratio: the extension is the ratio's
  // height less the row it runs under. The width is the root's measurement: an
  // observer on this element would see its own height change under it.
  const natural = toRef(() => {
    if (!image) return measured.value

    const [w = 4, h = 3] = ratio.split(':').map(Number)

    return w > 0 ? Math.max((context?.width.value ?? 0) * h / w - (context?.row.value ?? 0), 0) : 0
  })

  const collapsing = toRef(() => context?.scroll.value === 'collapse')
  const progress = toRef(() => context?.progress.value ?? 0)

  const release = context?.extension({
    height: natural,
    tabs,
    image: toRef(() => !!image),
  })

  onBeforeUnmount(() => release?.())

  const style = toRef(() => {
    if (collapsing.value) return { height: `${natural.value * (1 - progress.value)}px` }
    if (image) return { height: `${natural.value}px` }

    return undefined
  })

  // Related content (not tabs, not a title, not an image) under a primary bar takes the lighter primary.
  const related = toRef(() => !tabs.value && titles.value === 0 && !image)
</script>

<template>
  <div
    class="quantum-toolbar__extension"
    :data-image="!!image || undefined"
    :data-related="related || undefined"
    :data-tabs="tabs || undefined"
    :data-title="titles > 0 || undefined"
    :style
  >
    <div v-if="image" class="quantum-toolbar__image">
      <img alt="" class="quantum-toolbar__img" :src="image">
    </div>

    <div ref="content" class="quantum-toolbar__extension-content">
      <slot />
    </div>
  </div>
</template>

<style>
  /*
   * The flexible space under the row. Content rests on its bottom edge, so a
   * collapsing space pushes it up; a large title overflows upward and lands in
   * the row at 20 sp when the space is gone.
   */
  .quantum-toolbar__extension {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    box-sizing: border-box;
    min-width: 0;
    overflow: hidden;
  }

  .quantum-toolbar__extension[data-title] {
    overflow: visible;
  }

  .quantum-toolbar__extension-content {
    position: relative;
    z-index: 1;
    flex: none;
    min-width: 0;
  }

  /* Extended app bar: the default height plus one increment (structure page). */
  .quantum-toolbar__extension[data-title] .quantum-toolbar__extension-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    min-height: var(--quantum-increment, 56px);
  }

  @media (min-width: 600px) {
    .quantum-toolbar__extension[data-title] .quantum-toolbar__extension-content {
      min-height: var(--quantum-increment, 64px);
    }
  }

  /*
   * Related information under a primary region takes a lighter version of the
   * primary colour, with dark ink (colour page). The 100 shade is light in
   * both themes, so the ink is the light theme's 87% black in both, not the
   * theme's text role (white on the dark theme).
   */
  .quantum-toolbar[data-variant='primary'] .quantum-toolbar__extension[data-related] {
    background: var(--quantum-primary-light, #C5CAE9);
    color: color-mix(in srgb, var(--quantum-black, #000000) 87%, transparent);
  }

  /* The image fills the whole bar, the row included; its containing block is the toolbar root. */
  .quantum-toolbar__image {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  .quantum-toolbar__img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /*
   * At the end of the collapse the image takes the primary tint, independent
   * of scrolling: a timed fade once the space is gone (scrolling-techniques page).
   */
  .quantum-toolbar__image::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--quantum-primary, #3F51B5);
    opacity: 0;
    transition: opacity var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-toolbar[data-collapsed] .quantum-toolbar__image::after {
    opacity: 1;
  }

  body[data-reduced-motion='reduce'] .quantum-toolbar__image::after {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-toolbar__image::after {
      transition: none;
    }
  }
</style>
