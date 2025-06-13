<template>
  <V0Atom
    :as="as"
    :as-child="asChild"
    :class="classes"
    :style="styles"
  >
    <V0Avatar
      v-if="avatar || icon"
      :src="avatar"
      :icon="icon"
    />

    <slot v-if="$slots.default" />
  </V0Atom>
</template>

<script lang="ts" setup>
  import type { V0AtomProps } from '@/components/V0Atom'

  export interface V0AffixProps extends V0AtomProps {
    avatar?: string
    icon?: string
    gap?: number | string
    loading?: boolean
    start?: boolean
    end?: boolean
  }

  const props = defineProps<V0AffixProps>()

  const classes = toRef(() => ({
    'v0-affix': true,
    'v0-affix-start': props.start,
    'v0-affix-end': props.end,
  }))

  const styles = toRef(() => ({
    '--v0-affix-gap': props.gap,
  }))
</script>

<style lang="scss">
  @import './V0Affix.scss';
</style>
