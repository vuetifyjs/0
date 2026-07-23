<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { AvatarRoot } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export type EmAvatarSize = 'sm' | 'md' | 'lg'

  export interface EmAvatarProps extends V0PaperProps {
    size?: EmAvatarSize
    /** Identifier when used inside EmAvatarGroup; harmless when standalone */
    value?: unknown
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAvatar' })

  const { size = 'md', value, ...paperProps } = defineProps<EmAvatarProps>()
</script>

<template>
  <AvatarRoot renderless :value>
    <template #default="slotProps">
      <V0Paper
        v-show="!slotProps.isHidden"
        v-bind="paperProps"
        :aria-hidden="slotProps.isHidden || undefined"
        as="div"
        class="emerald-avatar"
        :data-hidden="slotProps.isHidden || undefined"
        :data-size="size"
      >
        <slot v-bind="slotProps" />
      </V0Paper>
    </template>
  </AvatarRoot>
</template>

<style>
/* Unscoped: the __image / __fallback / __badge classes land on slotted
   sub-components that a scoped attribute cannot reach. */
.emerald-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--emerald-radius-full);
  box-shadow: var(--emerald-shadow-s);
  background: var(--emerald-neutral-200);
  color: var(--emerald-neutral-800);
  font-family: var(--emerald-font-sans);
  user-select: none;
  flex-shrink: 0;
  box-sizing: border-box;
}

.emerald-avatar[data-size="sm"] {
  width: 32px;
  height: 32px;
  font-size: var(--emerald-text-b3-size);
  font-weight: var(--emerald-text-b3-weight);
  line-height: 1;
}

.emerald-avatar[data-size="md"] {
  width: 40px;
  height: 40px;
  font-size: var(--emerald-text-b2-size);
  font-weight: var(--emerald-text-b2-weight);
  line-height: 1;
}

.emerald-avatar[data-size="lg"] {
  width: 48px;
  height: 48px;
  font-size: var(--emerald-text-b1-size);
  font-weight: var(--emerald-text-b1-weight);
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
  border-radius: inherit;
  overflow: hidden;
  color: inherit;
}

.emerald-avatar__badge {
  position: absolute;
  inset-inline-end: 0;
  bottom: 0;
  z-index: 1;
  width: 12px;
  height: 12px;
  border-radius: var(--emerald-radius-full);
  background: var(--emerald-primary-600);
  border: var(--emerald-stroke-m) solid var(--emerald-on-primary);
  box-shadow: var(--emerald-shadow-badge);
  box-sizing: border-box;
}
</style>
