<script setup lang="ts">
  import { Md1List, Md1NavigationDrawer, Md1Tabs, Md1Toolbar } from '@paper/md1'
  import { useResizeObserver } from '@vuetify/v0'
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  const sections = [
    { id: 'news', title: 'News', icon: 'language', pages: ['Top stories', 'Local', 'World'] },
    { id: 'sport', title: 'Sport', icon: 'star', pages: ['Football', 'Tennis', 'Cycling'] },
    { id: 'culture', title: 'Culture', icon: 'favorite', pages: ['Books', 'Film', 'Music'] },
  ] as const

  const frame = useTemplateRef<HTMLElement>('frame')
  const width = shallowRef(0)

  useResizeObserver(frame, entries => {
    width.value = entries[0]?.contentRect.width ?? 0
  })

  // From 600 px the frame is a desktop window: the drawer is pinned and nests the second level.
  const desktop = toRef(() => width.value >= 600)

  const open = shallowRef(false)
  const section = shallowRef('news')
  const expanded = shallowRef('news')
  const tab = shallowRef('Top stories')

  const current = toRef(() => sections.find(item => item.id === section.value) ?? sections[0])

  function onSection (id: string) {
    section.value = id
    expanded.value = id
    tab.value = sections.find(item => item.id === id)?.pages[0] ?? ''
    open.value = false
  }

  function onGroup (id: string, value: boolean | undefined) {
    expanded.value = value ? id : ''
  }

  function onPage (id: string, page: unknown) {
    section.value = id
    tab.value = String(page)
  }
</script>

<template>
  <div ref="frame" class="md1-docs-screen md1-docs-combined" :data-desktop="desktop || undefined">
    <Md1NavigationDrawer v-if="desktop" aria-label="Sections" type="permanent">
      <Md1NavigationDrawer.Content>
        <Md1List :model-value="tab">
          <Md1List.Group
            v-for="item in sections"
            :key="item.id"
            :icon="item.icon"
            :model-value="expanded === item.id"
            :title="item.title"
            @update:model-value="onGroup(item.id, $event)"
          >
            <Md1List.Item
              v-for="page in item.pages"
              :key="page"
              :value="page"
              @click="onPage(item.id, page)"
            >
              {{ page }}
            </Md1List.Item>
          </Md1List.Group>
        </Md1List>
      </Md1NavigationDrawer.Content>
    </Md1NavigationDrawer>

    <Md1NavigationDrawer v-else v-model="open" aria-label="Sections">
      <Md1NavigationDrawer.Content>
        <Md1List :model-value="section">
          <Md1List.Item v-for="item in sections" :key="item.id" :value="item.id" @click="onSection(item.id)">
            <Md1List.Icon :name="item.icon" />

            {{ item.title }}
          </Md1List.Item>
        </Md1List>
      </Md1NavigationDrawer.Content>
    </Md1NavigationDrawer>

    <div class="md1-docs-combined-main">
      <Md1Tabs v-model="tab">
        <Md1Toolbar variant="primary">
          <Md1Toolbar.Nav v-if="!desktop" aria-label="Open sections" :open @click="open = true" />

          <Md1Toolbar.Title>{{ current.title }}</Md1Toolbar.Title>

          <Md1Toolbar.Extension>
            <Md1Tabs.List :label="current.title">
              <Md1Tabs.Item v-for="page in current.pages" :key="page" :label="page" :value="page" />
            </Md1Tabs.List>
          </Md1Toolbar.Extension>
        </Md1Toolbar>

        <Md1Tabs.Panel v-for="page in current.pages" :key="page" class="md1-docs-combined-panel" :value="page">
          {{ current.title }}, {{ page }}: the drawer chooses the section, the tabs choose the view inside it.
        </Md1Tabs.Panel>
      </Md1Tabs>
    </div>
  </div>
</template>

<style>
  /* A handset or tablet frame below 600 px; a desktop window with a pinned drawer from there. */
  .md1-docs-screen.md1-docs-combined {
    display: flex;
    height: 400px;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-combined-main {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
  }

  .md1-docs-combined-panel {
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
