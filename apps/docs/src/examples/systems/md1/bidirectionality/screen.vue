<script setup lang="ts">
  import { Md1Button, Md1Checkbox, Md1List, Md1ProgressLinear, Md1Tabs, Md1Toolbar } from '@paper/md1'
  import { createRtlContext } from '@vuetify/v0'
  import { defineComponent, h, ref } from 'vue'

  // Each screen provides its own direction to its subtree, so one page shows
  // both at once. In an app this is `app.use(createRtlPlugin())` and one `dir`.
  const Direction = defineComponent({
    props: { rtl: Boolean, lang: { type: String, default: 'en' } },
    setup (props, { slots }) {
      const [, provide] = createRtlContext({ default: props.rtl })

      provide()

      return () => h('div', { dir: props.rtl ? 'rtl' : 'ltr', lang: props.lang, class: 'md1-docs-bidi-screen md1-elevation-2' }, slots.default?.())
    },
  })

  const screens = [
    {
      rtl: false,
      lang: 'en',
      caption: 'LTR',
      title: 'Inbox',
      tabs: ['Item One', 'Item Two', 'Item Three'],
      people: [
        { id: 'sara', initial: 'S', name: 'Sara Ahmed', subject: 'Lunch this weekend?', time: '3:45 PM' },
        { id: 'omar', initial: 'O', name: 'Omar Khaled', phone: '+1 650-555-0123', time: '9:12 AM' },
      ],
      wifi: 'Download over Wi-Fi only',
      progress: 'Uploading 2 of 5 photos',
      cancel: 'Cancel',
      save: 'Save',
    },
    {
      rtl: true,
      lang: 'ar',
      caption: 'RTL',
      title: 'البريد الوارد',
      tabs: ['العنصر الأول', 'العنصر الثاني', 'العنصر الثالث'],
      people: [
        { id: 'sara', initial: 'س', name: 'سارة أحمد', subject: 'غداء نهاية الأسبوع؟', time: '3:45 م' },
        { id: 'omar', initial: 'ع', name: 'عمر خالد', phone: '+1 650-555-0123', time: '9:12 ص' },
      ],
      wifi: 'التنزيل عبر Wi-Fi فقط',
      progress: 'جارٍ تحميل 2 من 5 صور',
      cancel: 'إلغاء',
      save: 'حفظ',
    },
  ]

  const tab = ref<Record<string, string>>({ LTR: 'Item One', RTL: 'العنصر الأول' })
  const wifi = ref<Record<string, boolean>>({ LTR: true, RTL: true })
</script>

<template>
  <div class="md1-docs-bidi-stack">
    <figure v-for="screen in screens" :key="screen.caption" class="md1-docs-bidi-figure">
      <Direction :lang="screen.lang" :rtl="screen.rtl">
        <Md1Toolbar variant="primary">
          <Md1Toolbar.Nav :aria-label="screen.rtl ? 'رجوع' : 'Back'" icon="up" />

          <Md1Toolbar.Title>{{ screen.title }}</Md1Toolbar.Title>

          <Md1Toolbar.Actions>
            <Md1Button :aria-label="screen.rtl ? 'بحث' : 'Search'" icon="search" />

            <Md1Button :aria-label="screen.rtl ? 'خيارات إضافية' : 'More options'" icon="more-vert" />
          </Md1Toolbar.Actions>
        </Md1Toolbar>

        <Md1Tabs v-model="tab[screen.caption]">
          <Md1Tabs.List :label="screen.title">
            <Md1Tabs.Item
              v-for="name in screen.tabs"
              :key="name"
              :label="name"
              :value="name"
            />
          </Md1Tabs.List>
        </Md1Tabs>

        <Md1List :aria-label="screen.title" :lines="2">
          <Md1List.Item v-for="person in screen.people" :key="person.id">
            <Md1List.Avatar>{{ person.initial }}</Md1List.Avatar>

            <Md1List.Content>
              <Md1List.Primary>{{ person.name }}</Md1List.Primary>

              <Md1List.Secondary v-if="person.phone">
                <!-- A phone number is not mirrored: it keeps its own left-to-right order. -->
                <span dir="ltr">{{ person.phone }}</span>
              </Md1List.Secondary>

              <Md1List.Secondary v-else>{{ person.subject }}</Md1List.Secondary>
            </Md1List.Content>

            <Md1List.Action>
              <span class="md1-docs-bidi-time">{{ person.time }}</span>
            </Md1List.Action>
          </Md1List.Item>
        </Md1List>

        <div class="md1-docs-bidi-body">
          <Md1Checkbox v-model="wifi[screen.caption]" :label="screen.wifi" />

          <p class="md1-docs-bidi-caption">{{ screen.progress }}</p>

          <Md1ProgressLinear :aria-label="screen.progress" :value="40" />

          <div class="md1-docs-bidi-actions">
            <Md1Button>{{ screen.cancel }}</Md1Button>

            <Md1Button variant="raised">{{ screen.save }}</Md1Button>
          </div>
        </div>
      </Direction>

      <figcaption class="md1-docs-bidi-label">{{ screen.caption }}</figcaption>
    </figure>
  </div>
</template>

<style>
  /* Two screens side by side where they fit, stacked on a handset. */
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

  .md1-docs-bidi-screen {
    overflow: hidden;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-bidi-time {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    white-space: nowrap;
  }

  .md1-docs-bidi-body {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px) var(--md1-keyline-margin, 16px) var(--md1-spacing-1, 8px);
  }

  .md1-docs-bidi-caption {
    margin: var(--md1-spacing-1, 8px) 0 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* Dialog-style actions: the confirming button sits at the end edge, so it moves left under RTL. */
  .md1-docs-bidi-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--md1-spacing-1, 8px);
    margin-inline-end: calc(-1 * var(--md1-spacing-1, 8px));
  }

  .md1-docs-bidi-label {
    margin-top: var(--md1-spacing-1, 8px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    text-align: center;
  }
</style>
