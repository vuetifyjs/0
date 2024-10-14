<template>
  <i :class="classes" :style="styles"></i>
</template>

<script setup lang="ts">
  import { useColor } from '@/composables/color'

  const props = defineProps<{
    color?: string
    icon?: string
    fontSize?: string
  }>()

  const color = useColor(props.color)

  const classes = {
    'vl-icon': true,
    [`${props.icon}`]: true,
  }

  const styles = {
    ['--vl-icon-color']: color?.value,
    ['--vl-icon-font-size']: props.fontSize,
  }
</script>

<style lang="scss">
  @import './VlIcon.scss';
</style>
