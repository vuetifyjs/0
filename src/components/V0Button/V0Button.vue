<template>
  <v0-paper
    v-bind="props"
    :class="classes"
    :style="styles"
    :tag="tag"
  >
    <div v-if="$slots.prepend" class="prepend">
      <slot name="prepend" />
    </div>

    <slot v-if="$slots.loading && loading" name="loading" />

    <slot v-else-if="$slots.default" />

    <template v-else-if="text">
      {{ text }}
    </template>

    <div v-if="$slots.append" class="append">
      <slot name="append" />
    </div>
  </v0-paper>
</template>

<script setup lang="ts">
  // Components
  import V0Paper from '@/components/V0Paper/V0Paper.vue'

  // Types
  import type { V0PaperProps } from '@/components/V0Paper/V0Paper.vue'

  export interface V0ButtonProps extends V0PaperProps {
    gap?: string
    text?: string

    active?: boolean
    hover?: boolean
    disabled?: boolean
    disabledOpacity?: string | number
    readonly?: boolean
    loading?: boolean
  }

  const {
    tag = 'button',
    disabledOpacity = '.64',
    gap = '.5em',
    ...props
  } = defineProps<V0ButtonProps>()

  const classes = {
    'v0-button': true,
    'v0-button--active': props.active,
    'v0-button--disabled': props.disabled,
    'v0-button--hover': props.hover,
    'v0-button--loading': props.loading,
    'v0-button--readonly': props.readonly,
  }

  const styles = {
    '--v0-button-disabled-opacity': disabledOpacity,
    '--v0-button-gap': gap,
  }
</script>

<style lang="scss">
  @import './V0Button.scss';
</style>
