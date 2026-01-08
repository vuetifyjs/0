<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'
  import { RouterLink } from 'vue-router'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface AppLinkProps extends AtomProps {
    /** Link destination - internal path or external URL */
    to: string
  }

  const { as: _as, to, ...props } = defineProps<AppLinkProps>()

  const isExternal = toRef(() => to.startsWith('http://') || to.startsWith('https://'))
  const isAnchor = toRef(() => to.startsWith('#'))

  const as = toRef(() => isExternal.value ? 'a' : RouterLink)
  const linkProps = toRef(() => isExternal.value
    ? { href: to, target: '_blank', rel: 'noopener noreferrer' }
    : { to },
  )

  const suffix = toRef(() => {
    if (isExternal.value) return '↗'
    if (isAnchor.value) return ''
    return '→'
  })

  const prefix = toRef(() => isAnchor.value ? '#' : '')
</script>

<template>
  <Atom
    :as
    class="v0-link"
    v-bind="{ ...linkProps, ...props }"
  >
    <span v-if="prefix" aria-hidden="true" class="opacity-50">{{ prefix }}</span>
    <slot />
    <span v-if="suffix" aria-hidden="true" class="text-xs opacity-70 ml-0.5">{{ suffix }}</span>
  </Atom>
</template>
