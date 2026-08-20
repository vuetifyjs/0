<script setup lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Components
  import AppIcon from '@/components/app/AppIcon.vue'

  // Stores
  import { useAuthStore } from '@vuetify/auth'

  // Types
  import type { AuthProvider } from '@vuetify/auth'

  const auth = useAuthStore()

  const providers: { name: string, provider: AuthProvider, bg: string, icon: string }[] = [
    { name: 'GitHub', provider: 'github', bg: '#24292f', icon: 'github' },
    { name: 'Discord', provider: 'discord', bg: '#5865F2', icon: 'discord' },
    { name: 'Google', provider: 'google', bg: '#4285F4', icon: 'google' },
    { name: 'Open Collective', provider: 'opencollective', bg: '#7FADF2', icon: 'opencollective' },
  ]
</script>

<template>
  <Dialog.Root v-model="auth.dialog">
    <Dialog.Content
      class="m-auto rounded-xl bg-surface border border-divider max-w-sm w-full p-0 shadow-xl"
    >
      <div class="p-6">
        <div class="flex justify-end mb-2">
          <Dialog.Close
            class="pa-1 cursor-pointer bg-transparent border-0 inline-flex items-center justify-center rounded hover:bg-surface-variant transition-colors text-on-surface-variant"
            type="button"
          >
            <AppIcon icon="close" :size="16" />
          </Dialog.Close>
        </div>

        <img
          alt="Vuetify One"
          class="mb-4 h-20 w-auto mx-auto block"
          src="https://cdn.vuetifyjs.com/docs/images/one/logos/vone.svg"
        >

        <Dialog.Title as="div" class="text-lg font-semibold text-on-surface text-center mb-1">
          Sign in to Vuetify One
        </Dialog.Title>

        <Dialog.Description class="text-sm text-on-surface-variant mb-6 text-center px-6">
          Save playgrounds to your account.
        </Dialog.Description>

        <div class="flex flex-col gap-2">
          <button
            v-for="p in providers"
            :key="p.provider"
            class="flex items-center justify-center gap-3 w-full px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer border-0"
            :disabled="auth.isLoading"
            :style="{ backgroundColor: p.bg }"
            type="button"
            @click="auth.login(p.provider)"
          >
            <AppIcon
              class="!opacity-100"
              :icon="p.icon"
              :size="18"
            />

            <span>Continue with {{ p.name }}</span>
          </button>
        </div>

        <p class="mt-6 text-xs text-on-surface-variant text-center">
          <a
            class="text-primary underline underline-offset-2 hover:opacity-80"
            href="https://vuetifyjs.com/one"
            rel="noopener noreferrer"
            target="_blank"
          >What is Vuetify One?</a>
        </p>
      </div>
    </Dialog.Content>
  </Dialog.Root>
</template>
