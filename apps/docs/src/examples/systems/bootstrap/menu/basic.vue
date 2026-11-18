<script setup lang="ts">
  import { BMenu } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <BMenu
    v-model="open"
    label="Toggle menu"
  >
    <BMenu.Item href="#">Menu item 1</BMenu.Item>
    <BMenu.Item href="#">Menu item 2</BMenu.Item>
    <BMenu.Item href="#">Menu item 3</BMenu.Item>
  </BMenu>
</template>
