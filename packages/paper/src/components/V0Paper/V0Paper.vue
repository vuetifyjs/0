<script lang="ts">
  // Framework
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
  import type { BorderProps } from '#paper/composables/useBorder'
  import type { ColorProps } from '#paper/composables/useColor'
  import type { DimensionProps } from '#paper/composables/useDimensions'
  import type { ElevationProps } from '#paper/composables/useElevation'
  import type { RoundedProps } from '#paper/composables/useRounded'
  import type { SpacingProps } from '#paper/composables/useSpacing'
  import type { AtomProps } from '@vuetify/v0'

  interface V0PaperPropsBase {
    fontSize?: string
    fontWeight?: string
    opacity?: string
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

  const { borderClasses } = useBorder(props)
  const { colorClasses } = useColor(props)
  const { dimensionClasses } = useDimensions(props)
  const { elevationClasses } = useElevation(props)
  const { roundedClasses } = useRounded(props)
  const { spacingClasses } = useSpacing(props)

  const classes = toRef(() => [
    ...borderClasses.value,
    ...colorClasses.value,
    ...dimensionClasses.value,
    ...elevationClasses.value,
    ...roundedClasses.value,
    ...spacingClasses.value,
    props.fontSize && `text-${props.fontSize}`,
    props.fontWeight && `font-${props.fontWeight}`,
    props.opacity && `opacity-${props.opacity}`,
  ].filter(Boolean))
</script>

<template>
  <Atom
    class="v0-paper"
    :class="classes"
  >
    <slot />
  </Atom>
</template>

<style lang="scss">
@use './index.scss';
</style>
