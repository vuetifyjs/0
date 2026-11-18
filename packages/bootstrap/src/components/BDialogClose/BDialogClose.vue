<script lang="ts">
  // Framework
  import { useLocale } from '@vuetify/v0'

  // Utilities
  import { orphan } from '../../utilities/context'

  import { useBDialog } from '../BDialog/BDialog.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'BDialogClose' })

  const dialog = useBDialog()
  const locale = useLocale()

  orphan('BDialogClose', 'BDialog', dialog)

  function onClick () {
    dialog?.close()
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
