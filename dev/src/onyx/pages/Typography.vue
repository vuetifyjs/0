<script setup lang="ts">
  import { fontFamily, fontSize } from '@paper/onyx'

  defineOptions({ name: 'OnyxTypography' })

  const sizes = Object.entries(fontSize) as [string, [string, { lineHeight: string, letterSpacing: string }]][]

  function isSerif (name: string) {
    return ['3xl', '4xl', '5xl'].includes(name)
  }

  const faces = [
    { role: 'Display', family: fontFamily.serif, sample: '3xl and up · weight 300' },
    { role: 'Body', family: fontFamily.sans, sample: 'xs through 2xl' },
    { role: 'Utility', family: fontFamily.mono, sample: 'Hallmarks, code, tabular data' },
  ]
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    Three self-hosted faces, each doing one job. Deliberately not Inter and not a system stack —
    Fraunces gives the display scale a genuine optical-size axis that thins to a hairline
    high-contrast weight at hero sizes, and Instrument Sans holds character at 15px where the
    stock choice goes anonymous. <strong>3xl and up is always {{ fontFamily.serif.split(',')[0] }} at weight 300;
      everything below is {{ fontFamily.sans.split(',')[0] }}</strong> — the switch point is the
    scale, not the author's taste.
  </p>

  <div class="onyx-typography__faces grid gap-4 mt-6">
    <OnCard v-for="face in faces" :key="face.role" class="p-4">
      <p class="onyx-hallmark">{{ face.role }}</p>
      <p class="onyx-typography__face-name" :style="{ fontFamily: face.family }">{{ face.family.split(',')[0].replaceAll('\"', '') }}</p>
      <p class="onyx-typography__face-sample">{{ face.sample }}</p>
    </OnCard>
  </div>

  <OnCard class="onyx-typography__scale mt-6">
    <div
      v-for="[name, [size, { lineHeight, letterSpacing }]] in sizes"
      :key="name"
      class="onyx-typography__row flex items-center gap-6 p-4"
    >
      <div class="flex items-center gap-3" style="width: 220px; flex-shrink: 0;">
        <code>{{ name }}</code>

        <span style="color: var(--onyx-muted-foreground, #71717a); font-size: 12px;">
          {{ size }} / {{ lineHeight }} / {{ letterSpacing }}
        </span>
      </div>

      <span
        class="onyx-typography__sample"
        :style="{
          fontFamily: isSerif(name) ? fontFamily.serif : fontFamily.sans,
          fontSize: size,
          fontWeight: isSerif(name) ? 300 : 400,
          letterSpacing,
          lineHeight,
        }"
      >The quick brown fox jumps over the lazy dog</span>
    </div>
  </OnCard>
</template>

<!-- Unscoped: page-local reference table, layout scaffolding only. -->
<style>
  .onyx-typography__faces {
    grid-template-columns: minmax(0, 1fr);
  }

  @media (min-width: 640px) {
    .onyx-typography__faces {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .onyx-typography__face-name {
    font-size: var(--onyx-text-lg-size, 18px);
    margin: var(--onyx-spacing-xs, 8px) 0 var(--onyx-spacing-3xs, 2px);
  }

  .onyx-typography__face-sample {
    color: var(--onyx-muted-foreground, #71717a);
    font-size: var(--onyx-text-xs-size, 12px);
    margin: 0;
  }

  .onyx-typography__row {
    border-bottom: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #e4e4e7);
    flex-wrap: wrap;
  }

  /* At 3xl+ a single word in the sample can be wider than the space left over
     after the fixed label column — wrap onto its own line and allow a
     mid-word break as the last resort so the row can never force the page wider
     than the viewport (the new 5xl step is what first exposed this). */
  .onyx-typography__sample {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .onyx-typography__row:last-child {
    border-bottom: none;
  }
</style>
