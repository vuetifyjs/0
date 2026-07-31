<script setup lang="ts">
  import VerificationCode from './VerificationCode.vue'
  import { useVerification } from './useVerification'

  const { otp, status, reset } = useVerification()
</script>

<template>
  <div class="flex flex-col items-center gap-5 max-w-sm mx-auto p-6 rounded-xl border border-divider bg-surface">
    <div class="flex flex-col items-center gap-1 text-center">
      <p class="font-medium text-on-surface">Verify your email</p>

      <p class="text-sm text-on-surface-variant">
        Enter the 6-digit code we sent. The mock backend accepts <span class="text-primary tabular-nums">424242</span> — paste it to test distribute.
      </p>
    </div>

    <VerificationCode :otp :state="status" />

    <p v-if="status === 'verifying'" class="text-sm text-on-surface-variant">
      Verifying code…
    </p>

    <p v-else-if="status === 'verified'" class="text-sm text-success">
      Code accepted — your email is verified.
    </p>

    <p v-else-if="status === 'rejected'" class="text-sm text-error">
      {{ otp.input.errors.value[0] }} — try again.
    </p>

    <p v-else class="text-sm text-on-surface-variant tabular-nums">
      {{ otp.value.value.length }} / {{ otp.length.value }} digits entered
    </p>

    <button
      v-if="status === 'verified' || status === 'rejected'"
      class="px-3 py-1.5 rounded-lg border border-divider text-sm text-on-surface hover:border-primary transition-colors"
      type="button"
      @click="reset"
    >
      Start over
    </button>
  </div>
</template>
