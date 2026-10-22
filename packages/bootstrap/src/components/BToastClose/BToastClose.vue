<script lang="ts">
  // Framework
  import { useLocale } from '@vuetify/v0'

  // Utilities
  import { orphan } from '../../utilities/context'

  import { useBToast } from '../BToast/BToast.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'BToastClose' })

  const toast = useBToast()
  const locale = useLocale()

  orphan('BToastClose', 'BToast', toast)

  function onClick () {
    toast?.close()
  }
</script>

<template>
  <button
    :aria-label="locale.ti('BToast.close') ?? 'Close'"
    class="btn-close"
    type="button"
    @click="onClick"
  />
</template>
