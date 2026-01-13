<script setup lang="ts">
  import { Radio } from '@vuetify/v0'
  import { ref } from 'vue'

  const plan = ref<string>()

  const plans = [
    { value: 'free', label: 'Free', description: 'Basic features' },
    { value: 'pro', label: 'Pro', description: 'Advanced features' },
    { value: 'enterprise', label: 'Enterprise', description: 'Custom solutions' },
  ]
</script>

<template>
  <Radio.Group v-model="plan" class="flex flex-col gap-3" mandatory="force">
    <label
      v-for="item in plans"
      :key="item.value"
      class="flex items-start gap-3 p-3 border rounded-lg border-divider has-[:checked]:border-primary has-[:checked]:bg-primary/5 cursor-pointer"
    >
      <Radio.Root
        class="size-5 mt-0.5 border rounded-full inline-flex items-center justify-center border-divider data-[state=checked]:border-primary"
        :value="item.value"
      >
        <Radio.Indicator class="size-2.5 rounded-full bg-primary" />
      </Radio.Root>
      <div>
        <div class="font-medium">{{ item.label }}</div>
        <div class="text-sm text-on-surface-variant">{{ item.description }}</div>
      </div>
    </label>
  </Radio.Group>

  <p class="mt-4 text-sm text-on-surface-variant">
    Selected plan: {{ plan }}
  </p>
</template>
