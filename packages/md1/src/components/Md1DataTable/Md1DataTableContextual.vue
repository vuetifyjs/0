<script lang="ts">
  // Framework
  import { isUndefined, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useMd1DataTable } from './Md1DataTable.vue'

  // Utilities
  import { onBeforeUnmount, toRef } from 'vue'

  export interface Md1DataTableContextualProps {
    /** The number in the "N selected" label. Defaults to the selection size. */
    count?: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DataTableContextual' })

  defineSlots<{
    /** The contextual action icons, `Md1Button icon` children: delete, an overflow menu. */
    default?: () => any
  }>()

  const { count } = defineProps<Md1DataTableContextualProps>()

  const context = useMd1DataTable()
  const locale = useLocale()

  orphan('Md1DataTableContextual', context)

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
  // The figure's label: "1 item selected". A key of its own, since `Md1.selected` is the bare "Selected".
  const label = toRef(() => locale.ti('Md1.itemsSelected', total.value) ?? (total.value === 1 ? '1 item selected' : `${total.value} items selected`))

  // The navigation page's Back dismisses the contextual bar and clears the selection; Escape is the keyboard path.
  function onKeydown (event: KeyboardEvent) {
    if (event.key === 'Escape') context?.table.selection.unselectAll()
  }
</script>

<template>
  <div
    v-if="visible"
    :aria-label="label"
    class="md1-data-table__contextual"
    role="toolbar"
    @keydown="onKeydown"
  >
    <span
      aria-live="polite"
      class="md1-data-table__count"
    >
      {{ label }}
    </span>

    <div class="md1-data-table__actions">
      <slot />
    </div>
  </div>
</template>

<style>
  /*
   * The contextual header fills with the accent hue's 50, the page's
   * "50-value of the secondary app color" (Pink 50 by default). That fill is
   * the same in both themes and the palette marks it a black-ink swatch, so the
   * ink here is black at the text tiers rather than the theme's ink tokens.
   */
  .md1-data-table__contextual {
    background: var(--md1-accent-light, #FCE4EC);
    color: color-mix(in srgb, var(--md1-black, #000000) 87%, transparent);
  }

  /* The count label, Subheading 16 sp (the figure's size; the page states none). */
  .md1-data-table__count {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    font-size: var(--md1-type-subheading-size, 16px);
    font-weight: var(--md1-font-weight-regular, 400);
    line-height: var(--md1-type-subheading-leading, 24px);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .md1-data-table__contextual .md1-button[data-variant='flat'] {
    color: color-mix(in srgb, var(--md1-black, #000000) 54%, transparent);
  }

  .md1-data-table__contextual .md1-button[data-disabled] {
    color: color-mix(in srgb, var(--md1-black, #000000) 38%, transparent);
  }
</style>
