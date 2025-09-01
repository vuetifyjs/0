<script setup lang="ts">
  import { Atom, useBreakpoints, useLayout } from '@vuetify/v0'
  import { useAppStore } from '@/stores/app'
  import { useRoute } from 'vue-router'
  import { watch, watchEffect, useTemplateRef } from 'vue'
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'nav' } = defineProps<AtomProps>()

  const app = useAppStore()
  const breakpoints = useBreakpoints()
  const route = useRoute()

  watch(route, () => {
    if (app.drawer && breakpoints.isMobile) {
      app.drawer = false
    }
  })

  const element = useTemplateRef<HTMLElement>('nav')
  const layout = useLayout()
  const item = layout.register({
    id: 'nav',
    position: 'left',
    element,
    value: 220,
  })

  watchEffect(() => {
    if (breakpoints.isMobile) {
      item.unselect()
    } else {
      item.select()
    }
  })
</script>

<template>
  <Atom
    ref="nav"
    :as
    class="bg-4 z-1000 app-nav flex flex-col pb-4 fixed overflow-y-auto transition-transform duration-200 ease-in-out"
    :class="[
      breakpoints.isMobile && !app.drawer ? 'translate-x-[-100%]' : 'translate-x-0',
    ]"
    :style="{
      height: item.rect.height.value + 'px',
      width: item.rect.width.value + 'px',
      left: item.rect.x.value + 'px',
      top: item.rect.y.value + 'px',
    }"
  >
    <ul class="flex gap-2 flex-col">
      <template v-for="(nav, i) in app.nav" :key="i">
        <div v-if="nav.divider" class="px-4">
          <AppDivider />
        </div>

        <AppNavLink
          v-else
          :children="nav.children"
          class="px-4"
          :to="nav.to || ''"
        >
          {{ nav.name }}
        </AppNavLink>
      </template>
    </ul>
  </Atom>
</template>

<style lang="sass">
  .app-nav
    background-color: var(--v0-surface)
    border-right: thin solid var(--v0-divider)
</style>
