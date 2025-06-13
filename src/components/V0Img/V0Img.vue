<template>
  <V0Paper
    :as="as"
    :as-child="asChild"
    :class="classes"
    :style="styles"
  >
    <img :alt="alt" :src="src">
  </V0Paper>
</template>

<script setup lang="ts">
  import type { V0PaperProps } from '@/components/V0Paper'

  export interface V0ImgProps extends V0PaperProps {
    src?: string
    alt?: string
  }

  defineProps<V0ImgProps>()

  const classes = toRef(() => ({
    'v0-img': true,
  }))

  const styles = toRef(() => ({
    //
  }))
</script>

<style lang="scss">
@import './V0Img.scss';
</style>
