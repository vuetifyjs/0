<script setup lang="ts">
  import { Alert } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const showInfo = shallowRef(true)
  const showError = shallowRef(true)
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <button
      v-if="!showInfo || !showError"
      class="self-start rounded border border-divider px-3 py-1.5 text-sm hover:bg-surface-tint"
      @click="showInfo = true; showError = true"
    >
      Reset
    </button>

    <Alert.Root
      v-if="showInfo"
      v-model="showInfo"
      class="flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4 text-sm"
    >
      <Alert.Icon class="mt-0.5 shrink-0 text-success">
        <svg class="size-4" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
        </svg>
      </Alert.Icon>

      <div class="flex-1">
        <Alert.Title class="font-semibold text-on-surface">
          Deployment successful
        </Alert.Title>

        <Alert.Description class="mt-1 text-on-surface/70">
          Version 2.4.1 is now live. No action required.
        </Alert.Description>
      </div>

      <Alert.Action
        class="shrink-0 rounded p-1 text-on-surface/50 hover:bg-black/10 hover:text-on-surface"
      >
        <svg class="size-4" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854z" />
        </svg>
      </Alert.Action>
    </Alert.Root>

    <Alert.Root
      v-if="showError"
      v-model="showError"
      class="flex items-start gap-3 rounded-lg border border-error/30 bg-error/10 p-4 text-sm"
    >
      <Alert.Icon class="mt-0.5 shrink-0 text-error">
        <svg class="size-4" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
        </svg>
      </Alert.Icon>

      <div class="flex-1">
        <Alert.Title class="font-semibold text-on-surface">
          Payment failed
        </Alert.Title>

        <Alert.Description class="mt-1 text-on-surface/70">
          We couldn't charge your card ending in 4242. Please update your payment method.
        </Alert.Description>
      </div>

      <Alert.Action
        class="shrink-0 rounded p-1 text-on-surface/50 hover:bg-black/10 hover:text-on-surface"
      >
        <svg class="size-4" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854z" />
        </svg>
      </Alert.Action>
    </Alert.Root>
  </div>
</template>
