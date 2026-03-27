<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface CxLinkProps extends AtomProps {
    /** Link destination - internal path or external URL */
    to: string
    /** Hide the external link suffix icon */
    noSuffix?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxLink' })

  const { as: _as, to, noSuffix, ...props } = defineProps<CxLinkProps>()

  const external = toRef(() => to.startsWith('http://') || to.startsWith('https://'))

  const as = toRef(() => external.value ? 'a' : 'a')
  const attrs = toRef(() => external.value
    ? { href: to, target: '_blank', rel: 'noopener noreferrer' }
    : { href: to },
  )

  const suffix = toRef(() => !noSuffix && external.value ? '\u2197' : '')
</script>

<template>
  <Atom
    :as
    class="codex-link"
    v-bind="{ ...attrs, ...props }"
  >
    <slot />
    <span
      v-if="suffix"
      aria-hidden="true"
      class="codex-link__external"
    >{{ suffix }}</span>
  </Atom>
</template>

<style scoped>
  .codex-link__external {
    font-size: 0.75em;
    margin-inline-start: 0.125rem;
  }
</style>
