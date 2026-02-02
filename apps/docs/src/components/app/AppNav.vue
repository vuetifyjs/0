<script setup lang="ts">
  // Framework
  import { IN_BROWSER, useClickOutside, useFeatures, useWindowEventListener } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'

  // Composables
  import { useLevelFilterContext } from '@/composables/useLevelFilter'
  import { useNavConfigContext } from '@/composables/useNavConfig'
  import { useNavigation } from '@/composables/useNavigation'
  import { createNavNested } from '@/composables/useNavNested'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { NavItem, NavItemLink } from '@/stores/app'

  // Stores
  import { useAppStore } from '@/stores/app'

  const settings = useSettings()
  const devmode = useFeatures().get('devmode')!

  const app = useAppStore()
  const navigation = useNavigation()
  const levelFilter = useLevelFilterContext()
  const navConfig = useNavConfigContext()
  const route = useRoute()

  // Filter out devmode items when devmode setting is disabled
  function filterDevmode (items: NavItem[]): NavItem[] {
    return items
      .filter(item => !('devmode' in item && item.devmode))
      .map(item => {
        if ('children' in item && item.children) {
          return { ...item, children: filterDevmode(item.children) }
        }
        return item
      })
  }

  const visibleNav = computed(() => devmode.isSelected.value ? navConfig.configuredNav.value : filterDevmode(navConfig.configuredNav.value))

  // Provide nested nav context for collapsible sections
  const { provide: provideNavNested, scrollEnabled } = createNavNested(visibleNav)
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

  // Current page info when it's filtered out (by skill level OR feature filter)
  const filteredOutPage = computed(() => {
    const hasSkillFilter = levelFilter.selectedLevels.size > 0
    const hasFeatureFilter = !!navConfig.activeFeatures.value
    if (!hasSkillFilter && !hasFeatureFilter) return null
    const path = route.path
    // Check against configuredNav which is filtered by both skill level and features
    if (hasPage(navConfig.configuredNav.value, path)) return null
    return findPage(app.nav, path)
  })

  // Check if nav has real content (not just dividers)
  const hasNavContent = computed(() =>
    visibleNav.value.some(item => !('divider' in item)),
  )
  const navRef = useTemplateRef<HTMLElement>('nav')

  // Match Tailwind's md breakpoint (768px) for nav visibility
  const isMobile = shallowRef(true)

  function updateMobile () {
    if (!IN_BROWSER) return
    isMobile.value = window.innerWidth < 768
  }

  onMounted(updateMobile)
  useWindowEventListener('resize', updateMobile, { passive: true })

  // Scroll active link into view after nav sections are ready
  watch(scrollEnabled, enabled => {
    if (!enabled || !IN_BROWSER) return
    const nav = document.querySelector('#main-navigation')
    // Find the exact route match, not just any active ancestor
    const activeLink = nav?.querySelector<HTMLElement>(`a[href="${route.path}"]`)
    if (activeLink && nav) {
      const navRect = nav.getBoundingClientRect()
      const linkRect = activeLink.getBoundingClientRect()
      // Only scroll if link is outside visible area
      if (linkRect.top < navRect.top || linkRect.bottom > navRect.bottom) {
        const linkRelativeTop = linkRect.top - navRect.top + nav.scrollTop
        nav.scrollTop = Math.max(0, linkRelativeTop - 100) // 100px from top, not centered
      }
    }
  }, { immediate: true })

  useClickOutside(
    () => navRef.value,
    () => {
      if (navigation.isOpen.value && isMobile.value) {
        navigation.close()
      }
    },
    { ignore: ['[data-app-bar]'] },
  )

  watch(route, () => {
    if (navigation.isOpen.value && isMobile.value) {
      navigation.close()
    }
  }, { immediate: true })
</script>

<template>
  <Discovery.Activator
    id="main-navigation"
    ref="nav"
    active-class="rounded-lg"
    aria-label="Main navigation"
    as="nav"
    class="flex flex-col fixed w-[230px] py-4 top-0 md:top-[72px] bottom-0"
    :class="[
      'flex flex-col fixed w-[230px] overflow-y-auto py-4 top-0 md:top-[72px] bottom-0 translate-x-[-100%] md:translate-x-0 border-r border-solid border-divider z-50',
      settings.showBgGlass.value ? 'bg-glass-surface' : 'bg-surface',
      navigation.isOpen.value && '!translate-x-0',
      !settings.prefersReducedMotion.value && 'transition-transform duration-200 ease-in-out',
    ]"
    :inert="!navigation.isOpen.value && isMobile ? true : undefined"
    :padding="-4"
    step="navigation"
  >
    <!-- Mobile header -->
    <header class="md:hidden shrink-0 px-4 py-3 -mt-4 mb-4 border-b border-divider flex items-center justify-between bg-surface">
      <div class="flex items-center gap-2">
        <AppIcon class="text-primary" icon="menu" />
        <span class="font-medium">Navigation</span>
      </div>

      <AppCloseButton label="Close navigation" @click="navigation.close" />
    </header>

    <!-- URL filter banner -->
    <div v-if="navConfig.activeFeatures.value" class="-mt-4 px-4 py-3 mb-4 bg-surface-variant-50 border-b border-divider">
      <p class="text-xs text-on-surface-variant mb-2">
        Showing docs for your project
      </p>
      <button
        class="text-xs text-primary hover:underline"
        type="button"
        @click="navConfig.clearFilter"
      >
        Show all docs
      </button>
    </div>

    <ul class="flex gap-2 flex-col">
      <template v-if="filteredOutPage">
        <li class="px-4 section-label">
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

      <template v-for="(nav, i) in visibleNav" :key="i">
        <li v-if="'divider' in nav" class="px-4">
          <AppDivider />
        </li>

        <AppNavLink
          v-else-if="'to' in nav"
          :id="nav.to"
          class="px-4"
          :devmode="nav.devmode"
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

      <template v-if="levelFilter.selectedLevels.size > 0">
        <!-- Skip divider if Active page section already added one and nav has no real content -->
        <li v-if="!filteredOutPage || hasNavContent" class="px-4">
          <AppDivider />
        </li>

        <li class="px-4">
          <router-link
            class="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary hover:underline transition-colors"
            to="/guide/essentials/using-the-docs#skill-levels"
          >
            <AppIcon icon="info" size="16" />
            <span>Missing pages?</span>
          </router-link>
        </li>
      </template>
    </ul>
  </Discovery.Activator>
</template>
