<script setup lang="ts">
  // Framework
  import { Atom, useClickOutside, useWindowEventListener } from '@vuetify/v0'

  // Utilities
  import { nextTick, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { AtomExpose, AtomProps } from '@vuetify/v0'

  // Stores
  import { useAppStore } from '@/stores/app'

  const { as = 'nav' } = defineProps<AtomProps>()

  const app = useAppStore()
  const route = useRoute()
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
      <template v-for="(nav, i) in app.nav" :key="i">
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
    </ul>
  </Atom>
</template>
