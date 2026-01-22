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
    <AppSettingsHeader icon="menu" title="Header" />
    <div class="space-y-1">
      <AppSettingsToggle
        v-model="showSkillFilter"
        description="Filter button in header"
        label="Skill filter"
      >
        <template #prepend>
          <AppIcon icon="tune" size="16" />
        </template>
      </AppSettingsToggle>
      <AppSettingsToggle
        v-model="showThemeToggle"
        description="Theme switcher in header"
        label="Theme toggle"
      >
        <template #prepend>
          <AppIcon icon="theme-settings" size="16" />
        </template>
      </AppSettingsToggle>
      <AppSettingsToggle
        v-model="showSocialLinks"
        description="GitHub and Discord links"
        label="Social links"
      >
        <template #prepend>
          <AppIcon icon="share" size="16" />
        </template>
      </AppSettingsToggle>
    </div>
  </section>
</template>
