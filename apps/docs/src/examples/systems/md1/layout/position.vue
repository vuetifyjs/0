<script setup lang="ts">
  import { Md1BottomSheet, Md1Button, Md1Fab, Md1Menu, Md1Toolbar, Md1ToggleButtons } from '@paper/md1'
  import { useElementSize } from '@vuetify/v0'
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  const widths: Record<string, string> = { handset: '360px', tablet: '600px', fill: '100%' }
  const size = shallowRef('fill')

  const frame = useTemplateRef<HTMLElement>('frame')
  const { width } = useElementSize(frame)
  const wide = toRef(() => width.value >= 600)

  const targets = [
    { icon: 'email', label: 'Email' },
    { icon: 'link', label: 'Copy link' },
    { icon: 'cloud-upload', label: 'Upload' },
  ]

  const chosen = shallowRef('')
</script>

<template>
  <div class="md1-docs-layout-pattern-stack">
    <Md1ToggleButtons v-model="size" label="Window width" mandatory>
      <Md1ToggleButtons.Item value="handset">360 dp</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="tablet">600 dp</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="fill">Fill</Md1ToggleButtons.Item>
    </Md1ToggleButtons>

    <div ref="frame" class="md1-docs-screen md1-docs-layout-pattern-screen" :style="{ maxWidth: widths[size] }">
      <div class="md1-docs-layout-pattern-column">
        <!-- From 600 dp the bar extends, and the FAB moves onto its seam, next to the content it acts on. -->
        <div v-if="wide" class="md1-docs-layout-position-header" data-fab-host>
          <span class="md1-docs-layout-position-title">Lisbon, Portugal</span>

          <Md1Fab aria-label="Add to trip" icon="add" position="seam" />
        </div>

        <Md1Toolbar v-else variant="primary">
          <Md1Toolbar.Nav icon="up" />

          <Md1Toolbar.Title>Lisbon, Portugal</Md1Toolbar.Title>
        </Md1Toolbar>

        <div class="md1-docs-layout-position-body" :data-wide="wide || undefined">
          <p class="md1-type-body-1">Three nights from Friday. Two adults, one room, breakfast included.</p>

          <!-- The same actions: a bottom sheet on a handset, a menu beside the button on a wider window. -->
          <Md1BottomSheet v-if="!wide">
            <Md1BottomSheet.Activator v-slot="{ attrs }">
              <Md1Button v-bind="attrs">Share</Md1Button>
            </Md1BottomSheet.Activator>

            <Md1BottomSheet.Item
              v-for="target in targets"
              :key="target.icon"
              :icon="target.icon"
              @click="chosen = target.label"
            >
              {{ target.label }}
            </Md1BottomSheet.Item>
          </Md1BottomSheet>

          <Md1Menu v-else>
            <Md1Menu.Activator v-slot="{ attrs }">
              <Md1Button v-bind="attrs">Share</Md1Button>
            </Md1Menu.Activator>

            <Md1Menu.Content>
              <Md1Menu.Item v-for="target in targets" :key="target.icon" @select="chosen = target.label">{{ target.label }}</Md1Menu.Item>
            </Md1Menu.Content>
          </Md1Menu>

          <p v-if="chosen" class="md1-docs-layout-pattern-note" role="status">{{ chosen }}</p>
        </div>
      </div>

      <Md1Fab v-if="!wide" aria-label="Add to trip" icon="add" />
    </div>
  </div>
</template>

<style>
  .md1-docs-layout-position-header {
    position: relative;
    display: flex;
    flex: 0 0 auto;
    align-items: flex-end;
    box-sizing: border-box;
    height: calc(2 * var(--md1-increment, 64px));
    padding: var(--md1-spacing-2, 16px) var(--md1-keyline-content, 80px);
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-docs-layout-position-title {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-type-title-weight, 500);
  }

  .md1-docs-layout-position-body {
    padding: var(--md1-spacing-2, 16px) var(--md1-keyline-margin, 16px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-layout-position-body[data-wide] {
    padding-top: var(--md1-spacing-5, 40px);
    padding-inline-start: var(--md1-keyline-content, 80px);
  }

  .md1-docs-layout-position-body > p {
    margin: 0 0 var(--md1-spacing-1, 8px);
  }
</style>
