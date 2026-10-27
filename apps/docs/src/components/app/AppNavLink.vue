<script setup lang="ts">
  // Framework
  import { Atom, useFeatures } from '@vuetify/v0'

  // Composables
  import { scoreToColor } from '@/composables/useFreshness'
  import { useNavConfigContext } from '@/composables/useNavConfig'
  import { isNavItemLink, useNavNestedContext } from '@/composables/useNavNested'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { toRef, useTemplateRef } from 'vue'
  import { RouterLink, useRoute } from 'vue-router'

  // Types
  import type { EmphasisLevel } from '@build/generate-nav'
  import type { AtomProps } from '@vuetify/v0'
  import type { ID } from '@vuetify/v0/types'
  import type { RouterLinkProps } from 'vue-router'

  export interface ComponentProps extends AtomProps, Partial<RouterLinkProps> {
    /** Node ID in the nested structure */
    id: ID
    /** Display name */
    name: string
    /** Whether this is a top-level item (renders differently) */
    depth?: number
    emphasized?: EmphasisLevel
    /** Section label. Sits in the list with the links; it does not open them. */
    subheader?: boolean
    /** Nudge a link in under a sibling subheader. */
    inset?: boolean
  }

  const {
    as = RouterLink,
    activeClass = 'underline text-primary opacity-100!',
    id,
    name,
    depth = 0,
    emphasized,
    to,
    subheader = false,
    inset = false,
    ...props
  } = defineProps<ComponentProps>()

  const route = useRoute()
  const navNested = useNavNestedContext()
  const navConfig = useNavConfigContext()
  const settings = useSettings()
  const devmodeFeature = useFeatures().get('devmode')!

  const showHeatmap = toRef(() => !!emphasized && (emphasized === 1 || devmodeFeature.isSelected.value))
  const heatmapStyle = toRef(() => {
    if (!emphasized || emphasized === 1) return undefined
    const score = (5 - emphasized) * 25
    return { backgroundColor: scoreToColor(score) }
  })

  // Skip animation during state restoration (prevents all sections animating on page load/navigation)
  const expandTransition = toRef(() => {
    if (navNested.isRestoring.value || settings.prefersReducedMotion.value) return undefined
    return 'expand'
  })

  const isExternal = toRef(() => !!to?.startsWith('http'))
  const isActive = toRef(() => !isExternal.value && to && (route.path === to || route.path.startsWith(`${to}/`)))
  // Check children Map directly for reactivity
  const childIds = toRef(() => navNested.nested.children.get(id) ?? [])
  const hasChildren = toRef(() => childIds.value.length > 0)

  // Top-level groups always collapse; nested groups only when the nav item opts in.
  const isTopLevel = toRef(() => depth === 0)
  const navItem = toRef(() => navNested.nested.get(id)?.value)
  const itemCollapsible = toRef(() => {
    const item = navItem.value
    return !!item && 'collapsible' in item && !!item.collapsible
  })
  const isCollapsible = toRef(() => !navConfig.flatMode.value && hasChildren.value && (isTopLevel.value || itemCollapsible.value))
  const isOpen = toRef(() => isCollapsible.value ? navNested.nested.opened(id) : true)
  // Persistent groups keep the section indent. Nested collapsible groups
  // already have a chevron; use a smaller offset so children still line up.
  const childrenIndent = toRef(() => {
    if (itemCollapsible.value) return 'ml-2'
    if (isTopLevel.value && !navConfig.flatMode.value) return 'ms-3'
    return undefined
  })
  const hasSubheader = toRef(() => childIds.value.some(childId => {
    const value = navNested.nested.get(childId)?.value
    return !!value && 'subheader' in value
  }))

  // Check if this node is an ancestor of the current route (for highlighting category headers)
  const containsActivePage = toRef(() => {
    if (to) return false // Links use their own active state
    return navNested.nested.isAncestorOf(id, route.path)
  })

  function getChildProps (childId: ID) {
    const value = navNested.nested.get(childId)?.value
    if (!value) return null

    if ('subheader' in value) {
      return {
        id: childId,
        name: value.subheader,
        subheader: true,
        depth: depth + 1,
      }
    }

    return {
      id: childId,
      name: value.name,
      to: isNavItemLink(value) ? value.to : undefined,
      emphasized: isNavItemLink(value) ? value.emphasized : undefined,
      inset: hasSubheader.value,
      depth: depth + 1,
    }
  }

  // Toggle handler for the chevron button
  function onToggle () {
    if (isCollapsible.value) {
      navNested.nested.flip(id)
    }
  }

  // Open handler for link/header clicks - always opens, never closes
  function onOpen () {
    if (isCollapsible.value && !isOpen.value) {
      navNested.nested.open([id])
    }
  }

  const itemRef = useTemplateRef<HTMLLIElement>('item')

  // Scroll the expanded section into view when it opens
  function onAfterExpand () {
    // Don't scroll during initial state restoration or in flat mode
    if (!navNested.scrollEnabled.value || navConfig.flatMode.value) return

    // When a route change expanded this category, scroll to the destination leaf —
    // the link whose href exactly matches the current path — not the category header.
    // Match by exact attribute, not [aria-current="page"]: ancestor links also carry
    // aria-current (isActive uses startsWith), so a loose match would land on the
    // category's own link. Fall back to the section itself for a manual expand of an
    // unrelated category, where no descendant link matches the route.
    // block: 'nearest' resolves the .nav-scroll container itself and is a no-op when already visible
    const links = itemRef.value ? [...itemRef.value.querySelectorAll<HTMLElement>('a[href]')] : []
    const target = links.find(link => link.getAttribute('href') === route.path) ?? itemRef.value

    target?.scrollIntoView({
      block: 'nearest',
      behavior: settings.prefersReducedMotion.value ? 'instant' : 'smooth',
    })
  }
