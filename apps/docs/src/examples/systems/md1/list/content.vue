<script setup lang="ts">
  import { Md1IconToggle, Md1List, Md1Subheader, Md1Switch, Md1ToggleButtons } from '@paper/md1'
  import { ref, shallowRef, toRef } from 'vue'

  const content = shallowRef('text')
  const dense = shallowRef(false)

  const counts = [
    { lines: 1, name: 'Single-line' },
    { lines: 2, name: 'Two-line' },
    { lines: 3, name: 'Three-line' },
  ] as const

  const people = [
    { id: 'ali', name: 'Ali Connors', initial: 'A', subject: 'Brunch this weekend?', body: 'I\'ll be in your neighborhood doing errands this weekend. Do you want to meet for brunch, or later in the afternoon?' },
    { id: 'sandra', name: 'Sandra Adams', initial: 'S', subject: 'Summer BBQ', body: 'Wish I could come, but I\'m out of town this weekend. Next time, save me a burger and a seat by the grill.' },
    { id: 'trevor', name: 'Trevor Hansen', initial: 'T', subject: 'Oui oui', body: 'Do you have Paris recommendations? Have you ever been? I\'m going next month and want to see more than the tower.' },
  ]

  const starred = ref<Record<string, boolean>>({ sandra: true })

  const icon = toRef(() => content.value === 'icon')
  const avatar = toRef(() => content.value === 'avatar' || content.value === 'both')
  const action = toRef(() => content.value === 'both')
</script>

<template>
  <div class="md1-docs-list-content">
    <div class="md1-docs-list-content-controls">
      <Md1ToggleButtons v-model="content" label="Tile content" mandatory>
        <Md1ToggleButtons.Item value="text">Text</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item value="icon">Icon</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item value="avatar">Avatar</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item value="both">Avatar + icon</Md1ToggleButtons.Item>
      </Md1ToggleButtons>

      <Md1Switch v-model="dense" label="Dense" />
    </div>

    <div class="md1-docs-list-content-sheets">
      <div
        v-for="count in counts"
        :key="count.lines"
        class="md1-docs-list-content-sheet md1-elevation-2"
      >
        <Md1Subheader>{{ count.name }}</Md1Subheader>

        <Md1List :aria-label="`${count.name} list`" :dense :lines="count.lines">
          <Md1List.Item v-for="person in people" :key="person.id">
            <Md1List.Icon v-if="icon" name="account-circle" />

            <Md1List.Avatar v-else-if="avatar">{{ person.initial }}</Md1List.Avatar>

            <Md1List.Content>
              <Md1List.Primary>{{ count.lines === 3 ? person.subject : person.name }}</Md1List.Primary>

              <Md1List.Secondary v-if="count.lines === 2">{{ person.subject }}</Md1List.Secondary>

              <Md1List.Secondary v-else-if="count.lines === 3">{{ person.name }} — {{ person.body }}</Md1List.Secondary>
            </Md1List.Content>

            <Md1List.Action v-if="action">
              <Md1IconToggle
                v-model="starred[person.id]"
                :aria-label="`Star ${person.name}`"
                icon="star-border"
                icon-on="star"
              />
            </Md1List.Action>
          </Md1List.Item>
        </Md1List>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-list-content {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-3, 24px);
    width: 100%;
  }

  .md1-docs-list-content-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px);
  }

  /* Three handset columns side by side where they fit, stacked on a phone. */
  .md1-docs-list-content-sheets {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    align-items: start;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-list-content-sheet {
    box-sizing: border-box;
    min-width: 0;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }
</style>
