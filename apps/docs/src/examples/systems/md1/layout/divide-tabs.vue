<script setup lang="ts">
  import { Md1Subheader, Md1Tabs, Md1Toolbar, Md1ToggleButtons } from '@paper/md1'
  import { useElementSize } from '@vuetify/v0'
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  const widths: Record<string, string> = { handset: '360px', tablet: '600px', fill: '100%' }
  const size = shallowRef('fill')

  const frame = useTemplateRef<HTMLElement>('frame')
  const { width } = useElementSize(frame)
  const wide = toRef(() => width.value >= 600)

  const siblings = [
    { value: 'flight', label: 'Flight', lines: ['Fri 14 June, 07:10', 'SFO to LIS, 11 h 05 min', 'Seat 23A'] },
    { value: 'hotel', label: 'Hotel', lines: ['Casa do Largo, 3 nights', 'Check in from 15:00', 'Breakfast included'] },
    { value: 'car', label: 'Car', lines: ['Pick up at LIS, 10:30', 'Compact, manual', 'Return Mon 17 June'] },
  ]

  const tab = shallowRef('flight')
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
        <Md1Toolbar variant="primary">
          <Md1Toolbar.Nav icon="up" />

          <Md1Toolbar.Title>Lisbon trip</Md1Toolbar.Title>
        </Md1Toolbar>

        <!-- Siblings behind tabs on a handset; divided into columns of one view once they fit. -->
        <Md1Tabs v-if="!wide" v-model="tab" class="md1-docs-layout-divide-tabs">
          <Md1Tabs.List label="Bookings">
            <Md1Tabs.Item
              v-for="sibling in siblings"
              :key="sibling.value"
              :label="sibling.label"
              :value="sibling.value"
            />
          </Md1Tabs.List>

          <Md1Tabs.Panel
            v-for="sibling in siblings"
            :key="sibling.value"
            class="md1-docs-layout-divide-tab-panel"
            :value="sibling.value"
          >
            <p v-for="line in sibling.lines" :key="line" class="md1-type-body-1">{{ line }}</p>
          </Md1Tabs.Panel>
        </Md1Tabs>

        <div v-else class="md1-docs-layout-divide-columns">
          <section
            v-for="sibling in siblings"
            :key="sibling.value"
            :aria-label="sibling.label"
            class="md1-docs-layout-divide-column"
          >
            <Md1Subheader>{{ sibling.label }}</Md1Subheader>

            <p v-for="line in sibling.lines" :key="line" class="md1-type-body-1">{{ line }}</p>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-layout-divide-tabs {
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-layout-divide-tab-panel {
    padding: var(--md1-spacing-1, 8px) var(--md1-keyline-margin, 16px);
  }

  .md1-docs-layout-divide-columns {
    display: grid;
    flex: 1 1 auto;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-layout-divide-column + .md1-docs-layout-divide-column {
    border-inline-start: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-layout-divide-column > p {
    padding-inline: var(--md1-keyline-margin, 16px);
  }

  :is(.md1-docs-layout-divide-tab-panel, .md1-docs-layout-divide-column) > p {
    margin: 0 0 var(--md1-spacing-1, 8px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
