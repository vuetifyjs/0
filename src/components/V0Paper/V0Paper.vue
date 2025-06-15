<script setup lang="ts">
  // Components
  import { V0Atom } from '@/components/V0Atom'

  // Types
  import type { V0PaperProps } from './types'

  defineOptions({ name: 'V0Paper' })

  const props = defineProps<V0PaperProps>()

  const bgColor = useColor(props.bgColor)
  const color = useColor(props.color ?? bgColor?.value, !props.color)

  const { borderStyles } = useBorder(props)
  const { dimensionStyles } = useDimensions(props)
  const { elevationStyles } = useElevation(props)
  const { roundedStyles } = useRounded(props)

  const classes = toRef(() => ({
    'v0-paper-root': true,
  }))

  const styles = toRef(() => ({
    ['--v0-paper-bg-color']: bgColor?.value,
    ['--v0-paper-color']: color?.value,
    ['--v0-paper-font-size']: props.fontSize,
    ['--v0-paper-font-weight']: props.fontWeight,
    ['--v0-paper-padding']: props.padding,
    ['--v0-paper-opacity']: props.opacity,
    ['--v0-paper-margin']: props.margin,

    ...borderStyles.value,
    ...dimensionStyles.value,
    ...elevationStyles.value,
    ...roundedStyles.value,
  }))
</script>

<template>
  <V0Atom
    :as="as"
    :as-child="asChild"
    :class="classes"
    :style="styles"
  >
    <slot />
  </V0Atom>
</template>

<style lang="scss">
  @import './_variables.scss';

  @layer v0-components {
    .v0-paper-root {
      background-color: #{$paper-bg-color};
      background-image: #{$paper-gradient};
      border-color: #{$paper-border-color};
      border-radius: #{$paper-border-radius};
      border-style: #{$paper-border-style};
      border-width: #{$paper-border-width};
      box-shadow: #{$paper-elevation};
      color: #{$paper-color};
      font-size: #{$paper-font-size};
      font-weight: #{$paper-font-weight};
      height: #{$paper-height};
      margin: #{$paper-margin};
      max-height: #{$paper-max-height};
      max-width: #{$paper-max-width};
      min-height: #{$paper-min-height};
      min-width: #{$paper-min-width};
      opacity: #{$paper-opacity};
      padding: #{$paper-padding};
      width: #{$paper-width};
    }
  }
</style>
