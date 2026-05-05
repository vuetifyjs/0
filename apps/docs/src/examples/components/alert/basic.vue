<script setup lang="ts">
  import { Alert } from '@vuetify/v0'
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <Alert.Root
      id="info-alert"
      class="flex items-start gap-3 rounded-lg border border-info/30 bg-info/10 p-4 text-sm"
    >
      <Alert.Icon class="mt-0.5 shrink-0 text-info">
        <svg class="size-4" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
        </svg>
      </Alert.Icon>

      <div class="flex-1">
        <Alert.Title class="font-semibold text-on-surface">
          Scheduled maintenance
        </Alert.Title>

        <Alert.Description class="mt-1 text-on-surface/70">
          The service will be unavailable on Sunday from 2–4 AM UTC.
        </Alert.Description>
      </div>
    </Alert.Root>

    <Alert.Root
      id="warning-alert"
      class="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm"
    >
      <Alert.Icon class="mt-0.5 shrink-0 text-warning">
        <svg class="size-4" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
        </svg>
      </Alert.Icon>

      <div class="flex-1">
        <Alert.Title class="font-semibold text-on-surface">
          Low disk space
        </Alert.Title>

        <Alert.Description class="mt-1 text-on-surface/70">
          You have less than 500 MB remaining. Consider freeing up space.
        </Alert.Description>
      </div>
    </Alert.Root>
  </div>
</template>
