<script lang="ts">
  // Framework
  import { isUndefined, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Toolbar } from './Md1Toolbar.vue'

  // Utilities
  import { toRef } from 'vue'

  // Components
  import Md1Button from '../Md1Button/Md1Button.vue'

  export interface Md1ToolbarContextualProps {
    /** How many items are selected; rendered as "N selected" in the title position. */
    count?: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ToolbarContextual' })

  defineSlots<{
    /** The actions that apply to the selected items. */
    default?: () => any
  }>()

  const { count } = defineProps<Md1ToolbarContextualProps>()

  const emit = defineEmits<{
    clear: []
  }>()

  const context = useMd1Toolbar()

  orphan('Md1ToolbarContextual', context)

  const locale = useLocale()

  // Shown while the root is in selection mode; an orphan always shows.
  const active = toRef(() => context?.contextual.value ?? true)

  const label = toRef(() => isUndefined(count) ? undefined : locale.ti('Md1.selectedCount', count) ?? `${count} selected`)

  function onClear () {
    emit('clear')
  }

  // Exiting selection mode: the close action, or Escape anywhere in the bar (navigation page's Back).
  function onKeydown (event: KeyboardEvent) {
    if (event.key !== 'Escape' || event.defaultPrevented) return

    event.preventDefault()
    emit('clear')
  }
</script>

<template>
  <div
    v-if="active"
    class="md1-toolbar__contextual"
    @keydown="onKeydown"
  >
    <Md1Button
      :aria-label="locale.ti('Md1.close') ?? 'Close'"
      class="md1-toolbar__close"
      icon="close"
      @click="onClear"
    />

    <span
      v-if="label"
      aria-live="polite"
      class="md1-toolbar__count"
    >{{ label }}</span>

    <slot />
  </div>
</template>

<style>
  .md1-toolbar__contextual {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    align-self: stretch;
    min-width: 0;
  }

  /* The count takes the title's place and style: Title 20 sp on the content keyline. */
  .md1-toolbar__count {
    flex: 1 1 auto;
    min-width: 0;
    margin-inline-start: calc(var(--md1-keyline-content, 72px) - var(--md1-keyline-margin, 16px) - 36px);
    overflow: hidden;
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-type-title-weight, 500);
    line-height: var(--md1-type-title-leading, 1);
    letter-spacing: var(--md1-type-title-tracking, 0.02em);
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  @media (min-width: 600px) {
    .md1-toolbar__count {
      margin-inline-start: calc(var(--md1-keyline-content, 80px) - var(--md1-keyline-margin, 24px) - 36px);
    }
  }

  /* Dense: the close target is 40 dp, so the count keeps the keyline with 4 dp less to subtract. */
  .md1-toolbar[data-dense] .md1-toolbar__count {
    margin-inline-start: calc(var(--md1-keyline-content, 72px) - var(--md1-keyline-margin, 16px) - 32px);
  }

  @media (min-width: 600px) {
    .md1-toolbar[data-dense] .md1-toolbar__count {
      margin-inline-start: calc(var(--md1-keyline-content, 80px) - var(--md1-keyline-margin, 24px) - 32px);
    }
  }

  .md1-toolbar__contextual > .md1-toolbar__actions,
  .md1-toolbar__count + * {
    margin-inline-start: auto;
  }
</style>
