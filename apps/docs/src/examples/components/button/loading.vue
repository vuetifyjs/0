<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const loading = shallowRef(false)

  function onSave () {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 3000)
  }
</script>

<template>
  <Button.Root
    class="relative px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium hover:opacity-90 transition-opacity data-[loading]:cursor-wait"
    :loading
    @click="onSave"
  >
    <Button.Loading v-slot="{ isSelected }">
      <span class="absolute inset-0 flex items-center justify-center transition-opacity" :class="isSelected ? 'opacity-100' : 'opacity-0'">
        Saving...
      </span>
    </Button.Loading>

    <Button.Content v-slot="{ isSelected }">
      <span class="transition-opacity" :class="isSelected ? 'opacity-100' : 'opacity-0'">
        Save
      </span>
    </Button.Content>
  </Button.Root>

  <p class="mt-3 text-sm text-on-surface-variant">
    Click the button — the loading indicator appears after a 1-second grace period.
  </p>
</template>
