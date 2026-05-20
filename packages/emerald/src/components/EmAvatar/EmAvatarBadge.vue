<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export type EmAvatarBadgePosition =
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'

  export interface EmAvatarBadgeProps extends AtomProps {
    position?: EmAvatarBadgePosition
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAvatarBadge' })

  const { position = 'bottom-right', ...paperProps } = defineProps<EmAvatarBadgeProps>()
</script>

<template>
  <Atom
    v-bind="paperProps"
    as="span"
    class="emerald-avatar__badge"
    :data-position="position"
  >
    <slot />
  </Atom>
</template>

<style>
.emerald-avatar__badge {
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: var(--emerald-success-500, #22c55e);
  border: 2px solid #ffffff;
  box-sizing: content-box;
  z-index: 1;
}

.emerald-avatar__badge[data-position="top-left"] {
  top: 0;
  left: 0;
  transform: translate(-25%, -25%);
}

.emerald-avatar__badge[data-position="top-right"] {
  top: 0;
  right: 0;
  transform: translate(25%, -25%);
}

.emerald-avatar__badge[data-position="bottom-left"] {
  bottom: 0;
  left: 0;
  transform: translate(-25%, 25%);
}

.emerald-avatar__badge[data-position="bottom-right"] {
  bottom: 0;
  right: 0;
  transform: translate(25%, 25%);
}
</style>
