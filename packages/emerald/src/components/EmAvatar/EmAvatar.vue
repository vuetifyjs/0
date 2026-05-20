<script lang="ts">
  // Framework
  import { Atom, AvatarRoot } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export type EmAvatarSize = 'sm' | 'md' | 'lg'

  export interface EmAvatarProps extends AtomProps {
    size?: EmAvatarSize
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAvatar' })

  const { size = 'md', ...paperProps } = defineProps<EmAvatarProps>()
</script>

<template>
  <Atom
    v-bind="paperProps"
    as="div"
    class="emerald-avatar"
    :data-size="size"
  >
    <AvatarRoot class="emerald-avatar__inner">
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </AvatarRoot>
  </Atom>
</template>

<style>
.emerald-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  border-radius: 9999px;
  background: transparent;
  color: var(--emerald-neutral-700);
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-weight: 400;
  letter-spacing: 0.01em;
  user-select: none;
  flex-shrink: 0;
  box-sizing: border-box;
}

.emerald-avatar__inner {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
  border: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  background: var(--emerald-neutral-100, #f3f3f4);
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
