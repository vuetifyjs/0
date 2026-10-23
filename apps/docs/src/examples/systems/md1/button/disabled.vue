<script setup lang="ts">
  import { Md1Button } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-row">
    <Md1Button>Enabled</Md1Button>

    <Md1Button disabled>Disabled</Md1Button>

    <Md1Button variant="raised">Enabled</Md1Button>

    <Md1Button disabled variant="raised">Disabled</Md1Button>
  </div>
</template>
