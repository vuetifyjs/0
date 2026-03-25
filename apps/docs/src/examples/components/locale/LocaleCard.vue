<script setup lang="ts">
  import { useLocale } from '@vuetify/v0'
  import { toRef } from 'vue'

  const { selectedId } = useLocale()

  const messages: Record<string, Record<string, string>> = {
    en: {
      language: 'English',
      greeting: 'Hello',
      welcome: 'Welcome to our app',
      items: '3 items selected',
      goodbye: 'Goodbye, World!',
    },
    fr: {
      language: 'Français',
      greeting: 'Bonjour',
      welcome: 'Bienvenue dans notre application',
      items: '3 éléments sélectionnés',
      goodbye: 'Au revoir, World !',
    },
    es: {
      language: 'Español',
      greeting: 'Hola',
      welcome: 'Bienvenido a nuestra aplicación',
      items: '3 elementos seleccionados',
      goodbye: '¡Adiós, World!',
    },
  }

  const current = toRef(() => messages[selectedId.value as string] ?? messages.en)
</script>

<template>
  <div class="rounded-lg border border-divider p-4 space-y-3">
    <div class="flex items-center gap-2">
      <span class="font-medium text-on-surface">{{ current.language }}</span>

      <span class="text-xs px-2 py-0.5 rounded-full bg-primary text-on-primary font-mono">
        {{ selectedId }}
      </span>
    </div>

    <div class="space-y-1 text-sm text-on-surface-variant">
      <p>{{ current.greeting }} &mdash; {{ current.welcome }}</p>
      <p class="font-mono text-xs">{{ current.items }}</p>
      <p class="font-mono text-xs">{{ current.goodbye }}</p>
    </div>
  </div>
</template>
