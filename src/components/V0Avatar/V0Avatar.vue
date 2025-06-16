<script setup lang="ts">
  // Types
  import type { V0AvatarProps } from './types'

  defineOptions({ name: 'V0Avatar' })

  const {
    borderRadius = '50%',
    borderWidth = '0',
    src,
    icon,
    loading,
    text,
    size = '32px',
    ...props
  } = defineProps<V0AvatarProps>()

  const height = toRef(() => props.height ?? size)
  const width = toRef(() => props.width ?? size)
</script>

<template>
  <V0Paper
    v-bind="props"
    :border-radius
    :border-width
    class="v0-avatar"
    :height
    :width
  >
    <V0AvatarRoot class="v0-avatar-root" :size>
      <slot v-if="loading" name="loading" />

      <slot v-else-if="$slots.default" />

      <template v-else-if="src">
        <V0AvatarImage class="v0-avatar-image" :src />

        <V0AvatarFallback class="v0-avatar-fallback">
          <slot name="fallback">{{ text }}</slot>
        </V0AvatarFallback>
      </template>

      <slot v-else-if="icon || $slots.icon" name="icon">
        <V0Icon class="v0-avatar-icon" :icon />
      </slot>

      <template v-else-if="text">
        {{ text }}
      </template>
    </V0AvatarRoot>
  </V0Paper>
</template>

<style lang="scss">
  @use './variables' as *;

  @layer v0-components {
    .v0-avatar {
      align-items: center;
      justify-content: center;
      display: inline-flex;
      overflow: hidden;
      vertical-align: middle;
    }

    .v0-avatar-root {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
