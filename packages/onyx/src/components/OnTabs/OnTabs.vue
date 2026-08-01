<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnTabs' })

  const model = defineModel<string>()
</script>

<template>
  <div class="onyx-tabs">
    <Tabs.Root v-model="model">
      <slot />
    </Tabs.Root>
  </div>
</template>
