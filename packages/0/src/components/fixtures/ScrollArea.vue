<script setup lang="ts">
  import { ScrollArea } from '../ScrollArea/index'
</script>

<template>
  <ScrollArea.Root style="height: 100px; width: 200px" visibility="always">
    <ScrollArea.Viewport style="height: 100%; width: 100%">
      <p v-for="n in 20" :key="n">Line {{ n }}</p>
    </ScrollArea.Viewport>

    <ScrollArea.Scrollbar orientation="vertical">
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>
