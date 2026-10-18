<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import TwoFactorForm from './TwoFactorForm.vue'
  import { useTwoFactor } from './useTwoFactor'

  const { code, payload, onSubmit, reset } = useTwoFactor()
</script>

<template>
  <div class="flex flex-col items-center gap-4 max-w-sm mx-auto">
    <p class="text-sm text-on-surface-variant text-center">
      Enter the 6-digit code from your authenticator app. The form submits itself when the last box fills.
    </p>

    <div v-if="payload" class="flex flex-col items-center gap-2 p-4 rounded-lg bg-surface-variant text-on-surface">
      <p class="text-sm font-medium">Form submitted</p>

      <code class="text-sm text-primary tabular-nums">{{ payload }}</code>

      <Button.Root
        class="mt-2 px-3 py-1 rounded-lg border border-divider text-sm"
        @click="reset"
      >
        Start over
      </Button.Root>
    </div>

    <TwoFactorForm v-else v-model="code" :submit="onSubmit" />
  </div>
</template>
