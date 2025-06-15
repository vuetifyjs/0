<script setup lang="ts">
  // Types
  import type { V0AvatarProps } from './types'

  defineOptions({ name: 'V0Avatar' })

  const {
    borderRadius = '50%',
    src,
    icon,
    loading,
    text,
    ...props
  } = defineProps<V0AvatarProps>()

  const height = toRef(() => props.height ?? props.size)
  const width = toRef(() => props.width ?? props.size)
</script>

<template>
  <V0Paper
    v-bind="props"
    :border-radius
    class="v0-avatar"
    :height
    :width
  >
    <V0AvatarRoot :icon :loading :src :text>
      <V0AvatarContent>
        <slot />
      </V0AvatarContent>

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
      border-radius: #{$v0-avatar-border-radius};
      display: inline-flex;
      overflow: hidden;
      vertical-align: middle;
    }
  }
</style>
