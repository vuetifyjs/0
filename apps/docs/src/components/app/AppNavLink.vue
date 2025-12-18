<script lang="ts" setup>
  // Components
  import { Atom } from '@vuetify/v0'
  import { RouterLink } from 'vue-router'

  // Types
  import type { AtomProps } from '@vuetify/v0'
  import type { RouterLinkProps } from 'vue-router'
  import type { NavItem } from '@/stores/app'

  export interface ComponentProps extends AtomProps, Partial<RouterLinkProps> {
    children?: NavItem[]
  }

  const {
    as = RouterLink,
    activeClass = 'underline text-primary opacity-100!',
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
        :key="'name' in child ? child.name : ''"
        :children="'children' in child ? child.children : undefined"
        class="text-sm"
        :to="'to' in child ? child.to : undefined"
      >
        {{ 'name' in child ? child.name : '' }}
      </AppNavLink>
    </ul>
  </li>
</template>
