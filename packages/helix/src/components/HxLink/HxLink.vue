<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface HxLinkProps extends AtomProps {
    /** Link destination - internal path or external URL */
    to: string
    /** Hide the external link suffix icon */
    noSuffix?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxLink' })

  const { as: _as, to, noSuffix, ...props } = defineProps<HxLinkProps>()

  const external = toRef(() => to.startsWith('http://') || to.startsWith('https://'))

  const attrs = toRef(() => external.value
    ? { href: to, target: '_blank', rel: 'noopener noreferrer' }
    : { href: to },
  )

  const suffix = toRef(() => !noSuffix && external.value ? '\u2197' : '')
</script>

<template>
  <Atom
    as="a"
    class="helix-link"
    v-bind="{ ...attrs, ...props }"
  >
    <slot />
    <span
      v-if="suffix"
      aria-hidden="true"
      class="helix-link__external"
    >{{ suffix }}</span>
  </Atom>
</template>

<style scoped>
  .helix-link__external {
    font-size: 0.75em;
    margin-inline-start: 0.125rem;
  }
</style>
