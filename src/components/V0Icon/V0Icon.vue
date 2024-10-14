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
    'v0-icon': true,
    [`${props.icon}`]: true,
  }

  const styles = {
    ['--v0-icon-color']: color?.value,
    ['--v0-icon-font-size']: props.fontSize,
  }
</script>

<style lang="scss">
  @import './V0Icon.scss';
</style>
