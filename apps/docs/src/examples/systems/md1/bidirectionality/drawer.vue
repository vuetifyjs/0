<script setup lang="ts">
  import { Md1List, Md1NavigationDrawer, Md1TextField, Md1Toolbar } from '@paper/md1'
  import { createRtlContext } from '@vuetify/v0'
  import { defineComponent, h, ref } from 'vue'

  // Each frame provides its own direction to its subtree.
  const Direction = defineComponent({
    props: { rtl: Boolean, lang: { type: String, default: 'en' } },
    setup (props, { slots }) {
      const [, provide] = createRtlContext({ default: props.rtl })

      provide()

      return () => h('div', { dir: props.rtl ? 'rtl' : 'ltr', lang: props.lang, class: 'md1-docs-screen md1-docs-bidi-frame' }, slots.default?.())
    },
  })

  const frames = [
    { rtl: false, lang: 'en', caption: 'LTR', title: 'Compose', inbox: 'Inbox', sent: 'Sent mail', labels: 'Labels', to: 'To', from: 'Your name' },
    { rtl: true, lang: 'ar', caption: 'RTL', title: 'إنشاء رسالة', inbox: 'البريد الوارد', sent: 'البريد المرسل', labels: 'التصنيفات', to: 'إلى', from: 'اسمك' },
  ]

  const page = ref<Record<string, string>>({ LTR: 'inbox', RTL: 'inbox' })
  const to = ref<Record<string, string>>({ LTR: 'ada@example.com', RTL: 'ada@example.com' })
  const from = ref<Record<string, string>>({ LTR: '', RTL: '' })
</script>

<template>
  <div class="md1-docs-bidi-frames">
    <figure v-for="frame in frames" :key="frame.caption" class="md1-docs-bidi-figure">
      <Direction :lang="frame.lang" :rtl="frame.rtl">
        <Md1NavigationDrawer type="permanent">
          <Md1NavigationDrawer.Content>
            <Md1List v-model="page[frame.caption]">
              <Md1List.Item value="inbox">
                <Md1List.Icon name="inbox" />

                {{ frame.inbox }}
              </Md1List.Item>

              <Md1List.Item value="sent">
                <Md1List.Icon name="send" />

                {{ frame.sent }}
              </Md1List.Item>

              <Md1List.Item value="labels">
                <Md1List.Icon name="label" />

                {{ frame.labels }}
              </Md1List.Item>
            </Md1List>
          </Md1NavigationDrawer.Content>
        </Md1NavigationDrawer>

        <div class="md1-docs-bidi-frame-column">
          <Md1Toolbar variant="primary">
            <Md1Toolbar.Title>{{ frame.title }}</Md1Toolbar.Title>
          </Md1Toolbar>

          <div class="md1-docs-bidi-frame-fields">
            <Md1TextField v-model="to[frame.caption]" icon="email" :label="frame.to" />

            <Md1TextField v-model="from[frame.caption]" icon="person" :label="frame.from" />
          </div>
        </div>
      </Direction>

      <figcaption class="md1-docs-bidi-label">{{ frame.caption }}</figcaption>
    </figure>
  </div>
</template>

<style>
  /* Stacked: a permanent drawer needs most of a handset frame, so the two frames share no row. */
  .md1-docs-bidi-frames {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-3, 24px);
    width: 100%;
    max-width: 720px;
  }

  .md1-docs-bidi-frame {
    display: flex;
    height: 280px;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-bidi-frame-column {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
  }

  .md1-docs-bidi-frame-fields {
    padding: var(--md1-spacing-1, 8px) var(--md1-keyline-margin, 16px);
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
</style>
