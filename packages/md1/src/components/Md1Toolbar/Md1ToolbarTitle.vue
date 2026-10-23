<script lang="ts">
  // Context
  import { orphan, useMd1Toolbar } from './Md1Toolbar.vue'
  import { useMd1ToolbarExtension } from './Md1ToolbarExtension.vue'

  // Utilities
  import { onBeforeUnmount, toRef } from 'vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ToolbarTitle' })

  defineSlots<{
    /** The app title, page title or page filter. */
    default?: () => any
  }>()

  const context = useMd1Toolbar()

  orphan('Md1ToolbarTitle', context)

  const extension = useMd1ToolbarExtension()

  const release = extension?.title()

  onBeforeUnmount(() => release?.())

  // In a collapsing flexible space the large title shrinks to 20 sp with the
  // space, 1:1 with the scroll (scrolling-techniques page).
  const style = toRef(() => {
    if (!extension || context?.scroll.value !== 'collapse') return undefined

    const progress = context.progress.value

    return {
      fontSize: `calc(var(--md1-type-display-1-size, 34px) - (var(--md1-type-display-1-size, 34px) - var(--md1-type-title-size, 20px)) * ${progress})`,
    }
  })
</script>

<template>
  <div class="md1-toolbar__title" :style>
    <slot />
  </div>
</template>

<style>
  /*
   * Title, Medium 20 sp, across form factors (typography page), on one line.
   * Without a nav icon it sits on the 16 / 24 dp keyline; after one, on the
   * 72 / 80 dp content keyline (the 48 dp target ends 36 dp past the margin).
   */
  .md1-toolbar__title {
    flex: 1 1 auto;
    min-width: 0;
    margin-inline-start: 12px;
    overflow: hidden;
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-type-title-weight, 500);
    line-height: var(--md1-type-title-leading, 1);
    letter-spacing: var(--md1-type-title-tracking, 0.005em);
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .md1-toolbar__nav + .md1-toolbar__title {
    margin-inline-start: calc(var(--md1-keyline-content, 72px) - var(--md1-keyline-margin, 16px) - 36px);
  }

  @media (min-width: 600px) {
    .md1-toolbar__nav + .md1-toolbar__title {
      margin-inline-start: calc(var(--md1-keyline-content, 80px) - var(--md1-keyline-margin, 24px) - 36px);
    }
  }

  .md1-toolbar[data-dense] .md1-toolbar__nav + .md1-toolbar__title {
    margin-inline-start: calc(var(--md1-keyline-content, 72px) - var(--md1-keyline-margin, 16px) - 32px);
  }

  @media (min-width: 600px) {
    .md1-toolbar[data-dense] .md1-toolbar__nav + .md1-toolbar__title {
      margin-inline-start: calc(var(--md1-keyline-content, 80px) - var(--md1-keyline-margin, 24px) - 32px);
    }
  }

  /* Prominent: the title rests at the bottom of the bar, 20 dp above its edge (structure page). */
  .md1-toolbar[data-prominent] .md1-toolbar__title {
    align-self: flex-end;
    padding-block-end: 20px;
  }

  /*
   * The large title of an extended bar: Display 1 at the content keyline,
   * centred in one increment so it lands in the row when the space collapses.
   * The spec states only the collapsed 20 sp; 34 sp is an MD1 decision.
   */
  .md1-toolbar__extension .md1-toolbar__title {
    flex: none;
    margin-inline-start: var(--md1-keyline-content, 72px);
    padding-block-end: calc((var(--md1-increment, 56px) - var(--md1-type-title-size, 20px)) / 2);
    font-size: var(--md1-type-display-1-size, 34px);
    line-height: 1;
  }

  @media (min-width: 600px) {
    .md1-toolbar__extension .md1-toolbar__title {
      margin-inline-start: var(--md1-keyline-content, 80px);
      padding-block-end: calc((var(--md1-increment, 64px) - var(--md1-type-title-size, 20px)) / 2);
    }
  }
</style>
