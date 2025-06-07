<template>
  <div>
    <h2 class="text-xl">Icons demo</h2>
    <div class="flex flex-col">
      <!-- Lucide icons -->
      <p>Lucide</p>
      <div class="flex gap-2 items-center mb-4">
        <Camera :size="48" />
        <User :size="48" />
        <Settings :size="48" />
      </div>

      <!-- Iconify icons -->
      <p>Iconify</p>
      <div class="flex gap-2 items-center mb-4">
        <Icon icon="lucide:camera" width="48" />
        <Icon icon="lucide:user" width="48" />
        <Icon icon="lucide:settings" width="48" />
      </div>

      <!-- UnoCSS icons -->
      <p>UnoCSS</p>
      <div class="flex gap-2 items-center">
        <div class="size-12 text-3xl text-black i-lucide-camera" />
        <div class="size-12 text-3xl text-black i-lucide-user" />
        <div class="size-12 text-3xl text-black i-lucide-settings" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { Camera, Settings, User } from 'lucide-vue-next'
</script>
