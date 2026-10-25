<script setup lang="ts">
  import { Md1Icon, Md1List, Md1Switch } from '@paper/md1'
  import { Button } from '@vuetify/v0'
  import { ref } from 'vue'

  const topics = [
    { id: 'science', label: 'Science', tone: 'green' },
    { id: 'design', label: 'Design', tone: 'indigo' },
    { id: 'travel', label: 'Travel', tone: 'orange' },
    { id: 'sport', label: 'Sport', tone: 'cyan' },
    { id: 'food', label: 'Food', tone: 'brown' },
    { id: 'music', label: 'Music', tone: 'red' },
  ] as const

  const bundled = ref<string[]>(['science', 'sport', 'food', 'music'])
  const grid = ref<string[]>(['design', 'travel', 'food', 'music'])
  const list = ref<string[]>(['design', 'travel', 'food'])

  function toggle (picked: string[], id: string) {
    const index = picked.indexOf(id)

    if (index === -1) picked.push(id)
    else picked.splice(index, 1)
  }

  function onBundle (id: string, value: boolean | undefined) {
    if (value !== bundled.value.includes(id)) toggle(bundled.value, id)
  }
</script>

<template>
  <div class="md1-docs-designs">
    <section aria-label="Bundled list" class="md1-docs-designs-pane">
      <h3 class="md1-docs-designs-title">Bundled list</h3>

      <Md1List aria-label="Bundle topics" :lines="2">
        <Md1List.Item
          v-for="topic in topics"
          :key="topic.id"
          class="md1-docs-designs-row"
          :data-off="!bundled.includes(topic.id) || undefined"
        >
          <span aria-hidden="true" class="md1-docs-designs-swatch" :data-tone="topic.tone" />

          <Md1List.Content>
            <Md1List.Primary>{{ topic.label }}</Md1List.Primary>

            <Md1List.Secondary>{{ bundled.includes(topic.id) ? 'Bundled' : 'Shown individually' }}</Md1List.Secondary>
          </Md1List.Content>

          <Md1List.Action>
            <Md1Switch
              :aria-label="`Bundle ${topic.label}`"
              :model-value="bundled.includes(topic.id)"
              @update:model-value="onBundle(topic.id, $event)"
            />
          </Md1List.Action>
        </Md1List.Item>
      </Md1List>
    </section>

    <section aria-label="Grid view" class="md1-docs-designs-pane">
      <h3 class="md1-docs-designs-title">Grid view</h3>

      <div class="md1-docs-designs-grid">
        <Button.Root
          v-for="topic in topics"
          :key="topic.id"
          :aria-pressed="grid.includes(topic.id)"
          class="md1-docs-designs-tile"
          :data-off="!grid.includes(topic.id) || undefined"
          @click="toggle(grid, topic.id)"
        >
          <span class="md1-docs-designs-circle" :data-tone="topic.tone">
            <Md1Icon v-if="grid.includes(topic.id)" name="check" />
          </span>

          <span class="md1-docs-designs-label">{{ topic.label }}</span>
        </Button.Root>
      </div>
    </section>

    <section aria-label="List" class="md1-docs-designs-pane">
      <h3 class="md1-docs-designs-title">List</h3>

      <div class="md1-docs-designs-cards">
        <Button.Root
          v-for="topic in topics"
          :key="topic.id"
          :aria-pressed="list.includes(topic.id)"
          class="md1-docs-designs-card md1-elevation-1"
          :data-off="!list.includes(topic.id) || undefined"
          @click="toggle(list, topic.id)"
        >
          <span aria-hidden="true" class="md1-docs-designs-block" :data-tone="topic.tone" />

          <span class="md1-docs-designs-label">{{ topic.label }}</span>

          <Md1Icon class="md1-docs-designs-mark" :name="list.includes(topic.id) ? 'check-circle' : 'add'" />
        </Button.Root>
      </div>
    </section>
  </div>
</template>

<style>
  /* The three self-select designs side by side, one column on a handset. */
  .md1-docs-designs {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--md1-spacing-3, 24px);
    width: 100%;
  }

  .md1-docs-designs-pane {
    min-width: 0;
    background: var(--md1-background, #FAFAFA);
    border: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-designs-title {
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: 500;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* Tones: the 300 and 400 shades the figure draws; each topic keeps its hue in all three designs. */
  .md1-docs-designs [data-tone='green'] { background: var(--md1-green-400, #66BB6A); }
  .md1-docs-designs [data-tone='indigo'] { background: var(--md1-indigo-400, #5C6BC0); }
  .md1-docs-designs [data-tone='orange'] { background: var(--md1-deep-orange-400, #FF7043); }
  .md1-docs-designs [data-tone='cyan'] { background: var(--md1-cyan-400, #26C6DA); }
  .md1-docs-designs [data-tone='brown'] { background: var(--md1-brown-400, #8D6E63); }
  .md1-docs-designs [data-tone='red'] { background: var(--md1-red-400, #EF5350); }

  /* An unchosen topic recedes: its swatch and its text drop to the disabled ink's weight. */
  .md1-docs-designs [data-off] :is(.md1-docs-designs-swatch, .md1-docs-designs-circle, .md1-docs-designs-block) {
    opacity: 0.38;
  }

  .md1-docs-designs-row[data-off] .md1-list__content {
    opacity: 0.6;
  }

  /* Bundled list: a 40 dp swatch in the avatar slot. */
  .md1-docs-designs-swatch {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    margin-inline-end: var(--md1-spacing-2, 16px);
  }

  /* Grid view: three columns of 72 dp circles with the label under each. */
  .md1-docs-designs-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--md1-spacing-2, 16px) var(--md1-spacing-1, 8px);
    padding: 0 var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
  }

  .md1-docs-designs-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    padding: 0;
    background: none;
    border: 0;
    cursor: pointer;
  }

  .md1-docs-designs-circle {
    display: grid;
    place-items: center;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    color: var(--md1-white, #FFFFFF);
    box-shadow: var(--md1-elevation-2);
  }

  .md1-docs-designs-label {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-subheading-size, 16px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-designs-tile[data-off] .md1-docs-designs-label,
  .md1-docs-designs-card[data-off] .md1-docs-designs-label {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  /* List: card rows with a colour block at the start and the add or check mark at the end. */
  .md1-docs-designs-cards {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    padding: 0 var(--md1-spacing-1, 8px) var(--md1-spacing-2, 16px);
  }

  .md1-docs-designs-card {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    height: 56px;
    padding: 0 var(--md1-spacing-2, 16px) 0 0;
    background: var(--md1-surface, #FFFFFF);
    border: 0;
    border-radius: var(--md1-radius, 2px);
    cursor: pointer;
    overflow: hidden;
  }

  .md1-docs-designs-block {
    align-self: stretch;
    width: 56px;
  }

  .md1-docs-designs-card .md1-docs-designs-label {
    flex: 1 1 auto;
    text-align: start;
  }

  .md1-docs-designs-mark {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-designs-card[data-off] .md1-docs-designs-mark {
    color: var(--md1-icon-inactive, rgba(0, 0, 0, 0.38));
  }

  .md1-docs-designs-tile:focus-visible,
  .md1-docs-designs-card:focus-visible {
    outline: 2px solid var(--md1-primary, #3F51B5);
    outline-offset: 2px;
  }
</style>
