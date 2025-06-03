<template>
  <v0-paper
    v-bind="props"
    :class="classes"
    :style="styles"
  >
    <slot v-if="$slots.default" />

    <v0-img v-else-if="src" :src="src" />

    <v0-icon v-else-if="icon" :font-size="width" :icon="icon" />
  </v0-paper>
</template>

<script setup lang="ts">
  import V0Paper, { type V0PaperProps } from '@/components/V0Paper/V0Paper.vue'
  import V0Img from '@/components/V0Img/V0Img.vue'
  import V0Icon from '@/components/V0Icon/V0Icon.vue'

  export interface V0AvatarProps extends V0PaperProps {
    src?: string
    icon?: string
  }

  const props = defineProps<V0AvatarProps>()

  const classes = {
    'v0-avatar': true,
  }

  const styles = {}
</script>

<style lang="scss">
@import './V0Avatar.scss';
</style>
