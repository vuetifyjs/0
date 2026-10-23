<script setup lang="ts">
  import { BToast } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const open = shallowRef(true)
</script>

<template>
  <div class="d-flex flex-column align-items-start gap-5">
    <button class="btn-solid theme-primary" type="button" @click="open = true">
      Show toast
    </button>

    <BToast v-model="open" :autohide="false">
      <div class="toast-header">
        <strong class="me-auto">Bootstrap</strong>
        <small>11 mins ago</small>
        <BToast.Close />
      </div>

      <BToast.Body>Hello, world! This is a toast message.</BToast.Body>
    </BToast>
  </div>
</template>
