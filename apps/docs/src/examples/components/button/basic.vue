<script setup lang="ts">
  import { Button } from '@vuetify/v0'

  function onClick () {
    alert('Clicked!')
  }
</script>

<template>
  <div class="flex gap-3">
    <Button.Root
      class="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
      @click="onClick"
    >
      Click me
    </Button.Root>

    <Button.Root
      as="a"
      class="px-4 py-2 bg-secondary text-on-secondary rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
      href="https://vuetifyjs.com"
      target="_blank"
    >
      Link button
    </Button.Root>
  </div>
</template>
