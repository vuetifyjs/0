<script setup lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Composables
  import { useNavConfigContext } from '@/composables/useNavConfig'
  import { isNavItemLink, useNavNestedContext } from '@/composables/useNavNested'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, toRef, useTemplateRef } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'

  // Types
  import type { AtomProps, ID } from '@vuetify/v0'
  import type { RouterLinkProps } from 'vue-router'

  export interface ComponentProps extends AtomProps, Partial<RouterLinkProps> {
    /** Node ID in the nested structure */
    id: ID
    /** Display name */
    name: string
    /** Whether this is a top-level item (renders differently) */
    depth?: number
    emphasized?: boolean
  }

  const {
    as = RouterLink,
    activeClass = 'underline text-primary opacity-100!',
    id,
    name,
    depth = 0,
    emphasized,
    to,
    ...props
  } = defineProps<ComponentProps>()

  const route = useRoute()
  const { nested, isRestoring, scrollEnabled } = useNavNestedContext()
  const { flatMode } = useNavConfigContext()
  const { prefersReducedMotion } = useSettings()

  // Skip animation during state restoration (prevents all sections animating on page load/navigation)
  const expandTransition = toRef(() => {
    if (isRestoring.value || prefersReducedMotion.value) return undefined
    return 'expand'
  })

  const isActive = computed(() => to && route.path === to)
  // Check children Map directly for reactivity
  const childIds = computed(() => nested.children.get(id) ?? [])
  const hasChildren = computed(() => childIds.value.length > 0)

  // Only top-level items can be collapsed (disabled in flat mode)
  const isTopLevel = computed(() => depth === 0)
  const isCollapsible = computed(() => !flatMode.value && isTopLevel.value && hasChildren.value)
  const isOpen = computed(() => isCollapsible.value ? nested.opened(id) : true)

  // Check if this node is an ancestor of the current route (for highlighting category headers)
  const containsActivePage = computed(() => {
    if (to) return false // Links use their own active state
    return nested.isAncestorOf(id, route.path)
  })

  function getChildProps (childId: ID) {
    const value = nested.get(childId)?.value
    if (!value) return null

    return {
      id: childId,
      name: value.name,
      to: isNavItemLink(value) ? value.to : undefined,
      emphasized: isNavItemLink(value) ? value.emphasized : undefined,
      depth: depth + 1,
    }
  }

  // Toggle handler for the chevron button
  function onToggle () {
    if (isCollapsible.value) {
      nested.flip(id)
    }
  }

  // Open handler for link/header clicks - always opens, never closes
  function onOpen () {
    if (isCollapsible.value && !isOpen.value) {
      nested.open([id])
    }
  }

  const itemRef = useTemplateRef<HTMLLIElement>('item')

  // Scroll expanded section into view if header is near bottom of visible area
  function onAfterExpand () {
    // Don't scroll during initial state restoration or in flat mode
    if (!scrollEnabled.value || flatMode.value) return

    const el = itemRef.value
    if (!el) return

    // Find the scroll container (AppNav)
    const scrollContainer = el.closest('[id="main-navigation"]')
    if (!scrollContainer) return

    const containerRect = scrollContainer.getBoundingClientRect()
    const itemRect = el.getBoundingClientRect()

    // If the section header is in the bottom third, scroll it up a bit
    const bottomThird = containerRect.top + (containerRect.height * 2 / 3)
    if (itemRect.top > bottomThird) {
      const scrollAmount = itemRect.top - containerRect.top - 100 // Position 100px from top
      scrollContainer.scrollBy({
        top: scrollAmount,
        behavior: prefersReducedMotion.value ? 'instant' : 'smooth',
      })
    }
  }
</script>

<template>
  <li ref="item" class="px-3">
    <div class="flex items-center gap-1">
      <!-- Expand/collapse toggle button (only for top-level) -->
      <button
        v-if="isCollapsible"
        :aria-controls="`nav-section-${id}`"
        :aria-expanded="isOpen ? 'true' : 'false'"
        class="size-5 flex items-center justify-center shrink-0 rounded hover:bg-surface-tint focus-visible:bg-surface-tint focus-visible:outline-none"
        type="button"
        @click.stop="onToggle"
      >
        <AppIcon
          aria-hidden="true"
          :icon="isOpen ? 'chevron-down' : 'chevron-right'"
          size="14"
        />
        <span class="sr-only">
          {{ isOpen ? 'Collapse' : 'Expand' }} {{ name }}
        </span>
      </button>

      <!-- Dash prefix for top-level solo links (only when collapsible nav is enabled) -->
      <span v-else-if="isTopLevel && !flatMode" aria-hidden="true" class="size-5 shrink-0 flex items-center justify-center text-divider">–</span>

      <!-- Link (navigable) -->
      <Atom
        v-if="to"
        :active-class
        :aria-current="isActive ? 'page' : undefined"
        :as
        class="font-semibold inline-flex items-center gap-1 flex-1 min-w-0"
        :class="[
          'hover:underline hover:text-primary focus-visible:underline focus-visible:text-primary',
          !hasChildren && 'opacity-70 hover:opacity-100 focus-visible:opacity-100',
        ]"
        :to
        v-bind="props"
        @click="onOpen"
      >
        <span class="truncate">{{ name }}</span>
        <span v-if="emphasized" class="w-2 h-2 rounded-[2px] bg-success shrink-0" />
      </Atom>

      <!-- Category header (not navigable) -->
      <div
        v-else
        class="font-semibold flex-1 min-w-0 truncate"
        :class="[
          isCollapsible && 'cursor-pointer hover:text-primary',
          containsActivePage && 'text-primary underline',
        ]"
        @click="onOpen"
      >
        {{ name }}
      </div>
    </div>

    <!-- Children (always visible for nested items, conditional for top-level) -->
    <Transition :name="expandTransition" @after-enter="onAfterExpand">
      <div v-if="hasChildren && isOpen" class="grid mt-2" :class="isTopLevel && !flatMode && 'ml-6'">
        <ul
          :id="`nav-section-${id}`"
          class="flex flex-col gap-2 overflow-hidden"
        >
          <template v-for="childId in childIds" :key="childId">
            <AppNavLink
              v-if="getChildProps(childId)"
              class="text-sm"
              v-bind="getChildProps(childId)!"
            />
          </template>
        </ul>
      </div>
    </Transition>
  </li>
</template>

<style scoped>
  /* Expand: ease-out (content settles in) */
  .expand-enter-active {
    grid-template-rows: 1fr;
    transition: grid-template-rows 200ms cubic-bezier(0.33, 1, 0.68, 1);
  }

  /* Collapse: ease-in (snaps shut) */
  .expand-leave-active {
    grid-template-rows: 1fr;
    transition: grid-template-rows 150ms cubic-bezier(0.32, 0, 0.67, 0);
  }

  .expand-enter-from,
  .expand-leave-to {
    grid-template-rows: 0fr;
  }
</style>
