<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'
  import { RouterLink } from 'vue-router'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  // Constants
  import { EXTERNAL_LINK_SUFFIX } from '@/constants/links'

  export interface AppLinkProps extends AtomProps {
    /** Link destination - internal path or external URL */
    to: string
  }

  const { as: _as, to, ...props } = defineProps<AppLinkProps>()

  const isExternal = toRef(() => to.startsWith('http://') || to.startsWith('https://'))

  const as = toRef(() => isExternal.value ? 'a' : RouterLink)
  const linkProps = toRef(() => isExternal.value
    ? { href: to, target: '_blank', rel: 'noopener noreferrer' }
    : { to },
  )

  const suffix = toRef(() => isExternal.value ? EXTERNAL_LINK_SUFFIX : '')
</script>

<template>
  <Atom
    :as
    class="v0-link"
    v-bind="{ ...linkProps, ...props }"
  >
    <slot />
    <span v-if="suffix" aria-hidden="true" class="text-xs opacity-70 ml-0.5">{{ suffix }}</span>
  </Atom>
</template>
