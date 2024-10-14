<template>
  <v0-paper
    :class="classes"
    :tag="tag"
    :padding="padding"
    :border-radius="borderRadius"
    :border-color="borderColor"
    :border-style="borderStyle"
    :border-width="borderWidth"
    :font-size="fontSize"
    :font-weight="fontWeight"
    :bg-color="bgColor"
    :color="color"
    :style="styles"
  >
    <div v-if="$slots.prepend" class="prepend">
      <slot name="prepend" />
    </div>

    <slot v-if="$slots.loading && loading" name="loading"></slot>

    <slot v-else-if="$slots.default"></slot>

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

  const { tag = 'button', ...props } = defineProps<{
    gap?: string
    text?: string

    active?: boolean
    hover?: boolean
    disabled?: boolean
    readonly?: boolean
    loading?: boolean
  } & V0PaperProps>()

  const classes = {
    'v0-button': true,
    'v0-button--active': props.active,
    'v0-button--hover': props.hover,
    'v0-button--disabled': props.disabled,
    'v0-button--readonly': props.readonly,
    'v0-button--loading': props.loading,
  }

  const styles = {
    '--v0-button-gap': props.gap,
  }
</script>

<style lang="scss">
  @import './V0Button.scss';
</style>
