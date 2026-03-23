<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface EmDividerProps extends AtomProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDivider' })

  const {} = defineProps<EmDividerProps>()
</script>

<template>
  <Atom as="hr" class="emerald-divider">
    <slot />
  </Atom>
</template>
