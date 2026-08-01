<script setup lang="ts">
  defineOptions({ name: 'OnyxDepth' })
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    The 2020 original used a Material elevation ramp — 0/4/8/16dp — and this rebuild briefly
    carried a border-plus-shadow-tier story of its own. Neither survives contact with a
    near-black surface: a 5%-opacity shadow on a dark ground is arithmetically invisible, so
    every "elevation" signal reduced to one weak 1px border. Onyx now draws depth with
    <strong>light, not shadow</strong> — an object is separated from its ground by how it
    catches a single overhead lamp, not by how far it appears to float above one.
  </p>

  <h2 class="onyx-depth__heading mt-8">The four layers</h2>

  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    Every raised surface is exactly these four, applied in this order, with no per-component
    invention. Individually the first three are nearly invisible — collectively they are what
    makes a surface read as an object rather than a swatch.
  </p>

  <div class="onyx-exhibit mt-4">
    <p class="onyx-hallmark onyx-exhibit__caption">Band → Girdle → Hairline → Pool</p>

    <div class="onyx-depth__layers">
      <div class="onyx-depth__specimen">
        <div class="onyx-depth__swatch" style="background: var(--onyx-card, #f4f4f5);" />
        <span class="onyx-depth__label">Bare surface</span>
      </div>

      <div class="onyx-depth__specimen">
        <div class="onyx-depth__swatch" style="background: var(--onyx-band, none), var(--onyx-card, #f4f4f5);" />
        <span class="onyx-depth__label">+ Band</span>
      </div>

      <div class="onyx-depth__specimen">
        <div
          class="onyx-depth__swatch"
          style="background: var(--onyx-band, none), var(--onyx-card, #f4f4f5); box-shadow: var(--onyx-girdle, none);"
        />

        <span class="onyx-depth__label">+ Girdle</span>
      </div>

      <div class="onyx-depth__specimen">
        <div
          class="onyx-depth__swatch"
          style="
            background: var(--onyx-band, none), var(--onyx-card, #f4f4f5);
            border: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #e4e4e7);
            box-shadow: var(--onyx-girdle, none);
          "
        />

        <span class="onyx-depth__label">+ Hairline</span>
      </div>

      <div class="onyx-depth__specimen">
        <div
          class="onyx-depth__swatch"
          style="
            background: var(--onyx-band, none), var(--onyx-card, #f4f4f5);
            border: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #e4e4e7);
            box-shadow: var(--onyx-girdle, none), var(--onyx-pool, none);
          "
        />

        <span class="onyx-depth__label">+ Pool (the full card)</span>
      </div>
    </div>
  </div>

  <h2 class="onyx-depth__heading mt-8">Elevation vs. recession — the same device, inverted</h2>

  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    A raised surface (a card) and a recessed one (an input, a tab trough) are the same four
    layers with the light inverted. The girdle stays a 1px inset line in both — only whether it
    sits at the top-bright or top-dark edge changes.
  </p>

  <div class="onyx-exhibit mt-4">
    <p class="onyx-hallmark onyx-exhibit__caption">Raised vs. recessed</p>

    <div class="onyx-depth__pair">
      <div class="onyx-depth__specimen">
        <div
          class="onyx-depth__swatch onyx-depth__swatch--lg"
          style="
            background: var(--onyx-band, none), var(--onyx-card, #f4f4f5);
            border: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #e4e4e7);
            box-shadow: var(--onyx-girdle, none), var(--onyx-pool, none);
          "
        />

        <span class="onyx-depth__label">Raised — girdle lit at the top</span>
      </div>

      <div class="onyx-depth__specimen">
        <div
          class="onyx-depth__swatch onyx-depth__swatch--lg"
          style="
            background: var(--onyx-band-recess, none), var(--onyx-intaglio, var(--onyx-muted, #e4e4e7));
            border: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #e4e4e7);
            box-shadow: var(--onyx-girdle-recess, none);
          "
        />

        <span class="onyx-depth__label">Recessed — dark inset at the top, faint lift at the bottom</span>
      </div>
    </div>
  </div>

  <h2 class="onyx-depth__heading mt-8">The girdle carries state, not the fill</h2>

  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    Selection and severity never tint a surface's background — they touch only its girdle. A
    warning toast and an info toast are the same stone object with a different-coloured light
    on the top edge, which is the whole reason the system can carry four severities without
    turning into a status page.
  </p>

  <div class="onyx-exhibit mt-4">
    <p class="onyx-hallmark onyx-exhibit__caption">Active vs. default</p>

    <div class="onyx-depth__pair">
      <div class="onyx-depth__specimen">
        <div
          class="onyx-depth__swatch"
          style="
            background: var(--onyx-band, none), var(--onyx-card, #f4f4f5);
            border: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #e4e4e7);
            box-shadow: var(--onyx-girdle, none), var(--onyx-pool, none);
          "
        />

        <span class="onyx-depth__label">Default girdle</span>
      </div>

      <div class="onyx-depth__specimen">
        <div
          class="onyx-depth__swatch"
          style="
            background: var(--onyx-band, none), var(--onyx-card, #f4f4f5);
            border: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #e4e4e7);
            box-shadow: var(--onyx-girdle-active, none), var(--onyx-pool, none);
          "
        />

        <span class="onyx-depth__label">Active girdle (champagne) — selected or current</span>
      </div>
    </div>
  </div>
</template>

<!-- Unscoped: page-local heading + demo-specimen layout only. -->
<style>
  .onyx-depth__heading {
    font-size: var(--onyx-text-lg-size, 18px);
    font-weight: 600;
    margin: 0;
  }

  .onyx-depth__layers {
    display: grid;
    gap: var(--onyx-spacing-lg, 24px);
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .onyx-depth__pair {
    display: grid;
    gap: var(--onyx-spacing-xl, 32px);
    grid-template-columns: minmax(0, 1fr);
  }

  @media (min-width: 640px) {
    .onyx-depth__pair {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .onyx-depth__specimen {
    display: flex;
    flex-direction: column;
    gap: var(--onyx-spacing-sm, 12px);
  }

  .onyx-depth__swatch {
    border-radius: var(--onyx-radius-lg, 0.5rem);
    height: 96px;
    width: 100%;
  }

  .onyx-depth__swatch--lg {
    height: 140px;
  }

  .onyx-depth__label {
    color: var(--onyx-muted-foreground, #71717a);
    font-size: var(--onyx-text-sm-size, 13px);
  }
</style>
