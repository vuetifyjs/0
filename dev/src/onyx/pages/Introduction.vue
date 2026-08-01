<script setup lang="ts">
  defineOptions({ name: 'OnyxIntroduction' })
</script>

<template>
  <OnCard class="onyx-intro__hero p-6">
    <div class="flex flex-wrap items-center gap-6">
      <div class="flex-1" style="min-width: 280px;">
        <p class="text-xs uppercase" :style="{ color: 'var(--onyx-muted-foreground, #71717a)', letterSpacing: '0.05em', margin: '0 0 var(--onyx-spacing-sm, 12px)' }">
          For products that need to feel exact, not loud
        </p>

        <h2 :style="{ color: 'var(--onyx-brand, #3f3f46)', fontSize: 'var(--onyx-text-4xl-size, 36px)', fontWeight: 700, lineHeight: 'var(--onyx-text-4xl-height, 40px)', margin: 0 }">
          Onyx
        </h2>

        <p :style="{ color: 'var(--onyx-foreground, #09090b)', fontSize: 'var(--onyx-text-2xl-size, 24px)', fontWeight: 600, lineHeight: 'var(--onyx-text-2xl-height, 32px)', margin: '0 0 var(--onyx-spacing-lg, 24px)' }">
          Design System
        </p>

        <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '560px' }">
          Onyx is a dark, refined design system built entirely on <code>@vuetify/v0</code>
          headless primitives — no native form controls, no Material defaults, just
          token-driven components precise enough for any product in the Paper family to wear.
        </p>
      </div>

      <svg aria-hidden="true" height="140" viewBox="0 0 24 24" width="140">
        <path d="M21 12 16.5 4.2 7.5 4.2 3 12 7.5 19.8 16.5 19.8Z" :fill="'var(--onyx-brand, #3f3f46)'" />

        <path
          d="M12 12 21 12M12 12 16.5 4.2M12 12 7.5 4.2M12 12 3 12M12 12 7.5 19.8M12 12 16.5 19.8"
          fill="none"
          opacity="0.5"
          :stroke="'var(--onyx-brand-foreground, #ffffff)'"
          stroke-linecap="round"
          stroke-width="0.4"
        />
      </svg>
    </div>
  </OnCard>

  <div class="onyx-intro__grid grid gap-4 mt-6">
    <OnCard class="p-6">
      <OnCardHeader>
        <OnCardTitle>Why a system?</OnCardTitle>
      </OnCardHeader>

      <OnCardContent>
        <p>
          Consistency compounds. Every <code>@paper/*</code> design system — Emerald, Helix,
          and Onyx — shares the same v0 logic layer, so switching visual language between
          products never means relearning selection, validation, or accessibility semantics.
          Onyx gives teams that already know shadcn/ui a familiar token vocabulary without
          leaving the v0 substrate.
        </p>
      </OnCardContent>
    </OnCard>

    <OnCard class="p-6">
      <OnCardHeader>
        <OnCardTitle>Where did it come from?</OnCardTitle>
      </OnCardHeader>

      <OnCardContent>
        <p>
          Onyx was built headless from the start — a <code>@vuetify/v0</code> composition
          using the same shadcn/ui-informed token pairing, density, and state aesthetics as
          the rest of the Paper family, then given its own graphite visual language once the
          brief moved from "fast to prototype" to "precise enough to ship."
        </p>
      </OnCardContent>
    </OnCard>

    <OnCard class="p-6">
      <OnCardHeader>
        <OnCardTitle>Why the name?</OnCardTitle>
      </OnCardHeader>

      <OnCardContent>
        <p>
          Onyx is valued for what it doesn't do — no sparkle, no gradient, just a flat, dense
          black that holds a hard edge under a loupe. That's the brief for this system too: no
          ornament to hide behind, every corner precise enough to stand on its own.
        </p>
      </OnCardContent>
    </OnCard>
  </div>
</template>

<!-- Unscoped: layout scaffolding only — explicit grid tracks so long
     unbreakable tokens (e.g. the provenance URL) can't blow out the column. -->
<style>
  .onyx-intro__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  @media (min-width: 768px) {
    .onyx-intro__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
