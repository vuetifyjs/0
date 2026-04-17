<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface EmGridProps extends AtomProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmGrid' })

  const {} = defineProps<EmGridProps>()
</script>

<template>
  <Atom as="div" class="emerald-grid">
    <slot />
  </Atom>
</template>
