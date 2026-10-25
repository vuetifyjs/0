<script setup lang="ts">
  import { Md1Divider, Md1List, Md1NavigationDrawer, Md1Toolbar, Md1ToggleButtons } from '@paper/md1'
  import { useElementSize } from '@vuetify/v0'
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  // The frame is laid out at a nominal window width and scaled down to fit the
  // example, so the three-pane form can be seen in a narrow docs column.
  const sizes: Record<string, number> = { handset: 360, tablet: 720, desktop: 1280 }
  const size = shallowRef('desktop')
  const nominal = toRef(() => sizes[size.value] ?? 360)

  const stage = useTemplateRef<HTMLElement>('stage')
  const { width } = useElementSize(stage)
  const zoom = toRef(() => width.value ? Math.min(1, width.value / nominal.value) : 1)

  // Under 600 dp: one level. From 600: list and detail. From 960: navigation, list, detail and a right panel.
  const panes = toRef(() => nominal.value >= 960 ? 3 : (nominal.value >= 600 ? 2 : 1))

  const messages = [
    { id: 'brunch', from: 'Ali Connors', email: 'ali@example.com', subject: 'Brunch this weekend?', body: 'I\'ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?' },
    { id: 'summer', from: 'Trevor Hansen', email: 'trevor@example.com', subject: 'Summer BBQ', body: 'Wish I could come, but I\'m out of town this weekend.' },
    { id: 'oui', from: 'Sandra Adams', email: 'sandra@example.com', subject: 'Oui oui', body: 'Do you have Paris recommendations? Have you ever been?' },
  ]

  const folder = shallowRef('inbox')
  const current = shallowRef('brunch')
  const shown = toRef(() => messages.find(message => message.id === current.value) ?? messages[0])
</script>

<template>
  <div class="md1-docs-layout-pattern-stack">
    <Md1ToggleButtons v-model="size" label="Window width" mandatory>
      <Md1ToggleButtons.Item value="handset">360 dp</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="tablet">720 dp</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="desktop">1280 dp</Md1ToggleButtons.Item>
    </Md1ToggleButtons>

    <div ref="stage" class="md1-docs-layout-divide-stage">
      <div
        class="md1-docs-screen md1-docs-layout-divide-screen"
        :data-panes="panes"
        :style="{ width: `${nominal}px`, zoom }"
      >
        <Md1NavigationDrawer v-if="panes === 3" type="permanent">
          <Md1NavigationDrawer.Content>
            <Md1List v-model="folder">
              <Md1List.Item value="inbox">
                <Md1List.Icon name="inbox" />

                Inbox
              </Md1List.Item>

              <Md1List.Item value="sent">
                <Md1List.Icon name="send" />

                Sent mail
              </Md1List.Item>

              <Md1List.Item value="drafts">
                <Md1List.Icon name="drafts" />

                Drafts
              </Md1List.Item>
            </Md1List>
          </Md1NavigationDrawer.Content>
        </Md1NavigationDrawer>

        <div class="md1-docs-layout-pattern-column">
          <Md1Toolbar variant="primary">
            <Md1Toolbar.Nav v-if="panes < 3" />

            <Md1Toolbar.Title>Inbox</Md1Toolbar.Title>
          </Md1Toolbar>

          <div class="md1-docs-layout-divide-panes">
            <div class="md1-docs-layout-divide-list">
              <Md1List v-model="current" aria-label="Inbox" :lines="2">
                <Md1List.Item v-for="message in messages" :key="message.id" :value="message.id">
                  <Md1List.Content>
                    <Md1List.Primary>{{ message.from }}</Md1List.Primary>

                    <Md1List.Secondary>{{ message.subject }}</Md1List.Secondary>
                  </Md1List.Content>
                </Md1List.Item>
              </Md1List>
            </div>

            <article v-if="panes > 1" class="md1-docs-layout-divide-detail">
              <h3 class="md1-type-title">{{ shown.subject }}</h3>

              <p class="md1-type-body-1">{{ shown.body }}</p>
            </article>

            <aside v-if="panes === 3" aria-label="Sender" class="md1-docs-layout-divide-side">
              <p class="md1-type-subheading">{{ shown.from }}</p>

              <p class="md1-type-body-1 md1-docs-layout-divide-muted">{{ shown.email }}</p>

              <Md1Divider />

              <p class="md1-type-body-1 md1-docs-layout-divide-muted">2 earlier conversations</p>
            </aside>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-layout-divide-stage {
    width: 100%;
  }

  .md1-docs-layout-divide-screen {
    display: flex;
    box-sizing: border-box;
    max-width: none;
    margin-inline: auto;
    outline: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-layout-divide-panes {
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-layout-divide-list {
    flex: 1 1 auto;
    overflow-y: auto;
  }

  /* Divided, the list keeps five increments and a 1 dp divider stands between panes. */
  .md1-docs-layout-divide-screen:not([data-panes='1']) .md1-docs-layout-divide-list {
    flex: 0 0 calc(5 * var(--md1-increment, 64px));
    border-inline-end: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-layout-divide-detail {
    flex: 1 1 auto;
    min-width: 0;
    padding: var(--md1-spacing-2, 16px) var(--md1-keyline-margin, 16px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* The right panel: five increments, like the side nav. */
  .md1-docs-layout-divide-side {
    flex: 0 0 calc(5 * var(--md1-increment, 64px));
    box-sizing: border-box;
    padding: var(--md1-spacing-2, 16px);
    border-inline-start: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-layout-divide-detail > :is(h3, p),
  .md1-docs-layout-divide-side > p {
    margin: 0 0 var(--md1-spacing-1, 8px);
  }

  .md1-docs-layout-divide-muted {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
