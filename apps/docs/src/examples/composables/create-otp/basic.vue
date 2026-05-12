<script setup lang="ts">
  import { createOtp } from '@vuetify/v0'
  import { useTemplateRef } from 'vue'

  const otp = createOtp({
    length: 6,
    pattern: 'numeric',
  })

  const inputs = useTemplateRef<HTMLInputElement[]>('inputs')

  function onInput (index: number, event: Event) {
    const target = event.target as HTMLInputElement
    otp.setAt(index, target.value)
    if (otp.value.value.length > index) {
      const next = inputs.value?.[index + 1]
      next?.focus()
    }
    target.value = otp.value.value[index] ?? ''
  }

  function onKey (index: number, event: KeyboardEvent) {
    if (event.key !== 'Backspace' || (event.target as HTMLInputElement).value) return
    event.preventDefault()
    otp.setAt(Math.max(0, index - 1), '')
    inputs.value?.[Math.max(0, index - 1)]?.focus()
  }

  function onPaste (index: number, event: ClipboardEvent) {
    event.preventDefault()
    const text = event.clipboardData?.getData('text') ?? ''
    const consumed = otp.paste(text, index)
    const target = Math.min(index + consumed, otp.length.value - 1)
    inputs.value?.[target]?.focus()
  }
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex gap-2">
      <input
        v-for="i in otp.length.value"
        :key="i - 1"
        ref="inputs"
        class="w-10 h-12 text-center tabular-nums text-lg rounded border border-divider bg-surface text-on-surface focus:outline-none focus:border-primary data-[complete=true]:border-success"
        :data-complete="otp.isComplete.value"
        inputmode="numeric"
        maxlength="1"
        :value="otp.value.value[i - 1] ?? ''"
        @input="onInput(i - 1, $event)"
        @keydown="onKey(i - 1, $event)"
        @paste="onPaste(i - 1, $event)"
      >
    </div>

    <div class="text-sm text-on-surface-variant">
      Value: {{ otp.value.value || '—' }}
    </div>
  </div>
</template>
