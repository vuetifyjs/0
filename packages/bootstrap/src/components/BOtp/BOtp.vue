<script lang="ts">
  // Framework
  import { Otp } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs } from 'vue'

  // Types
  import type { OtpPattern } from '@vuetify/v0'

  export interface BOtpProps {
    /** Number of character boxes. */
    length?: number
    /** Adds `otp-connected` on `.otp`. */
    connected?: boolean
    /** Adds `otp-sm` or `otp-lg`. */
    size?: 'sm' | 'lg'
    /** Adds `is-valid` or `is-invalid` on `.otp`. */
    state?: 'valid' | 'invalid'
    /** Per-character pattern. Passed through to `Otp.Root`. */
    pattern?: OtpPattern
    disabled?: boolean
    /** When set, `Otp.Root` renders its hidden input. */
    name?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BOtp', inheritAttrs: false })

  const emit = defineEmits<{
    'update:model-value': [value: string]
    'complete': [value: string]
  }>()

  const {
    length = 6,
    connected = false,
    size,
    state,
    pattern = 'numeric',
    disabled = false,
    name,
  } = defineProps<BOtpProps>()

  const model = defineModel<string>({ default: '' })
  const attrs = useAttrs()

  const classes = toRef(() => ({
    'otp-connected': connected,
    'otp-sm': size === 'sm',
    'otp-lg': size === 'lg',
    'is-valid': state === 'valid',
    'is-invalid': state === 'invalid',
  }))

  function onComplete (value: string) {
    emit('complete', value)
  }

  // `.otp-slot` flex-centers its contents. An input's value ignores that and
  // paints a short line at the start, so the digit sits in the corner of the
  // square. The line is the font size; the leftover space in the slot is split
  // above and below it. The slot's own tokens are the size.
  const boxStyle = {
    boxSizing: 'border-box',
    width: 'var(--bs-otp-size)',
    height: 'var(--bs-otp-size)',
    paddingInline: '0',
    paddingBlock: 'calc((var(--bs-otp-size) - 2 * var(--bs-otp-slot-border-width) - var(--bs-otp-font-size)) / 2)',
    textAlign: 'center',
    lineHeight: 'var(--bs-otp-font-size)',
  }
</script>

<template>
  <Otp.Root
    v-bind="attrs"
    v-model="model"
    class="otp"
    :class="classes"
    :disabled
    :length
    :name
    :pattern
    @complete="onComplete"
  >
    <template #default="{ items: boxes }">
      <div class="otp-slots">
        <Otp.Item
          v-for="box in boxes"
          :key="box.index"
          class="otp-input otp-slot pe-auto"
          :index="box.index"
          :style="boxStyle"
        />
      </div>
    </template>
  </Otp.Root>
</template>
