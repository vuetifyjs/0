<script setup lang="ts">
  // Framework
  import { Avatar, Dialog, Tooltip } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'

  // Composables
  import { useSettings } from '@/composables/useSettings'

  // Stores
  import { useAuthStore } from '@vuetify/auth'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AuthProvider } from '@vuetify/auth'

  const auth = useAuthStore()
  const settings = useSettings()

  const initial = toRef(() => auth.user?.name?.charAt(0).toUpperCase() ?? '?')

  const providers: { name: string, provider: AuthProvider, icon: string, bg: string }[] = [
    { name: 'GitHub', provider: 'github', icon: 'github', bg: '#24292f' },
    { name: 'Discord', provider: 'discord', icon: 'discord', bg: '#5865F2' },
    { name: 'Google', provider: 'google', icon: 'google', bg: '#4285F4' },
    { name: 'Open Collective', provider: 'opencollective', icon: 'opencollective', bg: '#7FADF2' },
  ]
</script>

<template>
  <Tooltip.Root v-if="!auth.isAuthenticated" :close-delay="100" :open-delay="500">
    <Tooltip.Activator
      aria-label="Sign in"
      class="bg-surface-tint text-on-surface-tint pa-1 inline-flex rounded hover:bg-surface-variant transition-all cursor-pointer border-0"
      type="button"
      @click="auth.dialog = true"
    >
      <AppIcon icon="account" />
    </Tooltip.Activator>

    <Tooltip.Content class="px-2.5 py-1.5 rounded border border-divider text-xs bg-surface text-on-surface shadow-lg">
      Sign in
    </Tooltip.Content>
  </Tooltip.Root>

  <Discovery.Activator v-else class="inline-flex rounded-full" step="settings">
    <Tooltip.Root :close-delay="100" :open-delay="500">
      <Tooltip.Activator renderless>
        <template #default="{ attrs: tooltipAttrs }">
          <button
            v-bind="tooltipAttrs"
            aria-label="Account settings"
            class="inline-flex items-center justify-center rounded-full cursor-pointer border-0 bg-transparent p-0 hover:ring-2 hover:ring-primary/50 transition-all"
            type="button"
            @click="settings.toggle"
          >
            <Avatar.Root class="size-6 rounded-full overflow-hidden">
              <Avatar.Image
                alt="User avatar"
                class="size-6 rounded-full object-cover"
                :src="auth.user?.picture"
              />

              <Avatar.Fallback class="size-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-medium">
                {{ initial }}
              </Avatar.Fallback>
            </Avatar.Root>
          </button>
        </template>
      </Tooltip.Activator>

      <Tooltip.Content class="px-2.5 py-1.5 rounded border border-divider text-xs bg-surface text-on-surface shadow-lg">
        Account settings
      </Tooltip.Content>
    </Tooltip.Root>
  </Discovery.Activator>

  <Dialog.Root v-model="auth.dialog">
    <Dialog.Content
      class="m-auto rounded-xl bg-surface border border-divider max-w-sm w-full p-0 shadow-xl"
    >
      <div class="p-6">
        <div class="flex justify-end mb-4">
          <Dialog.Close class="pa-1 cursor-pointer bg-transparent border-0 inline-flex items-center justify-center rounded hover:bg-surface-variant transition-colors text-on-surface-variant">
            <AppIcon icon="close" :size="16" />
          </Dialog.Close>
        </div>

        <img
          alt="Vuetify One"
          class="mb-4 h-24 w-auto mx-auto block"
          src="https://cdn.vuetifyjs.com/docs/images/one/logos/vone.svg"
        >

        <Dialog.Title as="div" class="text-lg font-semibold text-on-surface text-center mb-1">
          Sign in to Vuetify One
        </Dialog.Title>

        <Dialog.Description class="text-sm text-on-surface-variant mb-6 text-center px-9">
          Access premium tools across the Vuetify ecosystem — Bin, Play, Studio, and more.
        </Dialog.Description>

        <div class="flex flex-col gap-2">
          <button
            v-for="p in providers"
            :key="p.provider"
            class="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer border-0"
            :disabled="auth.isLoading"
            :style="{ backgroundColor: p.bg }"
            type="button"
            @click="auth.login(p.provider)"
          >
            <AppIcon class="!opacity-100" :icon="p.icon" :size="18" />
            <span>Continue with {{ p.name }}</span>
          </button>
        </div>

        <p class="mt-6 text-xs text-on-surface-variant text-center">
          Not a subscriber?
          <a
            class="text-primary underline underline-offset-2 hover:opacity-80"
            href="https://vuetifyjs.com/one"
            rel="noopener noreferrer"
            target="_blank"
          >See what's included</a>
        </p>
      </div>
    </Dialog.Content>
  </Dialog.Root>
</template>
