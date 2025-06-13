<template>
  <main>
    <V0Paper elevation="md" padding="2rem" border-width="thin" border-style="solid" border-color="#eeeeee" border-radius="8px">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde voluptatem!
    </V0Paper>
  </main>
</template>

<script setup>
  import { createTheme } from '@/composables/theme'

  createTheme({
    current: 'light',
  })
</script>
