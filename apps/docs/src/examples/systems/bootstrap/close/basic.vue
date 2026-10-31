<script setup lang="ts">
  import { BAlert, BButton, BClose } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const open = shallowRef(true)
</script>

<template>
  <BAlert
    v-if="open"
    v-model="open"
    class="d-flex align-items-center"
    instant
  >
    <span>You can dismiss this alert.</span>

    <BClose
      class="ms-auto"
      @click="open = false"
    />
  </BAlert>

  <BButton
    v-else
    theme="primary"
    variant="solid"
    @click="open = true"
  >
    Show alert
  </BButton>
</template>
