<script setup lang="ts">
  // Composables
  import { useThemeToggleController } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggleController()
  const active = toRef(() =>
    !toggle.isOverrideActive.value && toggle.palette.value === 'ant-design',
  )
</script>

<template>
  <AppThemeButton
    :active
    icon="theme-ant-design"
    justify="start"
    label="Ant Design"
    @click="toggle.setPalette('ant-design')"
  />
</template>
