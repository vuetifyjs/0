<script setup lang="ts">
  import { BAlert, BButton, BClose } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const open = shallowRef(true)
  const dismissed = shallowRef(false)

  function onShow () {
    dismissed.value = false
    open.value = true
  }
</script>

<template>
  <BAlert
    v-model="open"
    class="d-flex align-items-center"
    theme="warning"
    @after-leave="dismissed = true"
  >
    <p class="mb-0">Something is wrong. Check the fields below and try again.</p>

    <BClose
      class="ms-auto"
      @click="open = false"
    />
  </BAlert>

  <BButton
    v-if="dismissed"
    theme="primary"
    variant="solid"
    @click="onShow"
  >
    Show alert
  </BButton>
</template>
