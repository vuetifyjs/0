<script setup lang="ts">
  import { Theme } from '@vuetify/v0'
</script>

<template>
  <Theme class="p-4 rounded bg-background text-on-background" theme="blackguard">
    <div class="text-sm mb-3">Blackguard outer</div>

    <Theme class="p-4 rounded bg-background text-on-background" theme="odyssey">
      <div class="text-sm mb-3">Odyssey nested inside Blackguard</div>

      <Theme class="p-4 rounded bg-background text-on-background" theme="nebula">
        <div class="text-sm">Nebula nested inside Odyssey</div>
      </Theme>
    </Theme>
  </Theme>
</template>
