<script setup lang="ts">
  import { Snackbar } from '../Snackbar/index'
</script>

<template>
  <!--
    Static portal shape (not Queue-over-empty-store). The queue example only
    mounts Root when items exist; an empty notifications store would pass the
    rendered>0 check on the portal shell and never audit status/alert or Close.
  -->
  <Snackbar.Portal>
    <Snackbar.Root>
      <Snackbar.Content>Saved</Snackbar.Content>
      <Snackbar.Close />
    </Snackbar.Root>
  </Snackbar.Portal>
</template>
