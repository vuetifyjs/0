<script lang="ts" setup>
  // Components
  import { Atom } from '@vuetify/v0'
  import { RouterLink } from 'vue-router'

  // Types
  import type { AtomProps } from '@vuetify/v0'
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
      v-if="to"
      :active-class
      :as
      class="font-semibold"
      :class="[
        to ? 'hover:underline' : '',
        to && children.length === 0 ? 'opacity-70 hover:opacity-100' : '',
      ]"
      v-bind="props"
    >
      <slot />
    </Atom>

    <div v-else class="font-semibold">
      <slot />
    </div>

    <ul
      v-if="children.length > 0"
      class="ml-4 mt-2 flex flex-col gap-2"
    >
      <AppNavLink
        v-for="child in children"
        :key="child.name"
        :children="(child as any).children"
        class="text-sm"
        :to="(child as any).to"
      >
        {{ child.name }}
      </AppNavLink>
    </ul>
  </li>
</template>
