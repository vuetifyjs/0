<script lang="ts" setup>
  //
</script>

<template>
  <div class="storybook-page">
    <iframe
      class="storybook-iframe"
      src="https://vuetifyjs.github.io/0/"
      title="Vuetify 0 Storybook"
    />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>

<style scoped>
  .storybook-page {
    min-height: calc(100vh - 200px);
  }

  .storybook-iframe {
    width: 100%;
    height: calc(100vh - 200px);
    border: none;
  }
</style>
