<script setup lang="ts">
  import { QuList, QuNavigationDrawer } from '@paper/quantum'
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
  <div class="quantum-docs-screen quantum-docs-nav-split">
    <QuNavigationDrawer aria-label="Library" type="permanent">
      <QuNavigationDrawer.Content>
        <QuList v-model="page">
          <QuList.Group
            v-for="item in sections"
            :key="item.id"
            :icon="item.icon"
            :model-value="section === item.id"
            :title="item.title"
            @update:model-value="onSection(item.id, $event)"
          >
            <QuList.Item v-for="name in item.pages" :key="name" :value="name">
              {{ name }}
            </QuList.Item>
          </QuList.Group>
        </QuList>
      </QuNavigationDrawer.Content>
    </QuNavigationDrawer>

    <p class="quantum-docs-nav-text" role="status">Current page: {{ page }}</p>
  </div>
</template>

<style>
  /* A tablet-width screen: a pinned drawer beside the content. */
  .quantum-docs-nav-split {
    display: flex;
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-nav-text {
    flex: 1 1 auto;
    min-width: 0;
    margin: 0;
    padding: var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
