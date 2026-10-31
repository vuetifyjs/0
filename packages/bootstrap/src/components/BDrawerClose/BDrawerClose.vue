<script lang="ts">
  // Framework
  import { useLocale } from '@vuetify/v0'

  // Utilities
  import { orphan } from '../../utilities/context'

  import { useBDrawer } from '../BDrawer/BDrawer.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'BDrawerClose' })

  const drawer = useBDrawer()
  const locale = useLocale()

  orphan('BDrawerClose', 'BDrawer', drawer)

  function onClick () {
    drawer?.close()
  }
</script>

<template>
  <button
    :aria-label="locale.ti('Dialog.close') ?? 'Close'"
    class="btn-close"
    type="button"
    @click="onClick"
  />
</template>
