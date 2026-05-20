<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface EmFormGroupProps extends AtomProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmFormGroup' })

  const { as = 'div', renderless = false } = defineProps<EmFormGroupProps>()
</script>

<template>
  <Atom
    :as
    class="emerald-form-group"
    :renderless
  >
    <slot />
  </Atom>
</template>

<style>
.emerald-form-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
