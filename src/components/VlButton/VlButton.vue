<template>
  <vl-paper
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
  </vl-paper>
</template>

<script setup lang="ts">
  // Components
  import VlPaper from '@/components/VlPaper/VlPaper.vue'

  // Types
  import type { VlPaperProps } from '@/components/VlPaper/VlPaper.vue'

  const { tag = 'button', ...props } = defineProps<{
    gap?: string
    text?: string

    active?: boolean
    hover?: boolean
    disabled?: boolean
    readonly?: boolean
    loading?: boolean
  } & VlPaperProps>()

  const classes = {
    'vl-button': true,
    'vl-button--active': props.active,
    'vl-button--hover': props.hover,
    'vl-button--disabled': props.disabled,
    'vl-button--readonly': props.readonly,
    'vl-button--loading': props.loading,
  }

  const styles = {
    '--vl-button-gap': props.gap,
  }
</script>

<style lang="scss">
  @import './VlButton.scss';
</style>
