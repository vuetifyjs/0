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
    const max = otp.length.value - 1
    if (max < 0) return
    cells.value?.[Math.min(Math.max(index, 0), max)]?.focus()
  }

  // Typed characters land here so a filled cell is overwritten in place; maxlength
  // is left off the cells because the browser would truncate autofilled codes to it
  function onBeforeinput (index: number, event: InputEvent) {
    if (!event.data || event.data.length !== 1) return
    event.preventDefault()
    if (!otp.accepts(event.data)) return
    const at = Math.min(index, otp.value.value.length)
    otp.write(at, event.data)
    focus(at + 1)
  }

  function onInput (index: number, event: Event) {
    const target = event.target as HTMLInputElement
    const text = target.value

    if (text.length > 1) {
      const previous = otp.value.value.length
      const written = otp.distribute(text, index)
      target.value = otp.value.value[index] ?? ''
      if (written > 0) focus(Math.min(index, previous) + written)
      return
    }

    otp.write(index, text)
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
    const previous = otp.value.value.length
    const consumed = otp.distribute(text, index)
    if (consumed > 0) focus(Math.min(index, previous) + consumed)
  }
</script>

<template>
  <div class="flex gap-2">
    <input
      v-for="item in otp.items.value"
      :key="item.index"
      ref="cells"
      autocomplete="one-time-code"
      class="w-11 h-14 text-center tabular-nums text-xl rounded-lg border-2 border-divider bg-surface text-on-surface outline-none focus:border-primary data-[state=rejected]:border-error data-[state=verified]:border-success disabled:opacity-60 transition-colors"
      :data-state="state"
      :disabled="locked"
      inputmode="numeric"
      :value="item.value"
      @beforeinput="onBeforeinput(item.index, $event)"
      @input="onInput(item.index, $event)"
      @keydown="onKeydown(item.index, $event)"
      @paste="onPaste(item.index, $event)"
    >
  </div>
</template>