</script>

<template>
  <li ref="item" class="scroll-my-[100px]" :class="isTopLevel ? 'px-3' : 'ps-3'">
    <div v-if="subheader" class="font-semibold truncate">{{ name }}</div>

    <div
      v-else
      class="flex items-center gap-1"
      :class="[inset && 'pl-3', isTopLevel && navConfig.flatMode.value && 'pl-1', !isTopLevel && isCollapsible && '-ml-2']"
    >
      <!-- Expand/collapse toggle button -->
      <button
        v-if="isCollapsible"
        :aria-controls="`nav-section-${id}`"
        :aria-expanded="isOpen ? 'true' : 'false'"
        class="size-5 media-[(pointer:coarse)]:size-6 flex items-center justify-center shrink-0 rounded hover:bg-surface-tint focus-visible:bg-surface-tint focus-visible:outline-none"
        type="button"
        @click.stop="onToggle"
      >
        <AppChevron :open="isOpen" />

        <span class="sr-only">
          {{ isOpen ? 'Collapse' : 'Expand' }} {{ name }}
        </span>
      </button>

      <!-- Dash prefix for top-level solo links (only when collapsible nav is enabled) -->
      <span v-else-if="isTopLevel && !navConfig.flatMode.value" aria-hidden="true" class="size-5 media-[(pointer:coarse)]:w-6 shrink-0 flex items-center justify-center text-divider">–</span>

      <!-- External link -->
      <Atom
        v-if="to && isExternal"
        as="a"
        class="font-semibold icon-text flex-1 min-w-0"
        :class="[
          'hover:underline hover:text-primary focus-visible:underline focus-visible:text-primary',
          !isTopLevel && !hasChildren && 'opacity-70 hover:opacity-100 focus-visible:opacity-100',
        ]"
        :href="to"
        rel="noopener"
        target="_blank"
      >
        <span class="truncate">{{ name }}</span>
      </Atom>

      <!-- Internal link (navigable) -->
      <Atom
        v-else-if="to"
        :aria-current="isActive ? 'page' : undefined"
        :as
        class="font-semibold icon-text flex-1 min-w-0 scroll-my-[100px]"
        :class="[
          'hover:underline hover:text-primary focus-visible:underline focus-visible:text-primary',
          !isTopLevel && !hasChildren && 'opacity-70 hover:opacity-100 focus-visible:opacity-100',
          isActive && activeClass,
        ]"
        :to
        v-bind="props"
        @click="onOpen"
      >
        <span class="truncate">{{ name }}</span>

        <span
          v-if="showHeatmap"
          class="w-2 h-2 rounded-[2px] shrink-0"
          :class="{ 'bg-success': emphasized === 1 }"
          :style="heatmapStyle"
        />
      </Atom>

      <!-- Category header (not navigable) -->
      <span
        v-else
        class="font-semibold flex-1 min-w-0 truncate"
        :class="[
          isCollapsible && 'cursor-pointer hover:text-primary focus-visible:text-primary',
          containsActivePage && 'text-primary underline',
        ]"
        :role="isCollapsible ? 'button' : undefined"
        :tabindex="isCollapsible ? 0 : undefined"
        @click="onOpen"
        @keydown.enter="onOpen"
        @keydown.space.prevent="onOpen"
      >
        {{ name }}
      </span>
    </div>

    <!-- Children (conditional when collapsible, always visible otherwise) -->
    <Transition :name="expandTransition" @after-enter="onAfterExpand">
      <div v-if="hasChildren && isOpen" class="grid mt-1 md:mt-2" :class="childrenIndent">
        <ul
          :id="`nav-section-${id}`"
          class="flex flex-col gap-1 md:gap-2 overflow-hidden"
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
