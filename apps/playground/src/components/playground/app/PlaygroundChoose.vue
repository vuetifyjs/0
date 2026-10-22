<script setup lang="ts">
  // Framework
  import { Button, Checkbox } from '@vuetify/v0'

  // Components
  import AppIcon from '@/components/app/AppIcon.vue'
  // Context
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Data
  import { PRESETS } from '@/data/presets'

  // Utilities
  import { shallowRef } from 'vue'

  const playground = usePlayground()
  const pending = shallowRef<string>()
  const remember = shallowRef(false)

  const choices = (['vuetify', 'default'] as const).flatMap(id => {
    const preset = PRESETS.find(item => item.id === id)
    if (!preset) return []
    return [{
      id,
      icon: preset.icon,
      description: preset.description,
      label: id === 'vuetify' ? 'Vuetify 4' : preset.label,
    }]
  })

  async function onChoose (id: string) {
    if (pending.value) return
    pending.value = id
    try {
      await playground.applyPreset(id)
      if (remember.value) playground.defaultPreset.value = id
    } catch {
      pending.value = undefined
    }
  }
</script>

<template>
  <div class="flex flex-1 min-h-0 items-center justify-center p-8">
    <div class="w-full max-w-4xl">
      <h1 id="choose-preset-title" class="text-2xl font-medium text-on-surface">
        Start a playground
      </h1>

      <p class="mt-2 text-base text-on-surface-variant">
        Vuetify 4 or Vuetify0. You can switch later in settings.
      </p>

      <div
        aria-labelledby="choose-preset-title"
        class="mt-8 grid gap-4 sm:grid-cols-2"
        role="group"
      >
        <Button.Root
          v-for="choice in choices"
          :key="choice.id"
          class="flex min-h-64 flex-col items-start gap-4 rounded-xl border border-divider px-8 py-10 text-left hover:border-primary hover:bg-surface-tint disabled:opacity-50"
          :disabled="!!pending"
          @click="onChoose(choice.id)"
        >
          <AppIcon class="text-primary" :icon="choice.icon" :size="56" />

          <span class="text-xl font-medium text-on-surface">{{ choice.label }}</span>

          <span class="text-base text-on-surface-variant">{{ choice.description }}</span>
        </Button.Root>
      </div>

      <Checkbox.Root
        v-model="remember"
        class="mt-8 inline-flex items-center gap-3 border-0 bg-transparent p-0 text-base text-on-surface cursor-pointer"
        :disabled="!!pending"
        label="Make this my default template"
      >
        <span
          class="size-5 shrink-0 inline-flex items-center justify-center rounded-sm border"
          :class="remember
            ? 'border-primary bg-primary/10'
            : 'border-on-surface-variant/40 bg-surface'"
        >
          <Checkbox.Indicator class="text-primary text-sm leading-none">✓</Checkbox.Indicator>
        </span>
        Make this my default template
      </Checkbox.Root>
    </div>
  </div>
</template>
