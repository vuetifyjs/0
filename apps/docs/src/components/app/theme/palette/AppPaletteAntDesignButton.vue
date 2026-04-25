<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const active = toRef(() =>
    !toggle.isAccessibilityActive.value && toggle.palette.value === 'ant-design',
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
