<script setup lang="ts">
  // Composables
  import { useSettings } from '@/composables/useSettings'

  // Types
  import type { ShallowRef } from 'vue'

  const {
    showSkillFilter,
    showThemeToggle,
    showSocialLinks,
  } = useSettings()

  const headerButtons = [
    { key: 'showSkillFilter', label: 'Skill filter', icon: 'tune', model: showSkillFilter },
    { key: 'showThemeToggle', label: 'Theme toggle', icon: 'theme-system', model: showThemeToggle },
    { key: 'showSocialLinks', label: 'Social links', icon: 'share', model: showSocialLinks },
  ]

  function onKeydown (e: KeyboardEvent, model: ShallowRef<boolean>) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      model.value = !model.value
    }
  }
</script>

<template>
  <section>
    <h3 class="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-3">
      <AppIcon icon="menu" size="16" />
      <span>Header Buttons</span>
    </h3>
    <div class="space-y-1">
      <label
        v-for="button in headerButtons"
        :key="button.key"
        class="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-surface-tint/50 cursor-pointer"
      >
        <div class="flex items-center gap-2">
          <AppIcon :icon="button.icon" size="16" />
          <span class="text-sm">{{ button.label }}</span>
        </div>
        <button
          :aria-checked="button.model.value"
          :aria-label="`Toggle ${button.label.toLowerCase()}`"
          :class="[
            'relative w-11 h-6 rounded-full transition-colors shrink-0',
            button.model.value ? 'bg-primary' : 'bg-surface-variant',
          ]"
          role="switch"
          type="button"
          @click="button.model.value = !button.model.value"
          @keydown="onKeydown($event, button.model)"
        >
          <span
            :class="[
              'absolute top-1 left-0 w-4 h-4 rounded-full bg-white shadow transition-transform',
              button.model.value ? 'translate-x-6' : 'translate-x-1',
            ]"
          />
        </button>
      </label>
    </div>
    <p class="text-xs text-on-surface-variant/60 mt-2">
      Show or hide buttons in the header
    </p>
  </section>
</template>
