<template>
  <v0-paper v-bind="props" :class="classes">
    <img :alt="alt" :src="src">
  </v0-paper>
</template>

<script setup lang="ts">
  import V0Paper, { type V0PaperProps } from '@/components/V0Paper/V0Paper.vue'

  export interface V0ImgProps extends V0PaperProps {
    src?: string
    alt?: string
  }

  const props = defineProps<V0ImgProps>()

  const classes = {
    'v0-img': true,
  }
</script>

<style lang="scss">
@import './V0Img.scss';
</style>
