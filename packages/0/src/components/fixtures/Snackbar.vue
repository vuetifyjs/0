<script setup lang="ts">
  import { Snackbar } from '../Snackbar/index'
</script>

<template>
  <Snackbar.Portal>
    <Snackbar.Queue v-slot="{ items }">
      <template v-for="item in items" :key="item.id">
        <Snackbar.Root :id="item.id">
          <Snackbar.Content>{{ item.subject }}</Snackbar.Content>
          <Snackbar.Close />
        </Snackbar.Root>
      </template>
    </Snackbar.Queue>
  </Snackbar.Portal>
</template>
