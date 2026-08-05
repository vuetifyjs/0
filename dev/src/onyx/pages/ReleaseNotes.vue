<script setup lang="ts">
  defineOptions({ name: 'OnyxReleaseNotes' })

  const waves = [
    {
      title: 'Wave 1',
      status: 'Unreleased',
      summary: 'New design system: Onyx — shadcn-centric visual language on @vuetify/v0.',
      items: [
        'Token pipeline: light and dark theme, semantic pairs, neutral ramp, radius/spacing/shadow/motion scales.',
        '16 On component families — Alert, Avatar, Badge, Banner, Breadcrumbs, Button, Card, Chip, Dialog, Input, List, Pagination, Progress, Table, Tabs, Toast.',
        'Docs app in the dev harness: shell, navigation, theme toggle, and the foundation pages.',
      ],
    },
  ]
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    This system will grow and evolve over time and with use. Major changes are documented here,
    one card per wave.
  </p>

  <OnCard v-for="wave in waves" :key="wave.title" class="mt-6 p-6">
    <OnCardHeader>
      <div class="flex items-center gap-3">
        <OnCardTitle>{{ wave.title }}</OnCardTitle>
        <OnBadge variant="secondary">{{ wave.status }}</OnBadge>
      </div>

      <OnCardDescription>{{ wave.summary }}</OnCardDescription>
    </OnCardHeader>

    <OnCardContent>
      <ul class="onyx-release-notes__list">
        <li v-for="item in wave.items" :key="item">{{ item }}</li>
      </ul>
    </OnCardContent>
  </OnCard>
</template>

<!-- Unscoped: page-local list spacing, layout scaffolding only. -->
<style>
  .onyx-release-notes__list {
    display: flex;
    flex-direction: column;
    gap: var(--onyx-spacing-xs, 8px);
    margin: 0;
    padding-left: var(--onyx-spacing-lg, 24px);
  }
</style>
