<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Utilities
  import { computed } from 'vue'
  import { RouterLink } from 'vue-router'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface AppLinkProps extends /* @vue-ignore */ AtomProps {
    /** Link destination - internal path or external URL */
    to: string
  }

  const { to, ...props } = defineProps<AppLinkProps>()

  const isExternal = computed(() => to.startsWith('http://') || to.startsWith('https://'))
  const isAnchor = computed(() => to.startsWith('#'))

  const linkComponent = computed(() => isExternal.value ? 'a' : RouterLink)
  const linkProps = computed(() => {
    if (isExternal.value) {
      return {
        href: to,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    }
    return { to }
  })

  const suffix = computed(() => {
    if (isExternal.value) return '↗'
    if (isAnchor.value) return ''
    return '→'
  })

  const prefix = computed(() => {
    if (isAnchor.value) return '#'
    return ''
  })
</script>

<template>
  <Atom
    :as="linkComponent"
    class="v0-link"
    v-bind="{ ...linkProps, ...props }"
  ><span v-if="prefix" aria-hidden="true" class="opacity-50">{{ prefix }}</span><slot /><!--
 --><span v-if="suffix" aria-hidden="true" class="text-xs opacity-70 ml-0.5">{{ suffix }}</span></Atom>
</template>
