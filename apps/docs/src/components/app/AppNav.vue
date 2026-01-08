<script setup lang="ts">
  // Framework
  import { Atom, useClickOutside, useWindowEventListener } from '@vuetify/v0'

  // Composables
  import { useLevelFilterContext } from '@/composables/useLevelFilter'

  // Utilities
  import { computed, nextTick, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { NavItem, NavItemLink } from '@/stores/app'
  import type { AtomExpose, AtomProps } from '@vuetify/v0'

  // Stores
  import { useAppStore } from '@/stores/app'

  const { as = 'nav' } = defineProps<AtomProps>()

  const app = useAppStore()
  const { filteredNav, selectedLevels } = useLevelFilterContext()
  const route = useRoute()

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

  onMounted(async () => {
    await nextTick()
    const activeLink = navRef.value?.element?.querySelector('[aria-current="page"]')
    activeLink?.scrollIntoView({ block: 'center' })
  })

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
  })
</script>

<template>
  <Atom
    id="main-navigation"
    ref="nav"
    aria-label="Main navigation"
    :as
    class="flex flex-col fixed w-[230px] overflow-y-auto py-4 top-[72px] bottom-[24px] translate-x-[-100%] md:bottom-0 md:translate-x-0 transition-transform duration-200 ease-in-out border-r border-solid border-divider z-10 bg-glass-surface"
    :class="app.drawer && '!translate-x-0'"
    :inert="!app.drawer && isMobile ? true : undefined"
  >
    <ul class="flex gap-2 flex-col">
      <template v-if="filteredOutPage">
        <li class="px-4 text-xs font-medium text-on-surface-variant uppercase tracking-wide">
          Active page
        </li>

        <AppNavLink
          class="px-4"
          :to="filteredOutPage.to"
        >
          {{ filteredOutPage.name }}
        </AppNavLink>

        <li class="px-4">
          <AppDivider />
        </li>
      </template>

      <template v-for="(nav, i) in filteredNav" :key="i">
        <li v-if="nav.divider" class="px-4">
          <AppDivider />
        </li>

        <AppNavLink
          v-else
          :children="nav.children"
          class="px-4"
          :new="nav.new"
          :to="nav.to || ''"
        >
          {{ nav.name }}
        </AppNavLink>
      </template>

      <template v-if="selectedLevels.size > 0">
        <li class="px-4">
          <AppDivider />
        </li>

        <li class="px-4">
          <router-link
            class="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary hover:underline transition-colors"
            to="/guide/using-the-docs#skill-levels-learning-tracks"
          >
            <AppIcon icon="info" size="16" />
            <span>Missing pages?</span>
          </router-link>
        </li>
      </template>
    </ul>
  </Atom>
</template>
