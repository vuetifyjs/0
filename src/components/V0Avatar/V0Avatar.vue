<template>
  <V0Paper
    :class="classes"
    :style="styles"
    v-bind="props"
  >
    <slot v-if="$slots.default" />

    <V0Img
      v-else-if="src"
      :src="src"
    />

    <V0Icon
      v-else-if="icon"
      :font-size="width"
      :icon="icon"
    />
  </V0Paper>
</template>

<script setup lang="ts">
  import type { V0PaperProps } from '@/components/V0Paper'

  export interface V0AvatarProps extends V0PaperProps {
    src?: string
    icon?: string
    text?: string
  }

  defineOptions({ name: 'V0Avatar' })

  const {
    src,
    icon,
    text,
    ...props
  } = defineProps<V0AvatarProps>()

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
