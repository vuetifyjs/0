<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { Alert, Button } from '@vuetify/v0'

  const visible = shallowRef(false)

  function onShow () {
    visible.value = true
  }

  function onDismiss () {
    visible.value = false
  }
</script>

<template>
  <div class="flex flex-col gap-4">
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

    <Button.Root
      class="self-start px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium"
      @click="onShow"
    >
      Show session warning
    </Button.Root>

    <Alert.Root
      v-if="visible"
      class="flex items-start gap-3 rounded border border-error/30 bg-error/10 px-4 py-3 text-sm text-error"
    >
      <div class="flex flex-col gap-1 flex-1">
        <Alert.Title class="font-semibold">
          Session expiring
        </Alert.Title>

        <Alert.Description class="text-error/80">
          You will be signed out in 5 minutes.
        </Alert.Description>
      </div>

      <Button.Root
        class="shrink-0 p-1 -mr-1 opacity-50 hover:opacity-100"
        @click="onDismiss"
      >
        Dismiss
      </Button.Root>
    </Alert.Root>
  </div>
</template>
