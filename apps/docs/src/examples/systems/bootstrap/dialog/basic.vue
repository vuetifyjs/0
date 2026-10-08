<script setup lang="ts">
  import { BDialog } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <button
    class="btn-solid theme-primary"
    type="button"
    @click="open = true"
  >
    Open dialog
  </button>

  <BDialog v-model="open">
    <BDialog.Header>
      <BDialog.Title>Dialog title</BDialog.Title>

      <BDialog.Close />
    </BDialog.Header>

    <BDialog.Body>
      <p>
        Bootstrap paints this. The open state, the backdrop click, and Escape
        come from Vuetify0, on the browser's own dialog.
      </p>
    </BDialog.Body>

    <BDialog.Footer>
      <button
        class="btn-solid theme-secondary"
        type="button"
        @click="open = false"
      >
        Close
      </button>

      <button
        class="btn-solid theme-primary"
        type="button"
      >
        Save changes
      </button>
    </BDialog.Footer>
  </BDialog>
</template>
