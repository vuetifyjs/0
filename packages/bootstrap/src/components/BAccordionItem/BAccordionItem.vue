<script lang="ts">
  // Framework
  import { isNull } from '@vuetify/v0'

  // Utilities
  import { orphan } from '../../utilities/context'
  import { toRef } from 'vue'

  import { useBAccordion } from '../BAccordion/BAccordion.vue'

  export interface BAccordionItemProps {
    /**
     * Sets the native `open` attribute. Leave it unset and the browser toggles the item.
     *
     * @default false
     */
    open?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BAccordionItem' })

  defineSlots<{
    /** Header and body. */
    default?: () => any
  }>()

  const { open = false } = defineProps<BAccordionItemProps>()

  const accordion = useBAccordion()

  orphan('BAccordionItem', 'BAccordion', accordion)

  const group = toRef(() => {
    if (isNull(accordion)) return
    return accordion.name.value
  })
</script>

<template>
  <details
    class="accordion-item"
    :name="group"
    :open="open || undefined"
  >
    <slot />
  </details>
</template>
