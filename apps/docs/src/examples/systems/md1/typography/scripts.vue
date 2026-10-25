<script setup lang="ts">
  import { md1DesignSystem } from '@paper/md1'
  import { useHead } from '@unhead/vue'

  import type { Md1TypeStyle, Md1TypeTokens } from '@paper/md1'

  const { type, typeDense, typeTall } = md1DesignSystem

  // Material Design 1 loads no fonts; the docs load Roboto and the Noto
  // family each script needs from Google Fonts.
  useHead({
    link: [{
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Noto+Sans:wght@400;700&family=Noto+Sans+JP:wght@400;500&family=Noto+Sans+TC:wght@400;500&family=Noto+Sans+Thai:wght@400;700&family=Noto+Sans+Devanagari:wght@400;700&display=swap',
    }],
  })

  type Overrides = Partial<Record<Md1TypeStyle, Partial<Md1TypeTokens>>>

  const STYLES = ['title', 'subheading', 'body-1', 'button'] as const

  // The lang attribute is the whole switch: the md1-type-* classes and
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
      lang: 'zh-Hant',
      name: 'Dense (zh-Hant)',
      overrides: typeDense as Overrides,
      text: { 'title': '訊息', 'subheading': '今天的未讀訊息', 'body-1': '您的訂單已出貨，將於星期五送達。', 'button': '回覆' },
    },
    {
      lang: 'vi',
      name: 'Tall (vi)',
      overrides: typeTall as Overrides,
      text: { 'title': 'Tin nhắn', 'subheading': 'Chưa đọc hôm nay', 'body-1': 'Đơn hàng của bạn đã được gửi và sẽ đến vào thứ Sáu.', 'button': 'Trả lời' },
    },
    {
      lang: 'hi',
      name: 'Tall (hi)',
      overrides: typeTall as Overrides,
      text: { 'title': 'संदेश', 'subheading': 'आज के अपठित संदेश', 'body-1': 'आपका ऑर्डर भेज दिया गया है और शुक्रवार को पहुंचेगा।', 'button': 'जवाब दें' },
    },
    {
      lang: 'th',
      name: 'Tall (th)',
      overrides: typeTall as Overrides,
      text: { 'title': 'ข้อความ', 'subheading': 'ข้อความที่ยังไม่ได้อ่านวันนี้', 'body-1': 'คำสั่งซื้อของคุณจัดส่งแล้ว และจะมาถึงในวันศุกร์', 'button': 'ตอบกลับ' },
    },
  ] as const

  function metrics (style: Md1TypeStyle, overrides: Overrides): string {
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
  <div class="md1-docs-scripts">
    <div
      v-for="column in columns"
      :key="column.lang"
      class="md1-docs-script"
      :lang="column.lang"
    >
      <p class="md1-docs-script-name" lang="en">{{ column.name }}</p>

      <div v-for="line in column.lines" :key="line.style" class="md1-docs-script-line">
        <p class="md1-docs-script-text" :class="`md1-type-${line.style}`">{{ line.text }}</p>

        <p class="md1-docs-script-metrics" lang="en">{{ line.style }}, {{ line.metrics }}</p>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-scripts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--md1-spacing-3, 24px);
  }

  .md1-docs-script {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  /*
   * The script rules name "Noto Sans CJK" and "Noto Sans", the families a
   * platform installs. Google Fonts serves Noto per script, so the docs put
   * those names first; the extra class outranks the :lang() rule.
   */
  .md1-docs-scripts :lang(ja) {
    --md1-font-family: Roboto, "Noto Sans JP", "Noto Sans CJK", Noto, sans-serif;
  }

  .md1-docs-scripts :lang(zh-Hant) {
    --md1-font-family: Roboto, "Noto Sans TC", "Noto Sans CJK", Noto, sans-serif;
  }

  .md1-docs-scripts :lang(hi) {
    --md1-font-family: Roboto, "Noto Sans Devanagari", "Noto Sans", Noto, sans-serif;
  }

  .md1-docs-scripts :lang(th) {
    --md1-font-family: Roboto, "Noto Sans Thai", "Noto Sans", Noto, sans-serif;
  }

  .md1-docs-script-name,
  .md1-docs-script-text,
  .md1-docs-script-metrics {
    margin: 0;
  }

  /* The labels are English text, so they say so; the type tokens are inherited custom properties and still follow the column's script. */
  .md1-docs-script-name {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: var(--md1-font-weight-medium, 500);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-script-metrics {
    margin-top: 4px;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
