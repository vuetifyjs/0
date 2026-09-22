<script setup lang="ts">
  import {
    EmIcon,
    EmList,
    EmListItem,
    EmListItemContent,
    EmListItemMedia,
    EmListItemSubtitle,
    EmListItemTitle,
  } from '@paper/emerald'

  import { shallowRef, toRef } from 'vue'

  const active = shallowRef<string>()

  const guides = [
    {
      id: 'install',
      icon: 'document',
      title: 'Installation',
      summary: 'Add the package',
      body: 'Install @paper/emerald, register the plugin, and the tokens and component styles are available everywhere.',
    },
    {
      id: 'theming',
      icon: 'palette',
      title: 'Theming',
      summary: 'Tokens and schemes',
      body: 'Every color, radius and spacing value is a CSS variable. Override a token and every component follows.',
    },
    {
      id: 'icons',
      icon: 'sparkle',
      title: 'Icons',
      summary: 'The role registry',
      body: 'Icons are named by role, not by glyph. Swap the registry and the whole app changes sets at once.',
    },
  ] as const

  const open = toRef(() => guides.find(guide => guide.id === active.value))
</script>

<template>
  <div class="emerald-docs-detail">
    <EmList v-model="active" mandatory="force">
      <EmListItem v-for="guide in guides" :key="guide.id" :value="guide.id">
        <EmListItemMedia>
          <EmIcon :name="guide.icon" size="s" />
        </EmListItemMedia>

        <EmListItemContent>
          <EmListItemTitle>{{ guide.title }}</EmListItemTitle>

          <EmListItemSubtitle>{{ guide.summary }}</EmListItemSubtitle>
        </EmListItemContent>
      </EmListItem>
    </EmList>

    <div class="emerald-docs-detail__pane">
      <template v-if="open">
        <strong class="emerald-docs-detail__title">{{ open.title }}</strong>

        <p class="emerald-docs-detail__body">{{ open.body }}</p>
      </template>
    </div>
  </div>
</template>

<style>
  .emerald-docs-detail {
    display: grid;
    grid-template-columns: minmax(200px, 260px) 1fr;
    gap: var(--emerald-spacing-m, 16px);
    align-items: start;
  }

  .emerald-docs-detail__pane {
    padding: var(--emerald-spacing-s, 12px) var(--emerald-spacing-m, 16px);
    border: 1px solid var(--emerald-neutral-300, #e4e9ec);
    border-radius: var(--emerald-radius-m, 8px);
  }

  .emerald-docs-detail__title {
    display: block;
    margin-bottom: var(--emerald-spacing-3xs, 2px);
    color: var(--emerald-on-surface, #2b2d2e);
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: var(--emerald-text-b2-height, 21px);
  }

  .emerald-docs-detail__body {
    margin: 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    line-height: var(--emerald-text-b3-height, 18px);
  }

  @media (max-width: 480px) {
    .emerald-docs-detail {
      grid-template-columns: 1fr;
    }
  }
</style>
