<script setup lang="ts">
  import type { LocaleRecord } from '@vuetify/v0'

  import LocalePanel from './LocalePanel.vue'
  import LocaleScope from './LocaleScope.vue'

  const appMessages: Record<string, LocaleRecord> = {
    en: {
      greeting: 'Welcome back, {name}',
      cart: 'You have {0} item(s) in your cart',
      progress: '{count} of {total} tasks complete',
      amount: 'Balance: {0}',
      nav: { home: 'Home', settings: 'Settings' },
    },
    es: {
      greeting: 'Bienvenido de nuevo, {name}',
      cart: 'Tienes {0} artículo(s) en tu carrito',
      progress: '{count} de {total} tareas completadas',
      amount: 'Saldo: {0}',
      nav: { home: 'Inicio', settings: 'Configuración' },
    },
    ja: {
      greeting: 'おかえりなさい、{name}さん',
      cart: 'カートに{0}個の商品があります',
      progress: '{total}件中{count}件のタスク完了',
      amount: '残高：{0}',
      nav: { home: 'ホーム', settings: '設定' },
    },
  }

  const widgetMessages: Record<string, LocaleRecord> = {
    en: {
      greeting: 'Signed in as {name}',
      cart: 'Reviewing {0} line item(s)',
      progress: 'Step {count} of {total}',
      amount: 'Total due: {0}',
      nav: { home: 'Summary', settings: 'Options' },
    },
    fr: {
      greeting: 'Connecté en tant que {name}',
      cart: 'Examen de {0} article(s)',
      progress: 'Étape {count} sur {total}',
      amount: 'Total à payer : {0}',
      nav: { home: 'Résumé', settings: 'Options' },
    },
    de: {
      greeting: 'Angemeldet als {name}',
      cart: '{0} Position(en) werden geprüft',
      progress: 'Schritt {count} von {total}',
      amount: 'Fälliger Betrag: {0}',
      nav: { home: 'Übersicht', settings: 'Optionen' },
    },
  }
</script>

<template>
  <LocaleScope default="en" :messages="appMessages">
    <div class="space-y-4">
      <LocalePanel label="Application shell" name="Ada" />

      <LocaleScope default="fr" :messages="widgetMessages">
        <div class="pl-4 border-l-2 border-primary/30">
          <LocalePanel label="Embedded checkout widget" name="Lin" />
        </div>
      </LocaleScope>
    </div>
  </LocaleScope>
</template>
