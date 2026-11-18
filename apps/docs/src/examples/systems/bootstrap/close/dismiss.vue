<script setup lang="ts">
  import { BAlert, BButton, BClose } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const open = shallowRef(true)
</script>

<template>
  <div>
    <BAlert
      v-model="open"
      class="d-flex align-items-center"
      theme="primary"
    >
      <p class="mb-0">The close button sets this model.</p>

      <BClose
        class="ms-auto"
        @click="open = false"
      />
    </BAlert>

    <BButton
      v-if="!open"
      theme="primary"
      variant="solid"
      @click="open = true"
    >
      Show
    </BButton>
  </div>
</template>
