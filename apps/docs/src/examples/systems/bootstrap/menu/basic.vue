<script setup lang="ts">
  import { BMenu } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <BMenu v-model="open" label="Toggle menu">
    <BMenu.Header>Account</BMenu.Header>

    <BMenu.Item href="#">Profile</BMenu.Item>

    <BMenu.Divider />

    <BMenu.Item href="#">Sign out</BMenu.Item>

    <BMenu.Submenu label="File">
      <BMenu.Item href="#">New</BMenu.Item>
    </BMenu.Submenu>
  </BMenu>
</template>
