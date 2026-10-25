<script setup lang="ts">
  import { Md1Button, Md1Card, Md1List, Md1Menu, Md1NavigationDrawer, Md1Toolbar, Md1ToggleButtons } from '@paper/md1'
  import { useElementSize } from '@vuetify/v0'
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  // The frame stands in for the window: the layout reads its width, not the viewport's.
  const widths: Record<string, string> = { handset: '360px', tablet: '600px', fill: '100%' }
  const size = shallowRef('fill')

  const frame = useTemplateRef<HTMLElement>('frame')
  const { width } = useElementSize(frame)

  // Over 600 dp the layout has room for a second level of hierarchy.
  const wide = toRef(() => width.value >= 600)

  const page = shallowRef('photos')
  const details = shallowRef(false)
  const chosen = shallowRef('')

  const actions = [
    { icon: 'share', label: 'Share' },
    { icon: 'edit', label: 'Edit' },
    { icon: 'delete', label: 'Delete' },
  ]
</script>

<template>
  <div class="md1-docs-layout-pattern-stack">
    <Md1ToggleButtons v-model="size" label="Window width" mandatory>
      <Md1ToggleButtons.Item value="handset">360 dp</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="tablet">600 dp</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="fill">Fill</Md1ToggleButtons.Item>
    </Md1ToggleButtons>

    <div ref="frame" class="md1-docs-screen md1-docs-layout-pattern-screen" :style="{ maxWidth: widths[size] }">
      <Md1NavigationDrawer v-if="wide" type="permanent">
        <Md1NavigationDrawer.Content>
          <Md1List v-model="page">
            <Md1List.Item value="photos">
              <Md1List.Icon name="photo" />

              Photos
            </Md1List.Item>

            <Md1List.Item value="shared">
              <Md1List.Icon name="share" />

              Shared
            </Md1List.Item>

            <Md1List.Item value="places">
              <Md1List.Icon name="place" />

              Places
            </Md1List.Item>
          </Md1List>
        </Md1NavigationDrawer.Content>
      </Md1NavigationDrawer>

      <div class="md1-docs-layout-pattern-column">
        <Md1Toolbar variant="primary">
          <Md1Toolbar.Nav v-if="!wide" />

          <Md1Toolbar.Title>Glacier lake</Md1Toolbar.Title>

          <Md1Toolbar.Actions>
            <Md1Button aria-label="Search" icon="search" />

            <template v-if="wide">
              <Md1Button
                v-for="action in actions"
                :key="action.icon"
                :aria-label="action.label"
                :icon="action.icon"
                @click="chosen = action.label"
              />
            </template>

            <Md1Menu v-else>
              <Md1Menu.Activator v-slot="{ attrs }">
                <Md1Button v-bind="attrs" aria-label="More options" icon="more-vert" />
              </Md1Menu.Activator>

              <Md1Menu.Content>
                <Md1Menu.Item v-for="action in actions" :key="action.icon" @select="chosen = action.label">{{ action.label }}</Md1Menu.Item>
              </Md1Menu.Content>
            </Md1Menu>
          </Md1Toolbar.Actions>
        </Md1Toolbar>

        <div class="md1-docs-layout-pattern-body">
          <Md1Card class="md1-docs-layout-pattern-card">
            <Md1Card.Title>Glacier lake</Md1Card.Title>

            <Md1Card.Subtitle>Taken 12 June, 6:40 AM</Md1Card.Subtitle>

            <Md1Card.Supporting v-if="wide || details">
              1/250 s at f/8, ISO 100, 35 mm. 2,410 m above sea level, 46.55° N, 7.98° E.
            </Md1Card.Supporting>

            <Md1Card.Actions v-if="!wide">
              <Md1Button @click="details = !details">{{ details ? 'Hide details' : 'Details' }}</Md1Button>
            </Md1Card.Actions>
          </Md1Card>

          <p class="md1-docs-layout-pattern-note" role="status">{{ width ? `${Math.round(width)} dp window` : '' }}{{ chosen ? `, ${chosen}` : '' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  /* Shared by the responsive pattern examples: a width switch over a frame that stands in for the window. */
  .md1-docs-layout-pattern-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    width: 100%;
  }

  .md1-docs-layout-pattern-screen {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    /* An outline, not a border, so the measured width is the frame's full width. */
    outline: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    background: var(--md1-background, #FAFAFA);
    transition: max-width var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-layout-pattern-column {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  .md1-docs-layout-pattern-body {
    flex: 1 1 auto;
    padding: var(--md1-spacing-2, 16px) var(--md1-keyline-margin, 16px);
    overflow-y: auto;
  }

  .md1-docs-layout-pattern-card {
    max-width: 480px;
  }

  .md1-docs-layout-pattern-note {
    margin: var(--md1-spacing-2, 16px) 0 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
