<script setup lang="ts">
  // Composables
  import { useSettings } from '@/composables/useSettings'

  const {
    showSkillFilter,
    showThemeToggle,
    showSocialLinks,
  } = useSettings()
</script>

<template>
  <section>
    <AppSettingsHeader icon="menu" title="Header Buttons" />
    <div class="space-y-1">
      <AppSettingsToggle
        v-model="showSkillFilter"
        label="Skill filter"
      >
        <template #prepend>
          <AppIcon icon="tune" size="16" />
        </template>
      </AppSettingsToggle>
      <AppSettingsToggle
        v-model="showThemeToggle"
        label="Theme toggle"
      >
        <template #prepend>
          <AppIcon icon="theme-settings" size="16" />
        </template>
      </AppSettingsToggle>
      <AppSettingsToggle
        v-model="showSocialLinks"
        label="Social links"
      >
        <template #prepend>
          <AppIcon icon="share" size="16" />
        </template>
      </AppSettingsToggle>
    </div>
    <p class="text-xs text-on-surface-variant/60 mt-2">
      Show or hide buttons in the header
    </p>
  </section>
</template>
