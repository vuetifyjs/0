<script lang="ts">
  // Components
  import { Atom } from '@vuetify/v0'

  // Composables
  import { useBorder } from '#paper/composables/useBorder'
  import { useColor } from '#paper/composables/useColor'
  import { useDimensions } from '#paper/composables/useDimensions'
  import { useElevation } from '#paper/composables/useElevation'
  import { useRounded } from '#paper/composables/useRounded'
  import { useSpacing } from '#paper/composables/useSpacing'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '@vuetify/v0'
  import type { BorderProps } from '#paper/composables/useBorder'
  import type { ColorProps } from '#paper/composables/useColor'
  import type { DimensionProps } from '#paper/composables/useDimensions'
  import type { ElevationProps } from '#paper/composables/useElevation'
  import type { RoundedProps } from '#paper/composables/useRounded'
  import type { SpacingProps } from '#paper/composables/useSpacing'

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
    RoundedProps,
    SpacingProps {}
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
@use './index.scss';
</style>
