<script lang="ts">
  // Framework
  import { isUndefined, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useQuToolbar } from './QuToolbar.vue'

  // Utilities
  import { toRef } from 'vue'

  // Components
  import QuButton from '../QuButton/QuButton.vue'

  export interface QuToolbarContextualProps {
    /** How many items are selected; rendered as "N selected" in the title position. */
    count?: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuToolbarContextual' })

  defineSlots<{
    /** The actions that apply to the selected items. */
    default?: () => any
  }>()

  const { count } = defineProps<QuToolbarContextualProps>()

  const emit = defineEmits<{
    clear: []
  }>()

  const context = useQuToolbar()

  orphan('QuToolbarContextual', context)

  const locale = useLocale()

  // Shown while the root is in selection mode; an orphan always shows.
  const active = toRef(() => context?.contextual.value ?? true)

  const label = toRef(() => isUndefined(count) ? undefined : locale.ti('Quantum.selectedCount', count) ?? `${count} selected`)

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
    class="quantum-toolbar__contextual"
    @keydown="onKeydown"
  >
    <QuButton
      :aria-label="locale.ti('Quantum.close') ?? 'Close'"
      class="quantum-toolbar__close"
      icon="close"
      @click="onClear"
    />

    <span
      v-if="label"
      aria-live="polite"
      class="quantum-toolbar__count"
    >{{ label }}</span>

    <slot />
  </div>
</template>

<style>
  .quantum-toolbar__contextual {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    align-self: stretch;
    min-width: 0;
  }

  /* The count takes the title's place and style: Title 20 sp on the content keyline. */
  .quantum-toolbar__count {
    flex: 1 1 auto;
    min-width: 0;
    margin-inline-start: calc(var(--quantum-keyline-content, 72px) - var(--quantum-keyline-margin, 16px) - 36px);
    overflow: hidden;
    font-size: var(--quantum-type-title-size, 20px);
    font-weight: var(--quantum-type-title-weight, 500);
    line-height: var(--quantum-type-title-leading, 1);
    letter-spacing: var(--quantum-type-title-tracking, 0.005em);
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  @media (min-width: 600px) {
    .quantum-toolbar__count {
      margin-inline-start: calc(var(--quantum-keyline-content, 80px) - var(--quantum-keyline-margin, 24px) - 36px);
    }
  }

  /* Dense: the close target is 40 dp, so the count keeps the keyline with 4 dp less to subtract. */
  .quantum-toolbar[data-dense] .quantum-toolbar__count {
    margin-inline-start: calc(var(--quantum-keyline-content, 72px) - var(--quantum-keyline-margin, 16px) - 32px);
  }

  @media (min-width: 600px) {
    .quantum-toolbar[data-dense] .quantum-toolbar__count {
      margin-inline-start: calc(var(--quantum-keyline-content, 80px) - var(--quantum-keyline-margin, 24px) - 32px);
    }
  }

  .quantum-toolbar__contextual > .quantum-toolbar__actions,
  .quantum-toolbar__count + * {
    margin-inline-start: auto;
  }
</style>
