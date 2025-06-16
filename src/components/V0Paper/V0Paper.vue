<script setup lang="ts">
  // Components
  import { V0Atom } from '@/components/V0Atom'

  // Types
  import type { V0PaperProps } from './types'

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
  <V0Atom
    class="v0-paper"
    :style="styles"
  >
    <slot />
  </V0Atom>
</template>

<style lang="scss">
  @import './_variables.scss';

  @layer v0-components {
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
  }
</style>
