<script setup lang="ts">
  import { Alert } from '@vuetify/v0'
</script>

<template>
  <div class="flex flex-col gap-4">
    <Alert.Root class="flex items-start gap-3 rounded border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
      <Alert.Title class="font-semibold">
        Session expiring
      </Alert.Title>

      <Alert.Description class="text-error/80">
        You will be signed out in 5 minutes.
      </Alert.Description>
    </Alert.Root>

    <Alert.Root
      class="flex items-start gap-3 rounded border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
      role="status"
    >
      <Alert.Title class="font-semibold">
        Changes saved
      </Alert.Title>

      <Alert.Description class="text-success/80">
        Your profile has been updated successfully.
      </Alert.Description>
    </Alert.Root>
  </div>
</template>
