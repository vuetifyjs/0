<script setup lang="ts">
  import { useHead } from '@unhead/vue'

  // Framework
  import { Button, useTheme } from '@vuetify/v0'

  // Components
  import AppSkeleton from '@/components/app/AppSkeleton.vue'
  import AppThemeToggle from '@/components/app/AppThemeToggle.vue'
  import PlaygroundAuthDialog from '@/components/playground/app/PlaygroundAuthDialog.vue'
  import PlaygroundDashboard from '@/components/playground/dashboard/PlaygroundDashboard.vue'

  // Composables
  import { useOnePlaygrounds } from '@/composables/useOnePlaygrounds'

  // Stores
  import { useAuthStore } from '@vuetify/auth'

  // Utilities
  import { onMounted, ref, shallowRef, watch } from 'vue'
  import { RouterLink } from 'vue-router'

  // Types
  import type { OnePlayground } from '@/composables/useOnePlaygrounds'

  useHead({
    title: 'Dashboard · Vuetify0 Play',
  })

  const theme = useTheme()
  const auth = useAuthStore()
  const one = useOnePlaygrounds()

  const items = ref<OnePlayground[]>([])
  const loading = shallowRef(false)
  const checking = shallowRef(true)
  const ready = shallowRef(false)
  const error = shallowRef<string>()

  async function load () {
    loading.value = true
    error.value = undefined
    try {
      items.value = await one.list()
    } catch (error_) {
      error.value = error_ instanceof Error ? error_.message : 'Failed to load playgrounds'
      items.value = []
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    if (!auth.user) await auth.verify()
    checking.value = false
    ready.value = true
    if (auth.user) await load()
  })

  watch(() => auth.user, user => {
    if (!ready.value) return
    if (user) {
      void load()
    } else {
      items.value = []
      error.value = undefined
    }
  })

  function onSignIn () {
    auth.dialog = true
  }
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background text-on-surface">
    <header class="flex items-center h-[48px] px-3 border-b border-divider bg-surface">
      <RouterLink class="flex items-center shrink-0" to="/">
        <img
          alt="Vuetify0 Play"
          class="h-7"
          :src="theme.isDark.value
            ? 'https://vuetifyjs.b-cdn.net/docs/images/one/logos/vplay-logo-dark.svg'
            : 'https://vuetifyjs.b-cdn.net/docs/images/one/logos/vplay-logo-light.svg'"
        >
      </RouterLink>

      <h1 class="text-sm font-medium ms-3">Playgrounds</h1>

      <div class="flex-1" />

      <AppThemeToggle />
    </header>

    <main class="flex-1 w-full max-w-3xl mx-auto px-4 py-6">
      <div v-if="checking" class="p-4">
        <AppSkeleton height="h-12" :lines="4" />
      </div>

      <div
        v-else-if="!auth.user"
        class="flex flex-col items-center justify-center gap-3 py-16 text-center"
      >
        <p class="text-sm text-on-surface-variant">
          Sign in to manage your Vuetify One playgrounds.
        </p>

        <Button.Root
          class="inline-flex items-center px-3 py-1.5 rounded text-sm font-medium bg-primary text-on-primary border-0 cursor-pointer"
          @click="onSignIn"
        >
          Sign in to Vuetify One
        </Button.Root>
      </div>

      <PlaygroundDashboard
        v-else
        v-model="items"
        :error
        :loading
      />
    </main>

    <PlaygroundAuthDialog />
  </div>
</template>
