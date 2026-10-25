<script setup lang="ts">
  import { Md1BottomNavigation, Md1Button, Md1List } from '@paper/md1'
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  const destinations = [
    { value: 'recents', label: 'Recents', icon: 'history', items: ['Brunch this weekend?', 'Summer BBQ', 'Oui oui', 'Birthday gift', 'Recipe to try', 'Flight confirmation', 'Book club', 'Weekend hike', 'Movie night', 'Gym schedule', 'Concert tickets', 'Garden plans'] },
    { value: 'favorites', label: 'Favorites', icon: 'favorite', items: ['Ali Connors', 'Alex Nelson', 'Sandra Adams', 'Trevor Hansen', 'Britta Holt', 'David Park', 'Mia Chen', 'Noah Reyes', 'Olivia Grant', 'Liam Brooks', 'Emma Stone', 'Lucas Hart'] },
    { value: 'nearby', label: 'Nearby', icon: 'place', items: ['Cafe Basilico', 'Blue Bottle Coffee', 'Tartine Bakery', 'City Lights Books', 'Dolores Park', 'Ferry Building', 'Mission Library', 'Pier 39', 'Golden Gate Park', 'Coit Tower', 'Lands End', 'Twin Peaks'] },
  ] as const

  const view = shallowRef<string>('recents')
  const detail = shallowRef<string | null>(null)
  const scroller = useTemplateRef<HTMLElement>('scroller')

  const current = toRef(() => destinations.find(item => item.value === view.value) ?? destinations[0])

  function onAction (value: string) {
    // Reselecting the active destination returns its view to the top.
    if (value === view.value) {
      detail.value = null
      scroller.value?.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Switching destinations resets the task: the new view opens at its root.
    detail.value = null
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-bottom-nav-views">
    <Transition name="md1-docs-crossfade">
      <div :key="`${view}-${detail ?? 'root'}`" ref="scroller" class="md1-docs-bottom-nav-view-pane">
        <div v-if="detail" class="md1-docs-bottom-nav-detail">
          <div class="md1-docs-bottom-nav-detail-bar">
            <Md1Button aria-label="Back" icon="arrow-back" @click="detail = null" />

            <span class="md1-type-title">{{ detail }}</span>
          </div>

          <p class="md1-docs-bottom-nav-detail-text md1-type-body-1">
            Opened from {{ current.label }}. Switch destinations and come back: the view starts again at the {{ current.label }} list.
          </p>
        </div>

        <Md1List v-else :aria-label="current.label">
          <Md1List.Item v-for="item in current.items" :key="item" @click="detail = item">
            <Md1List.Content>
              <Md1List.Primary>{{ item }}</Md1List.Primary>
            </Md1List.Content>
          </Md1List.Item>
        </Md1List>
      </div>
    </Transition>

    <Md1BottomNavigation v-model="view" aria-label="Main">
      <Md1BottomNavigation.Action
        v-for="item in destinations"
        :key="item.value"
        :icon="item.icon"
        :label="item.label"
        :value="item.value"
        @click="onAction(item.value)"
      />
    </Md1BottomNavigation>
  </div>
</template>

<style>
  .md1-docs-bottom-nav-views {
    background: var(--md1-background, #FAFAFA);
  }

  /* Each destination's view fills the screen above the 56 dp bar and scrolls on its own. */
  .md1-docs-bottom-nav-view-pane {
    position: absolute;
    inset: 0 0 56px;
    overflow-y: auto;
    overscroll-behavior: contain;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-bottom-nav-detail-bar {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-bottom-nav-detail-text {
    margin: 0;
    padding: 0 var(--md1-spacing-2, 16px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* Views cross-fade: the outgoing view fades out while the incoming one fades in, over the standard duration. */
  .md1-docs-crossfade-enter-active,
  .md1-docs-crossfade-leave-active {
    transition: opacity var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-crossfade-enter-from,
  .md1-docs-crossfade-leave-to {
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .md1-docs-crossfade-enter-active,
    .md1-docs-crossfade-leave-active {
      transition: none;
    }
  }
</style>
