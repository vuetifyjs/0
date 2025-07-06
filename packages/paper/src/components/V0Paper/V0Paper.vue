<script lang="ts">
  // Components
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'
  import { useBorder, type BorderProps } from '#paper/composables/useBorder'
  import { useColor, type ColorProps } from '#paper/composables/useColor'
  import { useDimensions, type DimensionProps } from '#paper/composables/useDimensions'
  import { useElevation, type ElevationProps } from '#paper/composables/useElevation'
  import { useRounded, type RoundedProps } from '#paper/composables/useRounded'
  import { useSpacing } from '#paper/composables/useSpacing'
  import { toRef } from 'vue'

  interface V0PaperPropsBase {
    fontSize?: string
    fontWeight?: string | number
    margin?: string
    opacity?: string | number
    padding?: string
  }

  export interface V0PaperProps extends
    AtomProps,
    V0PaperPropsBase,
    DimensionProps,
    ColorProps,
    BorderProps,
    ElevationProps,
    RoundedProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'V0Paper' })

  const props = defineProps<V0PaperProps>()

  const { borderStyles } = useBorder(props)
  const { colorStyles } = useColor(props)
  const { dimensionStyles } = useDimensions(props)
  const { elevationStyles } = useElevation(props)
  const { roundedStyles } = useRounded(props)
  const { spacingStyles } = useSpacing(props)

  const styles = toRef(() => ({
    ['--v0-paper-font-size']: props.fontSize,
    ['--v0-paper-font-weight']: props.fontWeight,
    ['--v0-paper-opacity']: props.opacity,

    ...borderStyles.value,
    ...colorStyles.value,
    ...dimensionStyles.value,
    ...elevationStyles.value,
    ...roundedStyles.value,
    ...spacingStyles.value,
  }))
</script>

<template>
  <Atom
    class="v0-paper"
    :style="styles"
  >
    <slot />
  </Atom>
</template>

<style lang="scss">
  $v0-paper-bg-color: var(--v0-paper-bg-color, transparent) !default;
  $v0-paper-border-color: var(--v0-paper-border-color, transparent) !default;
  $v0-paper-border-radius: var(--v0-paper-border-radius, 0) !default;
  $v0-paper-border-style: var(--v0-paper-border-style, solid) !default;
  $v0-paper-border-width: var(--v0-paper-border-width, 1) !default;
  $v0-paper-color: var(--v0-paper-color, inherit) !default;
  $v0-paper-elevation: var(--v0-paper-elevation) !default;
  $v0-paper-font-size: var(--v0-paper-font-size, inherit) !default;
  $v0-paper-font-weight: var(--v0-paper-font-weight, inherit) !default;
  $v0-paper-gradient: var(--v0-paper-gradient) !default;
  $v0-paper-height: var(--v0-paper-height, auto) !default;
  $v0-paper-margin: var(--v0-paper-margin, 0) !default;
  $v0-paper-max-height: var(--v0-paper-max-height, auto) !default;
  $v0-paper-max-width: var(--v0-paper-max-width, auto) !default;
  $v0-paper-min-height: var(--v0-paper-min-height, auto) !default;
  $v0-paper-min-width: var(--v0-paper-min-width, auto) !default;
  $v0-paper-opacity: var(--v0-paper-opacity, 1) !default;
  $v0-paper-padding: var(--v0-paper-padding, 0) !default;
  $v0-paper-width: var(--v0-paper-width, auto) !default;

  .v0-paper {
    background-color: #{$v0-paper-bg-color};
    background-image: #{$v0-paper-gradient};
    border-color: #{$v0-paper-border-color};
    border-radius: #{$v0-paper-border-radius};
    border-style: #{$v0-paper-border-style};
    border-width: #{$v0-paper-border-width};
    box-shadow: #{$v0-paper-elevation};
    color: #{$v0-paper-color};
    font-size: #{$v0-paper-font-size};
    font-weight: #{$v0-paper-font-weight};
    height: #{$v0-paper-height};
    margin: #{$v0-paper-margin};
    max-height: #{$v0-paper-max-height};
    max-width: #{$v0-paper-max-width};
    min-height: #{$v0-paper-min-height};
    min-width: #{$v0-paper-min-width};
    opacity: #{$v0-paper-opacity};
    padding: #{$v0-paper-padding};
    width: #{$v0-paper-width};
  }
</style>
