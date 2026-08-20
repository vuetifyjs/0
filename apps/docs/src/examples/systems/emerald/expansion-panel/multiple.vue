<script setup lang="ts">
  import {
    EmExpansionPanel,
    EmExpansionPanelActivator,
    EmExpansionPanelContent,
    EmExpansionPanelCue,
    EmExpansionPanelGroup,
    EmExpansionPanelHeader,
  } from '@paper/emerald'

  import { ref } from 'vue'

  const open = ref<string[]>(['engine'])

  const items = [
    {
      value: 'engine',
      title: 'Engine',
      body: '2.0L turbocharged inline-four, 255 hp, paired with an eight-speed automatic transmission.',
    },
    {
      value: 'dimensions',
      title: 'Dimensions',
      body: '4,720 mm long, 1,850 mm wide, 1,440 mm tall, with a 2,830 mm wheelbase and 480 L of cargo space.',
    },
    {
      value: 'safety',
      title: 'Safety',
      body: 'Adaptive cruise control, lane keeping, blind-spot monitoring, and automatic emergency braking are standard on every trim.',
    },
  ]
</script>

<template>
  <div class="emerald-docs-stack">
    <EmExpansionPanelGroup v-model="open" multiple>
      <EmExpansionPanel v-for="item in items" :key="item.value" :value="item.value">
        <EmExpansionPanelHeader>
          <EmExpansionPanelActivator>
            {{ item.title }}

            <EmExpansionPanelCue />
          </EmExpansionPanelActivator>
        </EmExpansionPanelHeader>

        <EmExpansionPanelContent>
          {{ item.body }}
        </EmExpansionPanelContent>
      </EmExpansionPanel>
    </EmExpansionPanelGroup>

    <p class="emerald-docs-note">Open: {{ open.length > 0 ? open.join(', ') : 'none' }}</p>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    max-width: 520px;
  }

  .emerald-docs-note {
    margin: 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }
</style>
