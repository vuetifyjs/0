<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { toRef } from 'vue'

  const toggle = useThemeToggle()
  const pressed = toRef(() =>
    !toggle.isAccessibilityActive.value && toggle.palette.value === 'ant-design',
  )
</script>

<template>
  <AppThemeButton
    icon="theme-ant-design"
    label="Ant Design"
    :pressed
    @click="toggle.setPalette('ant-design')"
  />
</template>
