<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { AvatarRoot } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export type EmAvatarSize = 'sm' | 'md' | 'lg'

  export interface EmAvatarProps extends V0PaperProps {
    size?: EmAvatarSize
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAvatar' })

  const { size = 'md', ...paperProps } = defineProps<EmAvatarProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-avatar"
    :data-size="size"
  >
    <AvatarRoot>
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </AvatarRoot>
  </V0Paper>
</template>

<style>
.emerald-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 9999px;
  border: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  background: var(--emerald-neutral-100, #f3f3f4);
  color: var(--emerald-neutral-700);
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-weight: 400;
  letter-spacing: 0.01em;
  user-select: none;
  flex-shrink: 0;
  box-sizing: border-box;
}

.emerald-avatar[data-size="sm"] {
  width: 32px;
  height: 32px;
  font-size: 12px;
  line-height: 1;
}

.emerald-avatar[data-size="md"] {
  width: 40px;
  height: 40px;
  font-size: 14px;
  line-height: 1;
}

.emerald-avatar[data-size="lg"] {
  width: 48px;
  height: 48px;
  font-size: 16px;
  line-height: 1;
}

.emerald-avatar__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
  border-radius: inherit;
  pointer-events: none;
}

.emerald-avatar__fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: inherit;
}
</style>
