<script setup lang="ts">
  import { createMd1IconsContext, Md1Button, Md1ProgressLinear, Md1Slider } from '@paper/md1'
  import { createRtlContext } from '@vuetify/v0'
  import { defineComponent, h, ref } from 'vue'

  // Material Icons, filled, 24px (Apache License 2.0).
  const [, provideIcons] = createMd1IconsContext({
    icons: {
      'skip-previous': ['M6 6h2v12H6zm3.5 6l8.5 6V6z'],
      'skip-next': ['M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z'],
      'volume-up': ['M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'],
    },
  })

  provideIcons()

  // Each player provides its own direction, so the slider's script-side
  // geometry follows the same side as its `dir`.
  const Direction = defineComponent({
    props: { rtl: Boolean, lang: { type: String, default: 'en' } },
    setup (props, { slots }) {
      const [, provide] = createRtlContext({ default: props.rtl })

      provide()

      return () => h('div', { dir: props.rtl ? 'rtl' : 'ltr', lang: props.lang, class: 'md1-docs-bidi-player md1-elevation-2' }, slots.default?.())
    },
  })

  const players = [
    { rtl: false, lang: 'en', caption: 'LTR', title: 'Morning walk', artist: 'The Quiet Hours', volume: 'Media volume', previous: 'Previous', play: 'Play', next: 'Next' },
    { rtl: true, lang: 'ar', caption: 'RTL', title: 'نزهة الصباح', artist: 'الساعات الهادئة', volume: 'مستوى صوت الوسائط', previous: 'السابق', play: 'تشغيل', next: 'التالي' },
  ]

  const volume = ref<Record<string, number>>({ LTR: 60, RTL: 60 })
</script>

<template>
  <div class="md1-docs-bidi-stack">
    <figure v-for="player in players" :key="player.caption" class="md1-docs-bidi-figure">
      <Direction :lang="player.lang" :rtl="player.rtl">
        <p class="md1-type-subheading md1-docs-bidi-player-title">{{ player.title }}</p>

        <p class="md1-type-body-1 md1-docs-bidi-player-artist">{{ player.artist }}</p>

        <!-- Playback follows the tape, not the reading direction: it stays left to right. -->
        <div class="md1-docs-bidi-player-media" dir="ltr">
          <Md1ProgressLinear :aria-label="player.title" :value="36" />

          <div class="md1-docs-bidi-player-times">
            <span>1:24</span>

            <span>3:50</span>
          </div>

          <div class="md1-docs-bidi-player-controls">
            <Md1Button :aria-label="player.previous" icon="skip-previous" />

            <Md1Button :aria-label="player.play" icon="play-arrow" />

            <Md1Button :aria-label="player.next" icon="skip-next" />
          </div>
        </div>

        <!-- Volume is a quantity, not media direction: the slider and its speaker mirror. -->
        <div class="md1-docs-bidi-volume">
          <Md1Slider v-model="volume[player.caption]" icon-start="volume-up" :label="player.volume" />
        </div>
      </Direction>

      <figcaption class="md1-docs-bidi-label">{{ player.caption }}</figcaption>
    </figure>
  </div>
</template>

<style>
  .md1-docs-bidi-stack {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
    gap: var(--md1-spacing-3, 24px);
    width: 100%;
    max-width: 784px;
  }

  .md1-docs-bidi-figure {
    min-width: 0;
    margin: 0;
  }

  .md1-docs-bidi-label {
    margin-top: var(--md1-spacing-1, 8px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    text-align: center;
  }

  .md1-docs-bidi-player {
    box-sizing: border-box;
    padding: var(--md1-spacing-2, 16px);
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-bidi-player-title,
  .md1-docs-bidi-player-artist {
    margin: 0;
  }

  .md1-docs-bidi-player-artist {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-bidi-player-media {
    margin-top: var(--md1-spacing-3, 24px);
  }

  .md1-docs-bidi-player-times {
    display: flex;
    justify-content: space-between;
    margin-top: var(--md1-spacing-1, 8px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-bidi-player-controls {
    display: flex;
    justify-content: center;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-bidi-player-controls .md1-icon {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-bidi-volume {
    margin-top: var(--md1-spacing-2, 16px);
  }

  /* The speaker is a glyph the example registered, outside the shipped mirror table, so it flips here. */
  [dir='rtl'] .md1-docs-bidi-volume .md1-icon {
    transform: scaleX(-1);
  }
</style>
