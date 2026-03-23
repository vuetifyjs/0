<script setup lang="ts">
  import { createLocaleContext, useLocale } from '@vuetify/v0'
  import { toRef } from 'vue'

  const [, provideLocale] = createLocaleContext({
    default: 'en',
    messages: {
      en: {
        greeting: 'Hello, {name}!',
        items: 'You have {0} item(s) in your cart.',
        welcome: 'Welcome to our application',
        nav: {
          home: 'Home',
          settings: 'Settings',
          profile: 'Profile',
        },
        status: '{count} of {total} tasks completed',
      },
      es: {
        greeting: '¡Hola, {name}!',
        items: 'Tienes {0} artículo(s) en tu carrito.',
        welcome: 'Bienvenido a nuestra aplicación',
        nav: {
          home: 'Inicio',
          settings: 'Configuración',
          profile: 'Perfil',
        },
        status: '{count} de {total} tareas completadas',
      },
      ja: {
        greeting: 'こんにちは、{name}さん！',
        items: 'カートに{0}個の商品があります。',
        welcome: 'アプリケーションへようこそ',
        nav: {
          home: 'ホーム',
          settings: '設定',
          profile: 'プロフィール',
        },
        status: '{total}件中{count}件のタスク完了',
      },
    },
  })

  provideLocale()

  const locale = useLocale()

  const current = toRef(() => locale.selectedId.value)
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="id in locale.keys()"
        :key="id"
        class="px-3 py-1.5 text-sm rounded-lg border transition-all"
        :class="current === id
          ? 'border-primary bg-primary/10 text-primary font-medium'
          : 'border-divider text-on-surface-variant hover:border-primary/50'"
        @click="locale.select(id)"
      >
        {{ id }}
      </button>
    </div>

    <div class="rounded-lg border border-divider p-4 space-y-3">
      <p class="text-sm font-medium text-on-surface">
        {{ locale.t('welcome') }}
      </p>

      <p class="text-sm text-on-surface-variant">
        {{ locale.t('greeting', { name: 'Alice' }) }}
      </p>

      <p class="text-sm text-on-surface-variant">
        {{ locale.t('items', 3) }}
      </p>

      <p class="text-sm text-on-surface-variant">
        {{ locale.t('status', { count: 7, total: 10 }) }}
      </p>

      <div class="flex gap-3 pt-2 border-t border-divider">
        <span
          v-for="key in ['nav.home', 'nav.settings', 'nav.profile']"
          :key
          class="text-xs px-2 py-1 rounded-md bg-surface-variant text-on-surface-variant"
        >
          {{ locale.t(key) }}
        </span>
      </div>

      <p class="text-xs text-on-surface-variant">
        Number format: {{ locale.n(1234567.89) }}
      </p>
    </div>
  </div>
</template>
