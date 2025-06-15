<script setup lang="ts">
  // Components
  import { V0Atom } from '@/components/V0Atom'

  // Types
  import type { V0ImgProps } from './types'

  const {
    as = 'img',
    ...props
  } = defineProps<V0ImgProps>()

  const { dimensionStyles } = useDimensions(props)

  const classes = toRef(() => ({
    'v0-img': true,
  }))

  const styles = toRef(() => ({
    ...dimensionStyles.value,
  }))
</script>

<template>
  <V0Atom
    :alt="alt"
    :as="as"
    :class="classes"
    :src="src"
    :style="styles"
  />
</template>

<style lang="scss">
  @layer v0-components {
    .v0-img {
      border-radius: inherit;
      display: inline-block;
      overflow: hidden;
      height: var(--v0-img-height);
      width: var(--v0-img-width);
    }
  }
</style>
