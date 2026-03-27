<script setup lang="ts">
  // Utilities
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  // Redirect to tokens by default
  router.replace(`/${route.params.ds}/tokens`)
</script>

<template>
  <div class="p-8">
    <p>Redirecting...</p>
  </div>
</template>
