<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface EmFlexProps extends AtomProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmFlex' })

  const {} = defineProps<EmFlexProps>()
</script>

<template>
  <Atom as="div" class="emerald-flex">
    <slot />
  </Atom>
</template>
