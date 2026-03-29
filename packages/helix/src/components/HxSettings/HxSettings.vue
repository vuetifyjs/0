<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxSettingsProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  // Composables
  import { useScrollLock } from '#helix/composables/useScrollLock'
  import { useSettings } from '#helix/composables/useSettings'

  // Utilities
  import { nextTick, useTemplateRef, watch } from 'vue'

  defineOptions({ name: 'HxSettings' })

  const { ...paperProps } = defineProps<HxSettingsProps>()

  const settings = useSettings()

  useScrollLock(settings.isOpen)

  const sheetRef = useTemplateRef<HTMLElement>('sheet')

  // Focus sheet when opened
  watch(() => settings.isOpen.value, open => {
    if (open) {
      nextTick(() => {
        sheetRef.value?.focus()
      })
    }
  })

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Escape') {
      settings.close()
    }
  }
</script>

<template>
  <V0Paper
    v-if="settings.isOpen.value"
    ref="sheet"
    v-bind="paperProps"
    aria-labelledby="helix-settings-title"
    as="aside"
    class="helix-settings"
    role="complementary"
    tabindex="-1"
    @keydown="onKeydown"
  >
    <!-- Header -->
    <header class="helix-settings__header">
      <span id="helix-settings-title" class="helix-settings__title">Settings</span>

      <button
        aria-label="Close settings"
        class="helix-settings__close"
        title="Close settings"
        type="button"
        @click="settings.close"
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="14"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          width="14"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </header>

    <!-- Content -->
    <div class="helix-settings__content">
      <slot />
    </div>
  </V0Paper>
</template>

<style scoped>
  .helix-settings {
    position: fixed;
    inset-block: 0;
    inset-inline-end: 0;
    display: flex;
    flex-direction: column;
    width: 320px;
    max-width: 100%;
    outline: none;
    z-index: 1000;
  }

  .helix-settings__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 12px 16px;
  }

  .helix-settings__title {
    font-weight: 500;
  }

  .helix-settings__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    background: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .helix-settings__content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }
</style>
