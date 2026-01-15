<script setup lang="ts">
  // Framework
  import { Atom, useClickOutside, useHydration, useWindowEventListener } from '@vuetify/v0'

  // Composables
  import { useLevelFilterContext } from '@/composables/useLevelFilter'
  import { useNavConfigContext } from '@/composables/useNavConfig'
  import { createNavNested } from '@/composables/useNavNested'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { NavItem, NavItemLink } from '@/stores/app'
  import type { AtomExpose, AtomProps } from '@vuetify/v0'

  // Stores
  import { useAppStore } from '@/stores/app'

  const { as = 'nav' } = defineProps<AtomProps>()

  const { prefersReducedMotion } = useSettings()
  const { isSettled } = useHydration()

  const app = useAppStore()
  const { filteredNav, selectedLevels } = useLevelFilterContext()
  const { configuredNav, activeFeatures, clearFilter } = useNavConfigContext()
  const route = useRoute()

  // Provide nested nav context for collapsible sections
  const { provide: provideNavNested } = createNavNested(configuredNav)
  provideNavNested()

  // Find a page by path in nav tree
  function findPage (items: NavItem[], path: string): NavItemLink | null {
    for (const item of items) {
      if ('to' in item && item.to === path) return item
      if ('children' in item && item.children) {
        const found = findPage(item.children, path)
        if (found) return found
      }
    }
    return null
  }

  // Check if page exists in nav tree
  function hasPage (items: NavItem[], path: string): boolean {
    return findPage(items, path) !== null
  }

  // Current page info when it's filtered out
  const filteredOutPage = computed(() => {
    if (selectedLevels.size === 0) return null
    const path = route.path
    if (hasPage(filteredNav.value, path)) return null
    return findPage(app.nav, path)
  })
  const navRef = useTemplateRef<AtomExpose>('nav')

  // Match Tailwind's md breakpoint (768px) for nav visibility
  const isMobile = shallowRef(true)

  function updateMobile () {
    isMobile.value = window.innerWidth < 768
  }

  onMounted(updateMobile)
  useWindowEventListener('resize', updateMobile, { passive: true })

  // Scroll active link into view after hydration settles
  watch(isSettled, settled => {
    if (!settled) return
    // Wait for sections to fully expand before scrolling
    // 300ms accounts for expand animation (200ms) + buffer
    setTimeout(() => {
      const nav = document.querySelector('#main-navigation')
      const activeLink = nav?.querySelector<HTMLElement>('[aria-current="page"]')
      if (activeLink && nav) {
        const navRect = nav.getBoundingClientRect()
        const linkRect = activeLink.getBoundingClientRect()
        // Only scroll if link is outside visible area
        if (linkRect.top < navRect.top || linkRect.bottom > navRect.bottom) {
          const linkRelativeTop = linkRect.top - navRect.top + nav.scrollTop
          nav.scrollTop = Math.max(0, linkRelativeTop - 100) // 100px from top, not centered
        }
      }
    }, 300)
  }, { immediate: true })

  useClickOutside(
    () => navRef.value?.element,
    () => {
      if (app.drawer && isMobile.value) {
        app.drawer = false
      }
    },
    { ignore: ['[data-app-bar]'] },
  )

  watch(route, () => {
    if (app.drawer && isMobile.value) {
      app.drawer = false
    }
  }, { immediate: true })
</script>

<template>
  <Atom
    id="main-navigation"
    ref="nav"
    aria-label="Main navigation"
    :as
    class="flex flex-col fixed w-[230px] overflow-y-auto py-4 top-[72px] bottom-0 translate-x-[-100%] md:bottom-0 md:translate-x-0 border-r border-solid border-divider z-10 bg-glass-surface"
    :class="[
      app.drawer && '!translate-x-0',
      !prefersReducedMotion && 'transition-transform duration-200 ease-in-out',
    ]"
    :inert="!app.drawer && isMobile ? true : undefined"
  >
    <!-- URL filter banner -->
    <div v-if="activeFeatures" class="-mt-4 px-4 py-3 mb-2 bg-surface-variant/50 border-b border-divider">
      <p class="text-xs text-on-surface-variant mb-2">
        Showing docs for your project
      </p>
      <button
        class="text-xs text-primary hover:underline"
        type="button"
        @click="clearFilter"
      >
        Show all docs
      </button>
    </div>

    <ul class="flex gap-2 flex-col">
      <template v-if="filteredOutPage">
        <li class="px-4 text-xs font-medium text-on-surface-variant uppercase tracking-wide">
          Active page
        </li>

        <li class="px-4">
          <router-link
            aria-current="page"
            class="font-semibold text-primary underline"
            :to="filteredOutPage.to"
          >
            {{ filteredOutPage.name }}
          </router-link>
        </li>

        <li class="px-4">
          <AppDivider />
        </li>
      </template>

      <template v-for="(nav, i) in configuredNav" :key="i">
        <li v-if="'divider' in nav" class="px-4">
          <AppDivider />
        </li>

        <AppNavLink
          v-else-if="'to' in nav"
          :id="nav.to"
          class="px-4"
          :emphasized="nav.emphasized"
          :name="nav.name"
          :to="nav.to"
        />

        <AppNavLink
          v-else
          :id="`category-root-${i}`"
          class="px-4"
          :name="nav.name"
        />
      </template>

      <template v-if="selectedLevels.size > 0">
        <li class="px-4">
          <AppDivider />
        </li>

        <li class="px-4">
          <router-link
            class="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary hover:underline transition-colors"
            to="/guide/using-the-docs#skill-levels"
          >
            <AppIcon icon="info" size="16" />
            <span>Missing pages?</span>
          </router-link>
        </li>
      </template>
    </ul>
  </Atom>
</template>
