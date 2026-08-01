<script setup lang="ts">
  import { shadow } from '@paper/onyx'

  defineOptions({ name: 'OnyxDepth' })
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    The 2020 original used a Material elevation ramp — 0/4/8/16dp. This rebuild drops it.
    Borders carry the primary surface-separation signal; shadow is reserved for exactly one
    active floating layer at a time (a dialog, a popover, a menu) rather than a multi-tier
    ramp everything reaches for.
  </p>

  <div class="grid gap-4 mt-6" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
    <OnCard class="p-6" style="box-shadow: none;">
      <OnCardHeader>
        <OnCardTitle>Border only</OnCardTitle>
      </OnCardHeader>

      <OnCardContent>
        <p>No shadow — the default border alone signals the surface boundary. Most cards stop here.</p>
      </OnCardContent>
    </OnCard>

    <OnCard class="p-6">
      <OnCardHeader>
        <OnCardTitle>shadow-xs (default)</OnCardTitle>
      </OnCardHeader>

      <OnCardContent>
        <p>Every OnCard ships this by default — barely perceptible, just enough lift to read as a surface.</p>
      </OnCardContent>
    </OnCard>

    <OnCard class="p-6" :style="{ boxShadow: shadow.sm }">
      <OnCardHeader>
        <OnCardTitle>shadow-sm</OnCardTitle>
      </OnCardHeader>

      <OnCardContent>
        <p>Reserved for a single floating layer — the one thing on screen that's meant to feel above everything else.</p>
      </OnCardContent>
    </OnCard>
  </div>
</template>
