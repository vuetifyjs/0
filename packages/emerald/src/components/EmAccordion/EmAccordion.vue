<script lang="ts">
  // Framework
  import { Atom, ExpansionPanelGroup } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface EmAccordionProps extends AtomProps {
    disabled?: boolean
    multiple?: boolean
    mandatory?: boolean | 'force'
  }
</script>

<script setup lang="ts" generic="T">
  defineOptions({ name: 'EmAccordion' })

  const {
    disabled = false,
    multiple = false,
    mandatory = false,
    as = 'div',
    renderless = false,
  } = defineProps<EmAccordionProps>()

  const model = defineModel<T | T[]>()
</script>

<template>
  <Atom
    :as
    class="emerald-accordion"
    :data-disabled="disabled || undefined"
    :renderless
  >
    <ExpansionPanelGroup
      v-model="model"
      :disabled
      :mandatory
      :multiple
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </ExpansionPanelGroup>
  </Atom>
</template>

<style>
.emerald-accordion {
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  color: #000000;
}

/* ExpansionPanelGroup wraps items in a bare <div> — apply layout there. */
.emerald-accordion > * {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
