<script setup lang="ts">
  import { Md1Divider, Md1List, Md1Toolbar } from '@paper/md1'
  import { shallowRef, toRef } from 'vue'

  import type { Md1IconName } from '@paper/md1'

  interface Cluster {
    id: string
    title: string
    icon: Md1IconName
    tone: string
    items: string[]
  }

  const clusters: Cluster[] = [
    { id: 'promos', title: 'Promos', icon: 'label', tone: 'blue', items: ['Icon Project', 'Daily Deals', 'Weekend sale'] },
    { id: 'social', title: 'Social', icon: 'person', tone: 'pink', items: ['Meetup', 'Google+', 'Dribbble'] },
    { id: 'finance', title: 'Finance', icon: 'bookmark', tone: 'green', items: ['First Bank'] },
  ]

  const messages = [
    { id: 'brunch', from: 'Ali Connors', subject: 'Brunch this weekend?' },
    { id: 'bbq', from: 'me, Scott, Jennifer', subject: 'Summer BBQ' },
    { id: 'paris', from: 'Sandra Adams', subject: 'Oui oui' },
  ]

  const open = shallowRef('')

  const cluster = toRef(() => clusters.find(item => item.id === open.value))
</script>

<template>
  <div class="md1-docs-screen md1-docs-clusters">
    <Md1Toolbar variant="primary">
      <Md1Toolbar.Nav
        :aria-label="cluster ? 'Inbox' : 'Menu'"
        :icon="cluster ? 'up' : 'menu'"
        @click="open = ''"
      />

      <Md1Toolbar.Title>{{ cluster?.title ?? 'Inbox' }}</Md1Toolbar.Title>
    </Md1Toolbar>

    <div class="md1-docs-clusters-body">
      <Md1List v-if="cluster" :aria-label="cluster.title" :lines="2">
        <Md1List.Item v-for="item in cluster.items" :key="item" @click="() => {}">
          <Md1List.Content>
            <Md1List.Primary>{{ item }}</Md1List.Primary>

            <Md1List.Secondary>A message from {{ item }}</Md1List.Secondary>
          </Md1List.Content>
        </Md1List.Item>
      </Md1List>

      <template v-else>
        <Md1List aria-label="Bundles" :lines="2">
          <Md1List.Item
            v-for="item in clusters"
            :key="item.id"
            class="md1-docs-clusters-bundle"
            :data-tone="item.tone"
            @click="open = item.id"
          >
            <Md1List.Icon :name="item.icon" />

            <Md1List.Content>
              <Md1List.Primary>{{ item.title }}</Md1List.Primary>

              <Md1List.Secondary>{{ item.items.join(', ') }}</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>
        </Md1List>

        <Md1Divider />

        <Md1List aria-label="Messages" :lines="2">
          <Md1List.Item v-for="message in messages" :key="message.id" @click="() => {}">
            <Md1List.Content>
              <Md1List.Primary>{{ message.from }}</Md1List.Primary>

              <Md1List.Secondary>{{ message.subject }}</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>
        </Md1List>
      </template>
    </div>
  </div>
</template>

<style>
  /* A handset inbox: the bundles sit above the single messages, each bundle a link into its own list. */
  .md1-docs-screen.md1-docs-clusters {
    display: flex;
    flex-direction: column;
    height: 440px;
    max-width: 360px;
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-clusters-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }

  /* Each bundle carries its own hue on the icon and the title; the 700 shades keep 4.5:1 on white. */
  .md1-docs-clusters-bundle[data-tone='blue'] { --md1-docs-cluster-tone: var(--md1-blue-700, #1976D2); }
  .md1-docs-clusters-bundle[data-tone='pink'] { --md1-docs-cluster-tone: var(--md1-pink-700, #C2185B); }
  .md1-docs-clusters-bundle[data-tone='green'] { --md1-docs-cluster-tone: var(--md1-green-700, #388E3C); }

  [data-theme='md1-dark'] .md1-docs-clusters-bundle[data-tone='blue'] { --md1-docs-cluster-tone: var(--md1-blue-200, #90CAF9); }
  [data-theme='md1-dark'] .md1-docs-clusters-bundle[data-tone='pink'] { --md1-docs-cluster-tone: var(--md1-pink-200, #F48FB1); }
  [data-theme='md1-dark'] .md1-docs-clusters-bundle[data-tone='green'] { --md1-docs-cluster-tone: var(--md1-green-200, #A5D6A7); }

  .md1-docs-clusters-bundle .md1-list__icon,
  .md1-docs-clusters-bundle .md1-list__primary {
    color: var(--md1-docs-cluster-tone);
  }
</style>
