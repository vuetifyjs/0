<script setup lang="ts">
  import type { OtpContext } from '@vuetify/v0'
  import { toRef, useTemplateRef } from 'vue'
  import type { VerificationStatus } from './useVerification'

  const { otp, state } = defineProps<{
    otp: OtpContext
    state: VerificationStatus
  }>()

  const cells = useTemplateRef<HTMLInputElement[]>('cells')

  const locked = toRef(() => state === 'verifying' || state === 'verified')

  function focus (index: number) {
    cells.value?.[index]?.focus()
  }

  function onInput (index: number, event: Event) {
    const target = event.target as HTMLInputElement
    otp.write(index, target.value)
    // Reflect the gated value back so a pattern-rejected keystroke never lingers visually.
    target.value = otp.value.value[index] ?? ''
    if (otp.value.value.length > index) focus(index + 1)
  }

  function onKeydown (index: number, event: KeyboardEvent) {
    if (event.key !== 'Backspace' || (event.target as HTMLInputElement).value) return
    event.preventDefault()
    const prev = Math.max(0, index - 1)
    otp.write(prev, '')
    focus(prev)
  }

  function onPaste (index: number, event: ClipboardEvent) {
    event.preventDefault()
    const text = event.clipboardData?.getData('text') ?? ''
    const consumed = otp.distribute(text, index)
    focus(Math.min(index + consumed, otp.length.value - 1))
  }
</script>

<template>
  <div class="flex gap-2">
    <input
      v-for="i in otp.length.value"
      :key="i - 1"
      ref="cells"
      autocomplete="one-time-code"
      class="w-11 h-14 text-center tabular-nums text-xl rounded-lg border-2 border-divider bg-surface text-on-surface outline-none focus:border-primary data-[state=rejected]:border-error data-[state=verified]:border-success disabled:opacity-60 transition-colors"
      :data-state="state"
      :disabled="locked"
      inputmode="numeric"
      maxlength="1"
      :value="otp.value.value[i - 1] ?? ''"
      @input="onInput(i - 1, $event)"
      @keydown="onKeydown(i - 1, $event)"
      @paste="onPaste(i - 1, $event)"
    >
  </div>
</template>
