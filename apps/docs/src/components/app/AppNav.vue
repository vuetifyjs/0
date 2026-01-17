<script setup lang="ts">
  // Framework
  import { Dialog, IN_BROWSER, useHydration, useWindowEventListener } from '@vuetify/v0'

  // Composables
  import { useLevelFilterContext } from '@/composables/useLevelFilter'
  import { useNavConfigContext } from '@/composables/useNavConfig'
  import { createNavNested } from '@/composables/useNavNested'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { computed, onMounted, shallowRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { NavItem, NavItemLink } from '@/stores/app'

  // Stores
  import { useAppStore } from '@/stores/app'

  const { prefersReducedMotion } = useSettings()
  const { isSettled } = useHydration()

  const app = useAppStore()
  const { selectedLevels } = useLevelFilterContext()
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

  // Current page info when it's filtered out (by skill level OR feature filter)
  const filteredOutPage = computed(() => {
    const hasSkillFilter = selectedLevels.size > 0
    const hasFeatureFilter = !!activeFeatures.value
    if (!hasSkillFilter && !hasFeatureFilter) return null
    const path = route.path
    // Check against configuredNav which is filtered by both skill level and features
    if (hasPage(configuredNav.value, path)) return null
    return findPage(app.nav, path)
  })

  // Check if nav has real content (not just dividers)
  const hasNavContent = computed(() =>
    configuredNav.value.some(item => !('divider' in item)),
  )

  // Match Tailwind's md breakpoint (768px) for nav visibility
  const isMobile = shallowRef(true)

  function updateMobile () {
    if (!IN_BROWSER) return
    isMobile.value = window.innerWidth < 768
  }

  onMounted(updateMobile)
  useWindowEventListener('resize', updateMobile, { passive: true })

  // Computed for Dialog v-model binding
  const drawerModel = computed({
    get: () => app.drawer,
    set: v => {
      app.drawer = v
    },
  })

  // Close drawer on route change (mobile only)
  watch(route, () => {
    if (app.drawer && isMobile.value) {
      app.drawer = false
    }
  }, { immediate: true })

  // Scroll active link into view after hydration settles
  watch(isSettled, settled => {
    if (!settled || !IN_BROWSER) return
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
</script>

<template>
  <!-- Desktop nav (md and up) -->
  <nav
    v-if="!isMobile"
    id="main-navigation"
    aria-label="Main navigation"
    class="flex flex-col fixed w-[230px] top-[72px] bottom-0 border-r border-solid border-divider z-10 bg-glass-surface overflow-y-auto py-4"
  >
    <!-- URL filter banner -->
    <div v-if="activeFeatures" class="-mt-4 px-4 py-3 mb-4 bg-surface-variant/50 border-b border-divider">
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
        <!-- Skip divider if Active page section already added one and nav has no real content -->
        <li v-if="!filteredOutPage || hasNavContent" class="px-4">
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
  </nav>

  <!-- Mobile nav dialog -->
  <Dialog.Root v-else v-model="drawerModel">
    <Dialog.Content
      id="main-navigation"
      aria-label="Main navigation"
      class="fixed inset-y-0 left-0 right-auto m-0 max-h-full w-[230px] outline-none border-0 p-0 bg-surface"
    >
      <div
        class="flex flex-col h-full border-r border-solid border-divider"
        :class="!prefersReducedMotion && 'transition-transform duration-200 ease-in-out'"
      >
        <!-- Scrollable content wrapper -->
        <nav class="flex-1 overflow-y-auto py-4">
          <!-- URL filter banner -->
          <div v-if="activeFeatures" class="-mt-4 px-4 py-3 mb-4 bg-surface-variant/50 border-b border-divider">
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
              <!-- Skip divider if Active page section already added one and nav has no real content -->
              <li v-if="!filteredOutPage || hasNavContent" class="px-4">
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
        </nav>
      </div>
    </Dialog.Content>
  </Dialog.Root>
</template>

<style scoped>
  dialog::backdrop {
    background: rgb(0 0 0 / 30%);
  }
</style>
