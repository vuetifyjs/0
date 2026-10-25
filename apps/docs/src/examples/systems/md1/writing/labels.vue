<script setup lang="ts">
  import { Md1Button, Md1Dialog, Md1ToggleButtons } from '@paper/md1'
  import { createLocaleContext } from '@vuetify/v0'
  import { useHead } from '@unhead/vue'
  import { shallowRef, watch } from 'vue'

  // Material Design 1 loads no fonts; the docs load Noto for the two scripts.
  useHead({
    link: [{
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500&family=Noto+Sans+Thai:wght@400;700&display=swap',
    }],
  })

  // English registers no Md1 keys, so the components fall back to their
  // inline defaults; Japanese and Thai supply the two the dialog writes.
  const [, provideLocale, locale] = createLocaleContext({
    default: 'en',
    messages: {
      en: {},
      ja: {
        Md1: {
          ok: 'OK',
          cancel: 'キャンセル',
        },
      },
      th: {
        Md1: {
          ok: 'ตกลง',
          cancel: 'ยกเลิก',
        },
      },
    },
  })

  provideLocale()

  const language = shallowRef<'en' | 'ja' | 'th'>('en')

  watch(language, id => locale.select(id))

  const COPY = {
    en: { open: 'Reset preferences', title: 'Reset app preferences?', text: 'All preferences go back to their defaults' },
    ja: { open: '設定をリセット', title: 'アプリの設定をリセットしますか?', text: 'すべての設定がデフォルトに戻ります' },
    th: { open: 'รีเซ็ตการตั้งค่า', title: 'รีเซ็ตการตั้งค่าแอปไหม', text: 'การตั้งค่าทั้งหมดจะกลับเป็นค่าเริ่มต้น' },
  } as const

  // The writing page's table of stock button labels, in its order.
  const LABELS = [
    ['Back', 'Allows multi-step processes'],
    ['Cancel', 'Cancels an action'],
    ['Dismiss', 'Makes a message or dialog disappear without consequences'],
    ['Done', 'Confirms the completion of a multi-step process'],
    ['Got it', 'Makes a message or dialog disappear without consequences, like OK'],
    ['Learn more', 'Takes the user to additional content'],
    ['Next', 'Takes the user to the next step of a multi-step process'],
    ['No thanks', 'Allows a user to decline'],
    ['Not now', 'Postpones a decision the product needs; never instead of No thanks'],
    ['OK', 'Confirms an action relevant to the task at hand'],
    ['Skip', 'Avoids an interruption and proceeds with the task'],
  ] as const
</script>

<template>
  <div class="md1-docs-writing-labels-stack">
    <div class="md1-docs-writing-labels-locale">
      <Md1ToggleButtons v-model="language" label="Language" mandatory>
        <Md1ToggleButtons.Item value="en">English</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item lang="ja" value="ja">日本語</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item lang="th" value="th">ไทย</Md1ToggleButtons.Item>
      </Md1ToggleButtons>

      <div :lang="language">
        <Md1Dialog>
          <Md1Dialog.Activator v-slot="{ attrs }">
            <Md1Button v-bind="attrs" variant="raised">{{ COPY[language].open }}</Md1Button>
          </Md1Dialog.Activator>

          <Md1Dialog.Content>
            <Md1Dialog.Title>{{ COPY[language].title }}</Md1Dialog.Title>

            <Md1Dialog.Text>{{ COPY[language].text }}</Md1Dialog.Text>

            <Md1Dialog.Actions>
              <Md1Dialog.Cancel />

              <Md1Dialog.Confirm />
            </Md1Dialog.Actions>
          </Md1Dialog.Content>
        </Md1Dialog>
      </div>
    </div>

    <dl class="md1-docs-writing-labels">
      <div v-for="[label, usage] in LABELS" :key="label" class="md1-docs-writing-label">
        <dt class="md1-docs-writing-label-button">
          <Md1Button>{{ label }}</Md1Button>
        </dt>

        <dd class="md1-docs-writing-label-usage">
          <span class="md1-docs-writing-label-source">“{{ label }}”</span>
          {{ usage }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<style>
  .md1-docs-writing-labels-stack {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-3, 24px);
  }

  .md1-docs-writing-labels-locale {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-writing-labels {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
    gap: var(--md1-spacing-1, 8px) var(--md1-spacing-3, 24px);
    margin: 0;
  }

  /* The script rules name the platform families; Google Fonts serves Noto per script, so the docs add those names. */
  .md1-docs-writing-labels-stack :lang(ja) {
    --md1-font-family: Roboto, "Noto Sans JP", "Noto Sans CJK", Noto, sans-serif;
  }

  .md1-docs-writing-labels-stack :lang(th) {
    --md1-font-family: Roboto, "Noto Sans Thai", "Noto Sans", Noto, sans-serif;
  }

  .md1-docs-writing-label {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    min-width: 0;
  }

  /* A fixed column for the buttons so the usages line up; the longest label, NO THANKS, fits it. */
  .md1-docs-writing-label-button {
    flex: none;
    width: 112px;
  }

  .md1-docs-writing-label-usage {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    line-height: 16px;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-writing-label-source {
    display: block;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
