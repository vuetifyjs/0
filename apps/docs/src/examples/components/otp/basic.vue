<script setup lang="ts">
  import { Otp } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const code = shallowRef('')
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <Otp.Root v-model="code" class="flex gap-2" :length="6">
      <Otp.Item
        v-for="i in 6"
        :key="i"
        class="w-10 h-12 text-center border border-divider rounded text-lg outline-none [&[data-state=filled]]:border-primary"
        :index="i - 1"
      />
    </Otp.Root>

    <p class="text-sm text-on-surface-variant">
      Code: {{ code || '—' }}
    </p>
  </div>
</template>
