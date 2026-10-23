<script setup lang="ts">
  import { Md1List, Md1NavigationDrawer } from '@paper/md1'
  import { shallowRef } from 'vue'

  const sections = [
    { id: 'photos', title: 'Photos', icon: 'photo', pages: ['Albums', 'People', 'Places'] },
    { id: 'music', title: 'Music', icon: 'play-arrow', pages: ['Songs', 'Artists', 'Playlists'] },
    { id: 'files', title: 'Files', icon: 'folder', pages: ['Documents', 'Downloads'] },
  ] as const

  const section = shallowRef<string>('photos')
  const page = shallowRef('Albums')

  function onSection (id: string, open: boolean | undefined) {
    section.value = open ? id : ''
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-nav-split">
    <Md1NavigationDrawer aria-label="Library" type="permanent">
      <Md1NavigationDrawer.Content>
        <Md1List v-model="page">
          <Md1List.Group
            v-for="item in sections"
            :key="item.id"
            :icon="item.icon"
            :model-value="section === item.id"
            :title="item.title"
            @update:model-value="onSection(item.id, $event)"
          >
            <Md1List.Item v-for="name in item.pages" :key="name" :value="name">
              {{ name }}
            </Md1List.Item>
          </Md1List.Group>
        </Md1List>
      </Md1NavigationDrawer.Content>
    </Md1NavigationDrawer>

    <p class="md1-docs-nav-text" role="status">Current page: {{ page }}</p>
  </div>
</template>

<style>
  /* A tablet-width screen: a pinned drawer beside the content. */
  .md1-docs-nav-split {
    display: flex;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-nav-text {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
