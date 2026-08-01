<script setup lang="ts">
  import { dark, light } from '@paper/onyx'

  defineOptions({ name: 'OnyxAccessibility' })

  const contrastRows = [
    { label: 'Light — primary on background', fg: light.primary, bg: light.background },
    { label: 'Light — foreground on background', fg: light.foreground, bg: light.background },
    { label: 'Dark — primary on background', fg: dark.primary, bg: dark.background },
    { label: 'Dark — foreground on background', fg: dark.foreground, bg: dark.background },
  ].map(row => ({ ...row, lc: apca(hexToRgb(row.fg), hexToRgb(row.bg)) }))

  const keyboardMaps = [
    {
      component: 'Dialog',
      rows: [
        { key: 'Tab', action: 'Moves focus between focusable elements inside the dialog (native focus trap via <dialog>).' },
        { key: 'Enter', action: 'Activates the focused button or action.' },
        { key: 'Esc', action: 'Closes the dialog (native cancel event).' },
        { key: 'Arrows', action: 'Not used by Dialog itself.' },
      ],
    },
    {
      component: 'Tabs',
      rows: [
        { key: 'Tab', action: 'Moves focus into and out of the tablist as a single stop.' },
        { key: 'Arrows', action: 'Moves selection between tabs (Left/Right or Up/Down, by orientation).' },
        { key: 'Enter', action: 'Activates the focused tab in manual-activation mode.' },
        { key: 'Esc', action: 'Not used.' },
      ],
    },
    {
      component: 'Pagination',
      rows: [
        { key: 'Tab', action: 'Moves between page-item controls; each item is its own stop.' },
        { key: 'Enter', action: 'Activates the focused page item (Space also works).' },
        { key: 'Arrows', action: 'Not used.' },
        { key: 'Esc', action: 'Not used.' },
      ],
    },
    {
      component: 'Breadcrumbs',
      rows: [
        { key: 'Tab', action: 'Moves between crumb links in order — a plain link list, no roving focus.' },
        { key: 'Enter', action: 'Follows the focused link (native anchor default).' },
        { key: 'Arrows', action: 'Not used.' },
        { key: 'Esc', action: 'Not used.' },
      ],
    },
  ]
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    Accessibility in Onyx is inherited, not bolted on — every component is a
    <code>@vuetify/v0</code> compound with its ARIA roles, keyboard handling, and focus
    management built at the composable layer. This page states the visual-layer policy on top
    of that: focus rings, contrast, and motion.
  </p>

  <OnAlert class="mt-6" variant="info">
    <template #icon>i</template>
    <OnAlertTitle>Focus-visible only</OnAlertTitle>

    <OnAlertDescription>
      Every interactive Hb component ships a <code>:focus-visible</code> ring
      (<code>color-mix(in srgb, var(--onyx-ring) 50%, transparent)</code>) and never
      suppresses it — only keyboard and programmatic focus show the ring, never a mouse click.
      Tab through the buttons below to see it.
    </OnAlertDescription>
  </OnAlert>

  <div class="flex gap-2 mt-4">
    <OnButton>First</OnButton>
    <OnButton variant="outline">Second</OnButton>
    <OnButton variant="ghost">Third</OnButton>
  </div>

  <OnCard class="mt-6 p-6">
    <OnCardHeader>
      <OnCardTitle>APCA contrast</OnCardTitle>
      <OnCardDescription>Computed live from the actual theme tokens, not asserted.</OnCardDescription>
    </OnCardHeader>

    <OnCardContent>
      <div v-for="row in contrastRows" :key="row.label" class="onyx-a11y__row flex items-center justify-between gap-6 p-3">
        <span>{{ row.label }}</span>
        <code>Lc {{ row.lc.toFixed(1) }}</code>
      </div>

      <p style="color: var(--onyx-muted-foreground, #71717a); font-size: 13px; margin-top: 12px;">
        APCA's Lc scale isn't directly comparable to WCAG 2's contrast ratio — it's signed
        (polarity matters) and weighted for real text perception. Higher magnitude means higher
        readable contrast.
      </p>
    </OnCardContent>
  </OnCard>

  <OnAlert class="mt-6" variant="default">
    <template #icon>i</template>
    <OnAlertTitle>Reduced motion</OnAlertTitle>

    <OnAlertDescription>
      Every Onyx transition respects <code>prefers-reduced-motion</code> — components
      drop their transition duration to near-zero (or skip the animation loop entirely) rather
      than overriding the user's OS-level preference.
    </OnAlertDescription>
  </OnAlert>

  <h2 class="onyx-a11y__heading mt-8">Keyboard map</h2>

  <div class="grid gap-4 mt-3" style="grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));">
    <OnCard v-for="entry in keyboardMaps" :key="entry.component" class="p-4">
      <OnCardHeader>
        <OnCardTitle>{{ entry.component }}</OnCardTitle>
      </OnCardHeader>

      <OnCardContent>
        <div v-for="row in entry.rows" :key="row.key" class="onyx-a11y__row flex items-start gap-4 p-2">
          <code style="flex-shrink: 0; width: 64px;">{{ row.key }}</code>
          <span>{{ row.action }}</span>
        </div>
      </OnCardContent>
    </OnCard>
  </div>
</template>

<!-- Unscoped: page-local reference rows, layout scaffolding only. -->
<style>
  .onyx-a11y__row {
    border-bottom: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #e4e4e7);
  }

  .onyx-a11y__row:last-child {
    border-bottom: none;
  }

  .onyx-a11y__heading {
    font-size: var(--onyx-text-lg-size, 18px);
    font-weight: 600;
    margin-bottom: 0;
  }
</style>
