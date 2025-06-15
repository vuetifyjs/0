<template>
  <main>
    <V0AvatarRoot bg-color="#eeeeee" size="32px" src="https://vuetifyjs.b-cdn.net/docs/images/avatars/one.png">
      <V0AvatarContent />

      <V0AvatarLoading>
        <span>Load</span>
      </V0AvatarLoading>

      <V0AvatarFallback>
        <span>Fallback</span>
      </V0AvatarFallback>
    </V0AvatarRoot>

    <!-- <V0AvatarRoot
      bg-color="primary"
      font-size="2rem"
      height="64px"
      icon="mdi mdi-account"
      width="64px"
    >
      <V0AvatarContent />
    </V0AvatarRoot> -->
  </main>
</template>

<script setup>
  import { createTheme } from '@/composables/theme'

  createTheme({
    current: 'light',
  })
</script>
