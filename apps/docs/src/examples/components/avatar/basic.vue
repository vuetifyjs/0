<script lang="ts" setup>
  import { Avatar } from '@vuetify/v0'
</script>

<template>
  <div class="flex gap-4">
    <Avatar.Root class="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden" style="background-color: var(--v0-surface-tint);">
      <Avatar.Image class="w-full h-full object-cover" src="https://i.pravatar.cc/150?img=1" />
      <Avatar.Fallback class="text-sm font-semibold" style="color: var(--v0-secondary);">JD</Avatar.Fallback>
    </Avatar.Root>

    <Avatar.Root class="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden" style="background-color: var(--v0-surface-tint);">
      <Avatar.Image class="w-full h-full object-cover" src="/invalid.jpg" />
      <Avatar.Fallback class="text-sm font-semibold" style="color: var(--v0-secondary);">FB</Avatar.Fallback>
    </Avatar.Root>
  </div>
</template>
