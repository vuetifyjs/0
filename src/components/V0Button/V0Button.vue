<template>
  <V0Paper
    v-bind="props"
    :as="as"
    :as-child="asChild"
    :class="classes"
    :style="styles"
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
  </V0Paper>
</template>

<script setup lang="ts">
  // Types
  import type { V0PaperProps } from '@/components/V0Paper'

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
    as = 'button',
    disabledOpacity = '.64',
    gap = '.5em',
    ...props
  } = defineProps<V0ButtonProps>()

  const classes = toRef(() => ({
    'v0-button': true,
    'v0-button--active': props.active,
    'v0-button--disabled': props.disabled,
    'v0-button--hover': props.hover,
    'v0-button--loading': props.loading,
    'v0-button--readonly': props.readonly,
  }))

  const styles = toRef(() => ({
    '--v0-button-disabled-opacity': disabledOpacity,
    '--v0-button-gap': gap,
  }))
</script>

<style lang="scss">
  @use './variables' as *;

  @layer v0-components {
    .v0-button {
      align-items: center;
      cursor: pointer;
      display: inline-flex;
      gap: #{$v0-button-gap};
      justify-content: center;
      outline: none;
      vertical-align: middle;

      &--disabled,
      &--readonly,
      &--loading {
        cursor: default;
      }

      &--disabled {
        opacity: #{$v0-button-disabled-opacity};
      }
    }
  }
</style>
