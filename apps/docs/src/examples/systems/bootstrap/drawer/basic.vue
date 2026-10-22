<script setup lang="ts">
  import { BDrawer } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <button
    class="btn-solid theme-primary"
    type="button"
    @click="open = true"
  >
    Open drawer
  </button>

  <BDrawer
    v-model="open"
    placement="start"
  >
    <BDrawer.Header>
      <BDrawer.Title>Drawer</BDrawer.Title>

      <BDrawer.Close />
    </BDrawer.Header>

    <BDrawer.Body>
      Content for the drawer goes here. You can place just about any Bootstrap component or custom elements here.
    </BDrawer.Body>
  </BDrawer>
</template>
