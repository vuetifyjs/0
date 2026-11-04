<script setup lang="ts">
  import { BButton, BToast } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const open = shallowRef(true)
</script>

<template>
  <div class="bg-1 p-3 d-flex flex-column align-items-start gap-3">
    <BButton
      v-if="!open"
      theme="primary"
      variant="solid"
      @click="open = true"
    >
      Show toast
    </BButton>

    <BToast
      v-model="open"
      :autohide="false"
      instant
    >
      <div class="toast-header">
        <span
          class="rounded me-2"
          style="width: 20px; height: 20px; background: #007aff"
        />

        <strong class="me-auto">Bootstrap</strong>
        <small>11 mins ago</small>
        <BToast.Close />
      </div>

      <BToast.Body>Hello, world! This is a toast message.</BToast.Body>
    </BToast>
  </div>
</template>
