<script setup lang="ts">
  import { Single } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const selected = shallowRef<string>()

  const plans = [
    { value: 'free', label: 'Free', disabled: true },
    { value: 'pro', label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise' },
  ]
</script>

<template>
  <Single.Root v-model="selected" mandatory="force">
    <div class="flex flex-col gap-2">
      <Single.Item
        v-for="plan in plans"
        :key="plan.value"
        v-slot="{ attrs }"
        :disabled="plan.disabled"
        :value="plan.value"
      >
        <button
          v-bind="attrs"
          class="px-3 py-1.5 border rounded text-left text-sm bg-surface border-divider data-[selected]:bg-surface-tint data-[selected]:border-primary data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
        >
          {{ plan.label }}
        </button>
      </Single.Item>
    </div>
  </Single.Root>

  <p class="mt-4">Selected: {{ selected }}</p>
</template>
