<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface EmFormFieldProps extends AtomProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmFormField' })

  const { as = 'div', renderless = false } = defineProps<EmFormFieldProps>()
</script>

<template>
  <Atom
    :as
    class="emerald-form-field"
    :renderless
  >
    <slot />
  </Atom>
</template>

<style>
.emerald-form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
