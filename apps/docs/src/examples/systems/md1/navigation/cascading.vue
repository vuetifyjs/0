<script setup lang="ts">
  import { Md1Icon, Md1List, Md1NavigationDrawer } from '@paper/md1'
  import { shallowRef, toRef } from 'vue'

  const sections: Record<string, string[]> = {
    World: ['Africa', 'Americas', 'Asia Pacific', 'Europe', 'Middle East'],
    Business: ['Markets', 'Economy', 'Companies'],
    Sport: ['Football', 'Tennis', 'Cycling'],
  }

  const top = ['World', 'Politics', 'Business', 'Technology', 'Sport', 'Arts']

  const section = shallowRef('World')
  const cascade = shallowRef('')
  const page = shallowRef('World')

  const children = toRef(() => sections[cascade.value] ?? [])

  // A section with children opens its level beside the drawer; one without is a page of its own.
  function onSection (name: string) {
    section.value = name

    if (sections[name]) {
      cascade.value = cascade.value === name ? '' : name
    } else {
      cascade.value = ''
      page.value = name
    }
  }

  // Choosing a subsection navigates and closes the level it came from.
  function onPage (name: string) {
    page.value = `${cascade.value}: ${name}`
    cascade.value = ''
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-cascade">
    <Md1NavigationDrawer aria-label="Sections" type="permanent">
      <Md1NavigationDrawer.Content>
        <Md1List :model-value="section">
          <Md1List.Item v-for="name in top" :key="name" :value="name" @click="onSection(name)">
            {{ name }}

            <Md1List.Action v-if="sections[name]">
              <Md1Icon class="md1-docs-cascade-cue" name="chevron-right" />
            </Md1List.Action>
          </Md1List.Item>
        </Md1List>
      </Md1NavigationDrawer.Content>
    </Md1NavigationDrawer>

    <div class="md1-docs-cascade-main">
      <p class="md1-docs-cascade-text" role="status">{{ page }}</p>

      <nav
        v-if="cascade"
        :aria-label="cascade"
        class="md1-docs-cascade-level"
      >
        <Md1List>
          <Md1List.Item v-for="name in children" :key="name" @click="onPage(name)">
            {{ name }}
          </Md1List.Item>
        </Md1List>
      </nav>
    </div>
  </div>
</template>

<style>
  /* A desktop window: a pinned drawer, and the next level cascading out of it over the content. */
  .md1-docs-screen.md1-docs-cascade {
    display: flex;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-cascade-main {
    position: relative;
    flex: 1 1 auto;
    min-width: 0;
  }

  .md1-docs-cascade-text {
    margin: 0;
    padding: var(--md1-spacing-3, 24px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-type-title-weight, 500);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* The cascaded level: a second sheet, one increment narrower than the drawer, at the drawer's 16 dp elevation. */
  .md1-docs-cascade-level {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    width: min(100%, calc(4 * var(--md1-increment, 56px)));
    overflow-y: auto;
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-16);
  }

  .md1-docs-cascade-cue {
    color: var(--md1-icon-inactive, rgba(0, 0, 0, 0.38));
  }
</style>
