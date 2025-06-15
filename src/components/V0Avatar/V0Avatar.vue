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
    <V0AvatarRoot :icon :loading :src :text>
      <V0AvatarImage>
        <slot />
      </V0AvatarImage>

      <V0AvatarIcon />

      <V0AvatarLoading>
        <slot name="loading" />
      </V0AvatarLoading>

      <V0AvatarFallback>
        <slot name="fallback" />
      </V0AvatarFallback>
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
  }
</style>
