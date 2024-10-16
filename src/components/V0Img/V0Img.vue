<template>
  <img :src="src" :alt="alt" :class="classes" :style="styles" />
</template>

<script setup lang="ts">
import { useDimensions, type DimensionProps } from '@/composables/dimensions'

const props = defineProps<{
  src: string
  alt?: string
  width?: string
  height?: string
} & DimensionProps>()

const { dimensionStyles } = useDimensions(props, 'img')

const classes = {
  'v0-img': true,
}

const styles = {
  ...dimensionStyles.value,
}
</script>

<style lang="scss">
@import './V0Img.scss';
</style>
