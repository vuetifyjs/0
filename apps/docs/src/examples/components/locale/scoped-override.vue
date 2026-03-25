<script setup lang="ts">
  import { createLocaleContext } from '@vuetify/v0'
  import LocaleCard from './LocaleCard.vue'
  import LocaleSection from './LocaleSection.vue'

  const [, provideLocale] = createLocaleContext({
    default: 'en',
    messages: {
      en: {
        greeting: 'Hello',
        welcome: 'Welcome to our app',
        items: '{0} items selected',
        goodbye: 'Goodbye, {name}!',
        language: 'English',
      },
      fr: {
        greeting: 'Bonjour',
        welcome: 'Bienvenue dans notre application',
        items: '{0} éléments sélectionnés',
        goodbye: 'Au revoir, {name} !',
        language: 'Français',
      },
      es: {
        greeting: 'Hola',
        welcome: 'Bienvenido a nuestra aplicación',
        items: '{0} elementos seleccionados',
        goodbye: '¡Adiós, {name}!',
        language: 'Español',
      },
    },
  })

  provideLocale()
</script>

<template>
  <div class="space-y-6">
    <!-- Root context uses the default locale (en) -->
    <div class="space-y-2">
      <p class="text-sm text-on-surface-variant">Root context (en)</p>
      <LocaleCard />
    </div>

    <!-- Scoped override to French -->
    <LocaleSection label="Scoped to French" locale="fr">
      <LocaleCard />

      <!-- Nested override to Spanish inside French -->
      <LocaleSection label="Nested Spanish" locale="es">
        <LocaleCard />
      </LocaleSection>
    </LocaleSection>

    <!-- Independent Spanish scope -->
    <LocaleSection label="Independent Spanish scope" locale="es">
      <LocaleCard />
    </LocaleSection>
  </div>
</template>
