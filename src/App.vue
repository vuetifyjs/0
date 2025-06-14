<template>
  <main>
    <V0AffixRoot icon="mdi mdi-account">
      <V0AffixContent />

      <V0AffixLoading>Loading</V0AffixLoading>
    </V0AffixRoot>
  </main>
</template>

<script setup>
  import { createTheme } from '@/composables/theme'

  createTheme({
    current: 'light',
  })
</script>
