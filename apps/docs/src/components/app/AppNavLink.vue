<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Utilities
  import { computed } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'

  // Types
  import type { NavItem } from '@/stores/app'
  import type { AtomProps } from '@vuetify/v0'
  import type { RouterLinkProps } from 'vue-router'

  export interface ComponentProps extends AtomProps, Partial<RouterLinkProps> {
    emphasized?: boolean
    children?: NavItem[]
  }

  const {
    as = RouterLink,
    activeClass = 'underline text-primary opacity-100!',
    emphasized,
    children = [],
    to,
    ...props
  } = defineProps<ComponentProps>()

  const route = useRoute()
  const isActive = computed(() => to && route.path === to)
</script>

<template>
  <li>
    <Atom
      v-if="to"
      :active-class
      :aria-current="isActive ? 'page' : undefined"
      :as
      class="font-semibold inline-flex items-center gap-1"
      :class="[
        to ? 'hover:underline hover:text-primary' : '',
        to && children.length === 0 ? 'opacity-70 hover:opacity-100' : '',
      ]"
      :to
      v-bind="props"
    >
      <slot />
      <span v-if="emphasized" class="w-2 h-2 rounded-[2px] bg-success" />
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
        :emphasized="'emphasized' in child ? child.emphasized : undefined"
        :to="'to' in child ? child.to : undefined"
      >
        {{ 'name' in child ? child.name : '' }}
      </AppNavLink>
    </ul>
  </li>
</template>
