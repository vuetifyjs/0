<script lang="ts">
  // Framework
  import { AvatarGroup } from '@vuetify/v0'

  export interface EmAvatarGroupProps {
    /** Upper bound on visible avatars; overflow hides from the end */
    max?: number
    /** Accessible name for the group */
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAvatarGroup' })

  const { max, label } = defineProps<EmAvatarGroupProps>()
</script>

<template>
  <AvatarGroup class="emerald-avatar-group" :label :max>
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </AvatarGroup>
</template>

<style>
/* Unscoped: the overlap rule targets slotted EmAvatar children that a
   scoped attribute cannot reach. */
.emerald-avatar-group {
  display: flex;
  align-items: center;
}

.emerald-avatar-group .emerald-avatar + .emerald-avatar {
  margin-inline-start: calc(-1 * var(--emerald-spacing-xl));
}
</style>
