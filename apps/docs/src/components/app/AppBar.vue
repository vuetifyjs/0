<script setup lang="ts">
 // Components
  import { Atom, useBreakpoints, useLayoutItem, useAtomRef } from '@vuetify/v0'

  // Composables
  import { useAppContext } from '@/composables/useApp'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'header' } = defineProps<AtomProps>()

  const breakpoints = useBreakpoints()
  const app = useAppContext()

  const appBarRef = useAtomRef('appBarRef')
  const appBar = useLayoutItem({
    id: 'appBar',
    position: 'top',
    element: appBarRef,
    value: 48,
  })
</script>

<template>
  <Atom
    ref="appBarRef"
    :as
    class="app-header flex items-center justify-between fixed px-3 transition-all duration-200 ease-in-out"
    :style="{
      left: breakpoints.isMobile ? '0px' : appBar.rect.x.value + 'px',
      top: appBar.rect.y.value + 'px',
      height: appBar.rect.height.value + 'px',
      width: appBar.rect.width.value + 'px',
    }"
  >
    <AppIcon
      v-if="breakpoints.isMobile"
      class="pa-1 cursor-pointer"
      :icon="app.nav.value ? 'close' : 'menu'"
      @click="app.nav.value = !app.nav.value"
    />

    <span v-else />

    <div class="flex align-center items-center gap-3">
      <a
        class="bg-[#5661ea] text-white pa-1 inline-flex rounded opacity-90 hover:opacity-100"
        href="https://discord.gg/vK6T89eNP7"
        rel="noopener noreferrer"
        target="_blank"
        title="Discord Community"
      >
        <AppIcon icon="discord" />
      </a>

      <a
        class="bg-gray-800 text-white pa-1 inline-flex rounded opacity-90 hover:opacity-100"
        href="https://github.com/vuetifyjs/0"
        rel="noopener noreferrer"
        target="_blank"
        title="GitHub Repository"
      >
        <AppIcon icon="github" />
      </a>

      <a
        class="bg-[#1867c0] text-white pa-1 inline-flex rounded opacity-90 hover:opacity-100"
        href="https://vuetifyjs.com"
        rel="noopener noreferrer"
        target="_blank"
        title="Vuetify Documentation"
      >
        <AppIcon icon="vuetify" />
      </a>
    </div>
  </Atom>
</template>

<style lang="sass">
  .app-header
    background-color: var(--v0-surface)
    border-bottom: thin solid var(--v0-divider)
</style>
