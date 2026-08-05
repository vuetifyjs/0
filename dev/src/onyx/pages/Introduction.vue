<script setup lang="ts">
  defineOptions({ name: 'OnyxIntroduction' })
</script>

<template>
  <div class="onyx-intro__hero">
    <p class="onyx-hallmark">Onyx · Design System</p>

    <h1 class="onyx-intro__title">Onyx</h1>

    <div class="onyx-intro__rule" />

    <p class="onyx-intro__lede">
      A dark, refined design system built entirely on <code>@vuetify/v0</code> headless
      primitives — no native form controls, no Material defaults, just token-driven
      components precise enough for any product in the Paper family to wear.
    </p>
  </div>

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
          the rest of the Paper family. Its visual language has been redrawn since: a first
          pass shipped a flat graphite palette, replaced by the warm, lit lapidary system
          you're looking at now.
        </p>
      </OnCardContent>
    </OnCard>

    <OnCard class="p-6">
      <OnCardHeader>
        <OnCardTitle>Why the name?</OnCardTitle>
      </OnCardHeader>

      <OnCardContent>
        <p>
          Real onyx is not black — it's a warm brown-black chalcedony that only becomes
          beautiful once it's cut, polished, and lit, which is why every photograph of it is
          really a photograph of a light source. This system refuses the industry's flat,
          blue-black dark mode for the same reason: depth here is drawn with light — a lit
          edge, a soft band, a pool of shadow beneath — never a shortcut shadow ramp.
        </p>
      </OnCardContent>
    </OnCard>
  </div>
</template>

<!-- Unscoped: layout scaffolding only — explicit grid tracks so long
     unbreakable tokens (e.g. the provenance URL) can't blow out the column. Hero per
     direction-a.md §8: full-bleed, no card — hallmark eyebrow, Fraunces 5xl title, a single
     96px champagne rule (the hero's own girdle), one sentence of lede. Nothing else. -->
<style>
  .onyx-intro__hero {
    padding: var(--onyx-spacing-2xl, 48px) 0 var(--onyx-spacing-xl, 32px);
  }

  .onyx-intro__hero .onyx-hallmark {
    margin: 0 0 var(--onyx-spacing-md, 16px);
  }

  .onyx-intro__title {
    color: var(--onyx-foreground, #09090b);
    font-family: var(--onyx-font-serif, inherit);
    font-size: var(--onyx-text-5xl-size, 72px);
    font-weight: 300;
    letter-spacing: -0.032em;
    line-height: var(--onyx-text-5xl-height, 74px);
    margin: 0;
  }

  .onyx-intro__rule {
    background: var(--onyx-champagne, var(--onyx-brand, #dac593));
    height: 1px;
    margin: var(--onyx-spacing-lg, 24px) 0;
    opacity: 0.45;
    width: 96px;
  }

  .onyx-intro__lede {
    color: var(--onyx-muted-foreground, #71717a);
    font-size: var(--onyx-text-lg-size, 19px);
    line-height: var(--onyx-text-lg-height, 30px);
    margin: 0;
    max-width: 58ch;
  }

  .onyx-intro__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  @media (min-width: 768px) {
    .onyx-intro__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
