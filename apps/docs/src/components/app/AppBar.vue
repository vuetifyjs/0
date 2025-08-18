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

  const appBar = useAtomRef('appBar')
  useLayoutItem({
    id: 'appBar',
    position: 'top',
    element: appBar,
    value: 48,
  })
</script>

<template>
  <Atom
    ref="appBar"
    :as
    class="app-header flex items-center justify-between h-[48px] fixed left-[220px] top-[24px] right-0 px-3 transition-margin duration-200 ease-in-out"
    :class="breakpoints.isMobile && 'left-0'"
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
        class="bg-[#5661ea] text-white pa-1 inline-flex rounded"
        href="https://discord.gg/vK6T89eNP7"
        rel="noopener noreferrer"
        target="_blank"
      >
        <AppIcon icon="discord" />
      </a>

      <a
        class="bg-gray-800 text-white pa-1 inline-flex rounded"
        href="https://github.com/vuetifyjs/0"
        rel="noopener noreferrer"
        target="_blank"
      >
        <AppIcon icon="github" />
      </a>
    </div>
  </Atom>
</template>

<style lang="sass">
  .app-header
    background-color: var(--v0-surface)
    border-bottom: thin solid var(--v0-divider)
</style>
