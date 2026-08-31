<script setup lang="ts">
  import { Splitter } from '../Splitter/index'
</script>

<template>
  <Splitter.Root orientation="horizontal">
    <Splitter.Panel :default-size="60" :min-size="20">Left content</Splitter.Panel>
    <Splitter.Handle />
    <Splitter.Panel :default-size="40" :min-size="20">Right content</Splitter.Panel>
  </Splitter.Root>
</template>
