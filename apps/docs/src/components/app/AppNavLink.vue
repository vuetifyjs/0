<script lang="ts" setup>
  // Components
  import { Atom } from '@vuetify/0'
  import { RouterLink } from 'vue-router'

  // Types
  import type { AtomProps } from '@vuetify/0'
  import type { RouterLinkProps } from 'vue-router'

  export interface ComponentProps extends AtomProps, RouterLinkProps {}

  const {
    as = RouterLink,
    activeClass = 'underline',
    ...props
  } = defineProps<ComponentProps>()
</script>

<template>
  <Atom
    :active-class
    :as
    class="font-semibold"
    v-bind="props"
  >
    <slot />
  </Atom>
</template>
