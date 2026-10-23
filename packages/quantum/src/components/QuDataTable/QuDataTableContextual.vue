<script lang="ts">
  // Framework
  import { isUndefined, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useQuDataTable } from './QuDataTable.vue'

  // Utilities
  import { onBeforeUnmount, toRef } from 'vue'

  export interface QuDataTableContextualProps {
    /** The number in the "N selected" label. Defaults to the selection size. */
    count?: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDataTableContextual' })

  defineSlots<{
    /** The contextual action icons, `QuButton icon` children: delete, an overflow menu. */
    default?: () => any
  }>()

  const { count } = defineProps<QuDataTableContextualProps>()

  const context = useQuDataTable()
  const locale = useLocale()

  orphan('QuDataTableContextual', context)

  // The header hides while this part exists and rows are selected; the root counts mounted parts.
  if (context) {
    context.contextual.value++

    onBeforeUnmount(() => {
      context.contextual.value--
    })
  }

  const total = toRef(() => (isUndefined(count) ? context?.count.value : count) ?? 0)
  // `count` overrides the number only; the part shows while rows are selected, as the header hides.
  const visible = toRef(() => (context ? context.active.value : total.value > 0))
  // The figure's label: "1 item selected". A key of its own, since `Quantum.selected` is the bare "Selected".
  const label = toRef(() => locale.ti('Quantum.itemsSelected', total.value) ?? (total.value === 1 ? '1 item selected' : `${total.value} items selected`))

  // The navigation page's Back dismisses the contextual bar and clears the selection; Escape is the keyboard path.
  function onKeydown (event: KeyboardEvent) {
    if (event.key === 'Escape') context?.table.selection.unselectAll()
  }
</script>

<template>
  <div
    v-if="visible"
    :aria-label="label"
    class="quantum-data-table__contextual"
    role="toolbar"
    @keydown="onKeydown"
  >
    <span
      aria-live="polite"
      class="quantum-data-table__count"
    >
      {{ label }}
    </span>

    <div class="quantum-data-table__actions">
      <slot />
    </div>
  </div>
</template>

<style>
  /*
   * The contextual header fills with the accent's lighter contrast value
   * (the A100, the page's "50-value of the secondary app color"). That fill is
   * the same in both themes and the palette marks it a black-ink swatch, so the
   * ink here is black at the text tiers rather than the theme's ink tokens.
   */
  .quantum-data-table__contextual {
    background: var(--quantum-accent-light, #FF80AB);
    color: color-mix(in srgb, var(--quantum-black, #000000) 87%, transparent);
  }

  /* The count label, Subheading 16 sp (the figure's size; the page states none). */
  .quantum-data-table__count {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    font-size: var(--quantum-type-subheading-size, 16px);
    font-weight: var(--quantum-font-weight-regular, 400);
    line-height: var(--quantum-type-subheading-leading, 24px);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .quantum-data-table__contextual .quantum-button[data-variant='flat'] {
    color: color-mix(in srgb, var(--quantum-black, #000000) 54%, transparent);
  }

  .quantum-data-table__contextual .quantum-button[data-disabled] {
    color: color-mix(in srgb, var(--quantum-black, #000000) 38%, transparent);
  }
</style>
