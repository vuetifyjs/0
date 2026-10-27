<script setup lang="ts">
  import { Md1BottomNavigation, Md1List, Md1NavigationDrawer, Md1Toolbar, md1Breakpoints } from '@paper/md1'
  import { useElementSize } from '@vuetify/v0'
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  const destinations = [
    { value: 'recents', label: 'Recents', icon: 'history', text: 'Calls and messages from the last seven days.' },
    { value: 'favorites', label: 'Favorites', icon: 'favorite', text: 'The people you reach most, pinned to the top.' },
    { value: 'nearby', label: 'Nearby', icon: 'place', text: 'Cafes, parks and shops within a ten minute walk.' },
  ] as const

  const view = shallowRef<string>('recents')
  const open = shallowRef(false)

  // The example's own width, not the viewport's, so dragging the preview narrower swaps the navigation.
  const screen = useTemplateRef<HTMLElement>('screen')
  const { width } = useElementSize(screen)

  const large = toRef(() => width.value >= md1Breakpoints[600])
  const current = toRef(() => destinations.find(item => item.value === view.value) ?? destinations[0])
</script>

<template>
  <div ref="screen" class="md1-docs-screen md1-docs-bottom-nav-rail">
    <Md1NavigationDrawer
      v-if="large"
      id="rail-drawer"
      v-model="open"
      mini
      type="persistent"
    >
      <Md1NavigationDrawer.Content>
        <Md1List v-model="view" aria-label="Main">
          <Md1List.Item v-for="item in destinations" :key="item.value" :value="item.value">
            <Md1List.Icon :name="item.icon" />

            {{ item.label }}
          </Md1List.Item>
        </Md1List>
      </Md1NavigationDrawer.Content>
    </Md1NavigationDrawer>

    <div class="md1-docs-bottom-nav-rail-column">
      <Md1Toolbar variant="primary">
        <Md1Toolbar.Nav
          v-if="large"
          aria-controls="rail-drawer"
          aria-label="Expand navigation"
          :open
          @click="open = !open"
        />

        <Md1Toolbar.Title>{{ current.label }}</Md1Toolbar.Title>
      </Md1Toolbar>

      <p class="md1-docs-bottom-nav-rail-text">{{ current.text }}</p>
    </div>

    <Md1BottomNavigation v-if="!large" v-model="view" aria-label="Main">
      <Md1BottomNavigation.Action
        v-for="item in destinations"
        :key="item.value"
        :icon="item.icon"
        :label="item.label"
        :value="item.value"
      />
    </Md1BottomNavigation>
  </div>
</template>

<style>
  /* The rail sits beside the content from 600 px; below it the content takes the screen and the bar floats over its bottom edge. */
  .md1-docs-bottom-nav-rail {
    display: flex;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-bottom-nav-rail-column {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
  }

  .md1-docs-bottom-nav-rail-text {
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
