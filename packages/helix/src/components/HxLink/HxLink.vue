<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'
  import { RouterLink } from 'vue-router'

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

  const tag = toRef(() => external.value ? 'a' : RouterLink)
  const attrs = toRef(() => external.value
    ? { href: to, target: '_blank', rel: 'noopener noreferrer' }
    : { to },
  )

  const suffix = toRef(() => !noSuffix && external.value ? '\u2197' : '')
</script>

<template>
  <Atom
    :as="tag"
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
  .helix-link {
    color: var(--v0-primary);
    text-decoration: none;
    transition: opacity 0.15s;
  }

  .helix-link:hover {
    text-decoration: underline;
  }

  .helix-link:visited {
    opacity: 0.85;
  }

  .helix-link__external {
    font-size: 0.75em;
    margin-inline-start: 0.125rem;
    opacity: 0.7;
  }
</style>
