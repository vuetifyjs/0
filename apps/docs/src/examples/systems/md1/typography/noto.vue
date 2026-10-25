<script setup lang="ts">
  import { useHead } from '@unhead/vue'

  // Google Fonts serves Noto per script: Noto Sans for Latin, a family per
  // CJK locale, and Noto Sans Thai and Devanagari in the two weights Noto
  // ships for the tall scripts.
  useHead({
    link: [{
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400&family=Noto+Sans+JP:wght@100;300;350;400;500;700;900&family=Noto+Sans+KR:wght@400&family=Noto+Sans+SC:wght@400&family=Noto+Sans+TC:wght@400&family=Noto+Sans+Thai:wght@400;700&family=Noto+Sans+Devanagari:wght@400;700&display=swap',
    }],
  })

  const SCRIPTS = [
    { lang: 'en', name: 'English', family: 'Noto Sans', text: 'Noto’s vertical metrics are compatible with Roboto' },
    { lang: 'zh-Hans', name: 'Chinese, Simplified', family: 'Noto Sans SC', text: '天地玄黄，宇宙洪荒。日月盈昃,辰宿列张。' },
    { lang: 'zh-Hant', name: 'Chinese, Traditional', family: 'Noto Sans TC', text: '天地玄黃，宇宙洪荒。日月盈昃,辰宿列張。' },
    { lang: 'ja', name: 'Japanese', family: 'Noto Sans JP', text: 'いろはにほへと ちりぬるを わかよたれそ' },
    { lang: 'ko', name: 'Korean', family: 'Noto Sans KR', text: '다람쥐 헌 쳇바퀴에 타고파' },
    { lang: 'th', name: 'Thai', family: 'Noto Sans Thai', text: 'เป็นมนุษย์สุดประเสริฐเลิศคุณค่า' },
    { lang: 'hi', name: 'Hindi (Devanagari)', family: 'Noto Sans Devanagari', text: 'सभी मनुष्यों को गौरव और अधिकारों के मामले में जन्मजात स्वतन्त्रता और समानता प्राप्त है' },
  ] as const

  // Noto Sans CJK has seven weights; Thai, Devanagari and the other tall
  // scripts have Regular and Bold.
  const CJK = [
    { weight: 100, name: 'Thin' },
    { weight: 300, name: 'Light' },
    { weight: 350, name: 'DemiLight' },
    { weight: 400, name: 'Regular' },
    { weight: 500, name: 'Medium' },
    { weight: 700, name: 'Bold' },
    { weight: 900, name: 'Black' },
  ] as const

  const TALL = [
    { lang: 'th', family: 'Noto Sans Thai', text: 'ภาษาไทย' },
    { lang: 'hi', family: 'Noto Sans Devanagari', text: 'देवनागरी' },
  ] as const
</script>

<template>
  <div class="md1-docs-noto">
    <dl class="md1-docs-noto-scripts">
      <div v-for="script in SCRIPTS" :key="script.lang" class="md1-docs-noto-script">
        <dt class="md1-docs-noto-label">{{ script.name }}, {{ script.family }}</dt>

        <dd class="md1-docs-noto-sample" :lang="script.lang" :style="{ fontFamily: `'${script.family}', sans-serif` }">{{ script.text }}</dd>
      </div>
    </dl>

    <div class="md1-docs-noto-weights">
      <p class="md1-docs-noto-label">Noto Sans CJK: seven weights</p>

      <div class="md1-docs-noto-ladder" lang="ja">
        <span
          v-for="item in CJK"
          :key="item.weight"
          class="md1-docs-noto-step"
          :style="{ fontWeight: item.weight }"
        >
          <span class="md1-docs-noto-glyph">永</span>

          <span class="md1-docs-noto-label" lang="en">{{ item.name }}</span>
        </span>
      </div>

      <p class="md1-docs-noto-label">Noto Sans Thai and Devanagari: Regular and Bold</p>

      <div class="md1-docs-noto-ladder">
        <template v-for="script in TALL" :key="script.lang">
          <span
            v-for="weight in [400, 700]"
            :key="`${script.lang}${weight}`"
            class="md1-docs-noto-step"
            :lang="script.lang"
            :style="{ fontFamily: `'${script.family}', sans-serif`, fontWeight: weight }"
          >
            <span class="md1-docs-noto-word">{{ script.text }}</span>

            <span class="md1-docs-noto-label" lang="en">{{ weight === 400 ? 'Regular' : 'Bold' }}</span>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-noto {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
    gap: var(--md1-spacing-3, 24px) var(--md1-spacing-5, 40px);
    width: 100%;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-noto-scripts {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    margin: 0;
  }

  .md1-docs-noto-script {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .md1-docs-noto-label {
    margin: 0;
    font-family: Roboto, sans-serif;
    font-size: 12px;
    font-weight: 400;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The tall scripts' extra leading: 0.1 em over the English line (typography page, Line height). */
  .md1-docs-noto-sample {
    margin: 0;
    font-size: 20px;
    line-height: 1.5;
  }

  .md1-docs-noto-weights {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-noto-ladder {
    display: flex;
    flex-wrap: wrap;
    gap: var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px);
  }

  .md1-docs-noto-step {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }

  .md1-docs-noto-ladder[lang='ja'] {
    font-family: 'Noto Sans JP', sans-serif;
  }

  .md1-docs-noto-glyph {
    font-size: 48px;
    line-height: 1.2;
  }

  .md1-docs-noto-word {
    font-size: 28px;
    line-height: 1.6;
  }
</style>
