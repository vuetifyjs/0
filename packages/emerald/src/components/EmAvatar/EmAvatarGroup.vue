<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface EmAvatarGroupProps extends AtomProps {
    spacing?: number
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'EmAvatarGroup' })

  const { spacing = 0, ...paperProps } = defineProps<EmAvatarGroupProps>()

  const style = toRef(() => ({
    '--emerald-avatar-group-spacing': `${spacing ? `-${spacing}px` : '0px'}`,
  } as Record<string, string>))
</script>

<template>
  <Atom
    v-bind="paperProps"
    as="div"
    class="emerald-avatar-group"
    :style
  >
    <slot />
  </Atom>
</template>

<style>
.emerald-avatar-group {
  display: inline-flex;
  align-items: center;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
}

.emerald-avatar-group > * + * {
  margin-left: var(--emerald-avatar-group-spacing, 0px);
}
</style>
