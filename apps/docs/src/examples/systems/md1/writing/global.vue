<script setup lang="ts">
  import { Md1Button, Md1Icon, Md1List, Md1Toolbar } from '@paper/md1'
  import { useHead } from '@unhead/vue'

  // Material Design 1 loads no fonts; the docs load the Noto families these scripts need.
  useHead({
    link: [{
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&family=Noto+Sans+JP:wght@400;500&family=Noto+Sans+Thai:wght@400;700&family=Roboto:wght@400;500&display=swap',
    }],
  })

  const DATES = [new Date(2014, 0, 9), new Date(2014, 0, 17), new Date(2014, 0, 28)]

  const SCREENS = [
    { id: 'en', name: 'English', dir: 'ltr', title: 'Inbox', search: 'Search', folders: ['Photos', 'Recipes', 'Work'] },
    { id: 'ja', name: 'Japanese', dir: 'ltr', title: '受信トレイ', search: '検索', folders: ['写真', 'レシピ', '仕事'] },
    { id: 'th', name: 'Thai', dir: 'ltr', title: 'กล่องจดหมาย', search: 'ค้นหา', folders: ['รูปภาพ', 'สูตรอาหาร', 'งาน'] },
    { id: 'ar', name: 'Arabic, right to left', dir: 'rtl', title: 'البريد الوارد', search: 'بحث', folders: ['الصور', 'الوصفات', 'العمل'] },
  ] as const

  const screens = SCREENS.map(screen => {
    const format = new Intl.DateTimeFormat(screen.id, { dateStyle: 'medium' })

    return {
      ...screen,
      items: screen.folders.map((folder, index) => ({ folder, date: format.format(DATES[index]) })),
    }
  })
</script>

<template>
  <div class="md1-docs-writing-global">
    <figure v-for="screen in screens" :key="screen.id" class="md1-docs-writing-global-item">
      <div class="md1-docs-writing-global-screen" :dir="screen.dir" :lang="screen.id">
        <Md1Toolbar>
          <Md1Toolbar.Nav />

          <Md1Toolbar.Title>{{ screen.title }}</Md1Toolbar.Title>

          <Md1Toolbar.Actions>
            <Md1Button :aria-label="screen.search" icon="search" />
          </Md1Toolbar.Actions>
        </Md1Toolbar>

        <Md1List :lines="2">
          <Md1List.Item v-for="item in screen.items" :key="item.folder">
            <Md1List.Avatar>
              <Md1Icon name="folder" />
            </Md1List.Avatar>

            <Md1List.Content>
              <Md1List.Primary>{{ item.folder }}</Md1List.Primary>

              <Md1List.Secondary>{{ item.date }}</Md1List.Secondary>
            </Md1List.Content>

            <Md1List.Action>
              <Md1Icon name="chevron-right" />
            </Md1List.Action>
          </Md1List.Item>
        </Md1List>
      </div>

      <figcaption class="md1-docs-writing-rule">{{ screen.name }}</figcaption>
    </figure>
  </div>
</template>

<style>
  .md1-docs-writing-global {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
    gap: var(--md1-spacing-3, 24px) var(--md1-spacing-2, 16px);
    width: 100%;
  }

  .md1-docs-writing-global-item {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    min-width: 0;
    margin: 0;
  }

  .md1-docs-writing-global-screen {
    overflow: clip;
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  /*
   * The script rules name "Noto Sans CJK" and "Noto Sans", the families a
   * platform installs. Google Fonts serves them per script, so the docs put
   * those names in the stack; the extra class outranks the :lang() rule.
   */
  .md1-docs-writing-global :lang(ja) {
    --md1-font-family: Roboto, "Noto Sans JP", "Noto Sans CJK", Noto, sans-serif;
  }

  .md1-docs-writing-global :lang(th) {
    --md1-font-family: Roboto, "Noto Sans Thai", "Noto Sans", Noto, sans-serif;
  }

  .md1-docs-writing-global :lang(ar) {
    --md1-font-family: Roboto, "Noto Sans Arabic", "Noto Sans", Noto, sans-serif;
  }

  .md1-docs-writing-rule {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    line-height: 16px;
    letter-spacing: var(--md1-type-caption-tracking, 0.02em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
