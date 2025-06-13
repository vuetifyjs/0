<template>
  <V0Paper
    :as="as"
    :as-child="asChild"
    :class="classes"
    :style="styles"
  >
    <slot v-if="$slots.default" />

    <V0Img v-else-if="src" :src="src" />

    <V0Icon v-else-if="icon" :font-size="width" :icon="icon" />
  </V0Paper>
</template>

<script setup lang="ts">
  import type { V0PaperProps } from '@/components/V0Paper'

  export interface V0AvatarProps extends V0PaperProps {
    src?: string
    icon?: string
    text?: string
  }

  defineProps<V0AvatarProps>()

  const classes = toRef(() => ({
    'v0-avatar': true,
  }))

  const styles = toRef(() => {
    //
  })
</script>

<style lang="scss">
  @import './V0Avatar.scss';
</style>
