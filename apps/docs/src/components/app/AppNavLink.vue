<script lang="ts" setup>
  // Components
  import { Atom } from '@vuetify/0'
  import { RouterLink } from 'vue-router'

  // Types
  import type { AtomProps } from '@vuetify/0'
  import type { RouterLinkProps } from 'vue-router'

  export interface NavItem {
    name: string
    to: string
  }

  export interface ComponentProps extends AtomProps, RouterLinkProps {
    children?: (NavItem | { name: string, children: NavItem[] })[]
  }

  const {
    as = RouterLink,
    activeClass = 'underline',
    children = [],
    ...props
  } = defineProps<ComponentProps>()
</script>

<template>
  <li>
    <Atom
      :active-class
      :as
      class="font-semibold"
      v-bind="props"
    >
      <slot />
    </Atom>

    <ul
      v-if="children.length > 0"
      class="ml-4 mt-2 flex flex-col gap-2"
    >
      <AppNavLink
        v-for="child in children"
        :key="child.name"
        :children="(child as any).children"
        class="text-sm opacity-80"
        :to="(child as any).to"
      >
        {{ child.name }}
      </AppNavLink>
    </ul>
  </li>
</template>
