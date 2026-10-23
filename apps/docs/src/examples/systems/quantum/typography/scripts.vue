<script setup lang="ts">
  import { quantumDesignSystem } from '@paper/quantum'

  import type { QuantumTypeStyle, QuantumTypeTokens } from '@paper/quantum'

  const { type, typeDense, typeTall } = quantumDesignSystem

  type Overrides = Partial<Record<QuantumTypeStyle, Partial<QuantumTypeTokens>>>

  const STYLES = ['title', 'subheading', 'body-1', 'button'] as const

  // The lang attribute is the whole switch: the quantum-type-* classes and
  // the type tokens both rescope on :lang(), so no prop or class changes.
  const SCRIPTS = [
    {
      lang: 'en',
      name: 'English-like',
      overrides: {} as Overrides,
      text: { 'title': 'Messages', 'subheading': 'Unread from today', 'body-1': 'Your order has shipped and arrives on Friday.', 'button': 'Reply' },
    },
    {
      lang: 'ja',
      name: 'Dense (ja)',
      overrides: typeDense as Overrides,
      text: { 'title': 'メッセージ', 'subheading': '今日の未読', 'body-1': 'ご注文の商品は発送され、金曜日に到着します。', 'button': '返信' },
    },
    {
      lang: 'vi',
      name: 'Tall (vi)',
      overrides: typeTall as Overrides,
      text: { 'title': 'Tin nhắn', 'subheading': 'Chưa đọc hôm nay', 'body-1': 'Đơn hàng của bạn đã được gửi và sẽ đến vào thứ Sáu.', 'button': 'Trả lời' },
    },
  ] as const

  function metrics (style: QuantumTypeStyle, overrides: Overrides): string {
    const tokens = { ...type[style], ...overrides[style] }
    const size = tokens.size.replace('px', '')
    const leading = tokens.leading === '1' ? '' : `/${tokens.leading.replace('px', '')}`

    return `${size}${leading} sp device, weight ${tokens.weight}`
  }

  const columns = SCRIPTS.map(script => ({
    lang: script.lang,
    name: script.name,
    lines: STYLES.map(style => ({
      style,
      text: script.text[style],
      metrics: metrics(style, script.overrides),
    })),
  }))
</script>

<template>
  <div class="quantum-docs-scripts">
    <div
      v-for="column in columns"
      :key="column.lang"
      class="quantum-docs-script"
      :lang="column.lang"
    >
      <p class="quantum-docs-script-name" lang="en">{{ column.name }}</p>

      <div v-for="line in column.lines" :key="line.style" class="quantum-docs-script-line">
        <p class="quantum-docs-script-text" :class="`quantum-type-${line.style}`">{{ line.text }}</p>

        <p class="quantum-docs-script-metrics" lang="en">{{ line.style }}, {{ line.metrics }}</p>
      </div>
    </div>
  </div>
</template>

<style>
  .quantum-docs-scripts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--quantum-spacing-3, 24px);
  }

  .quantum-docs-script {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-script-name,
  .quantum-docs-script-text,
  .quantum-docs-script-metrics {
    margin: 0;
  }

  /* The labels are English text, so they say so; the type tokens are inherited custom properties and still follow the column's script. */
  .quantum-docs-script-name {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-2-size, 14px);
    font-weight: var(--quantum-font-weight-medium, 500);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-docs-script-metrics {
    margin-top: 4px;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
