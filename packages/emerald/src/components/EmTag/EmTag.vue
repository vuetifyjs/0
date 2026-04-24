<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export type EmTagVariant =
    | 'neutral'
    | 'primary'
    | 'success'
    | 'error'
    | 'warning'
    | 'info'

  export type EmTagTone = 'tinted' | 'outlined'

  export type EmTagElevation = 'none' | 'sm' | 'lg'

  export interface EmTagProps extends V0PaperProps {
    variant?: EmTagVariant
    tone?: EmTagTone
    elevation?: EmTagElevation
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTag' })

  const {
    variant = 'neutral',
    tone = 'outlined',
    elevation = 'none',
    ...paperProps
  } = defineProps<EmTagProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="span"
    class="emerald-tag"
    :data-elevation="elevation"
    :data-tone="tone"
    :data-variant="variant"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
.emerald-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-weight: 400;
  border-radius: 9999px;
  white-space: nowrap;
  border: 1px solid transparent;
  overflow: hidden;
  box-sizing: border-box;
}

/* ─── Tone: outlined (white chip) — default ─────────── */
.emerald-tag[data-tone="outlined"] {
  height: 24px;
  padding: 2px 8px 2px 4px;
  background: #ffffff;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: -0.01em;
}

/* ─── Tone: tinted (filled chip) ─────────────────────── */
.emerald-tag[data-tone="tinted"] {
  padding: 3px;
  font-size: 11px;
  line-height: 18px;
  letter-spacing: -0.02em;
}

.emerald-tag[data-tone="tinted"] > :deep(*:not(svg)) {
  padding-right: 4px;
}

/* ─── Icon sizing (slot content) ─────────────────────── */
.emerald-tag :deep(svg) {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* ─── Variant: neutral ───────────────────────────────── */
.emerald-tag[data-variant="neutral"][data-tone="tinted"] {
  background: var(--emerald-secondary-50, #f4f7f9);
  border-color: rgb(var(--emerald-secondary-500-channels, 148 163 184) / 0.1);
  color: var(--emerald-secondary-900, #4d5462);
}

.emerald-tag[data-variant="neutral"][data-tone="outlined"] {
  border-color: var(--emerald-secondary-100, #ecf0f3);
  color: var(--emerald-secondary-950, #2d3139);
}

.emerald-tag[data-variant="neutral"][data-elevation="sm"] {
  box-shadow: 0 3px 6px 0 rgb(var(--emerald-secondary-500-channels, 148 163 184) / 0.09);
}

.emerald-tag[data-variant="neutral"][data-elevation="lg"] {
  box-shadow:
    0 8px 20px 0 rgb(var(--emerald-secondary-500-channels, 148 163 184) / 0.13),
    0 3px 6px 0 rgb(var(--emerald-secondary-500-channels, 148 163 184) / 0.09);
}

/* ─── Variant: primary ───────────────────────────────── */
.emerald-tag[data-variant="primary"][data-tone="tinted"] {
  background: var(--emerald-primary-50, #f5f3ff);
  border-color: rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.1);
  color: var(--emerald-primary-900, #361d95);
}

.emerald-tag[data-variant="primary"][data-tone="outlined"] {
  border-color: var(--emerald-primary-100, #ede9fe);
  color: var(--emerald-primary-950, #221065);
}

.emerald-tag[data-variant="primary"][data-elevation="sm"] {
  box-shadow: 0 3px 6px 0 rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.09);
}

.emerald-tag[data-variant="primary"][data-elevation="lg"] {
  box-shadow:
    0 8px 20px 0 rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.13),
    0 3px 6px 0 rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.09);
}

/* ─── Variant: success ───────────────────────────────── */
.emerald-tag[data-variant="success"][data-tone="tinted"] {
  background: var(--emerald-success-50, #f1fcf5);
  border-color: rgb(var(--emerald-success-700-channels, 30 122 74) / 0.1);
  color: var(--emerald-success-900, #194e34);
}

.emerald-tag[data-variant="success"][data-tone="outlined"] {
  border-color: var(--emerald-success-100, #dff9eb);
  color: var(--emerald-success-950, #082b1b);
}

.emerald-tag[data-variant="success"][data-elevation="sm"] {
  box-shadow: 0 3px 6px 0 rgb(var(--emerald-success-700-channels, 30 122 74) / 0.09);
}

.emerald-tag[data-variant="success"][data-elevation="lg"] {
  box-shadow:
    0 8px 20px 0 rgb(var(--emerald-success-700-channels, 30 122 74) / 0.13),
    0 3px 6px 0 rgb(var(--emerald-success-700-channels, 30 122 74) / 0.09);
}

/* ─── Variant: error ─────────────────────────────────── */
.emerald-tag[data-variant="error"][data-tone="tinted"] {
  background: var(--emerald-error-50, #fdf4f3);
  border-color: rgb(var(--emerald-error-500-channels, 192 57 43) / 0.1);
  color: var(--emerald-error-900, #782c24);
}

.emerald-tag[data-variant="error"][data-tone="outlined"] {
  border-color: var(--emerald-error-100, #fce6e4);
  color: var(--emerald-error-950, #41130e);
}

.emerald-tag[data-variant="error"][data-elevation="sm"] {
  box-shadow: 0 3px 6px 0 rgb(var(--emerald-error-500-channels, 192 57 43) / 0.09);
}

.emerald-tag[data-variant="error"][data-elevation="lg"] {
  box-shadow:
    0 8px 20px 0 rgb(var(--emerald-error-500-channels, 192 57 43) / 0.13),
    0 3px 6px 0 rgb(var(--emerald-error-500-channels, 192 57 43) / 0.09);
}

/* ─── Variant: warning ───────────────────────────────── */
.emerald-tag[data-variant="warning"][data-tone="tinted"] {
  background: var(--emerald-warning-50, #fbfaeb);
  border-color: rgb(var(--emerald-warning-700-channels, 176 125 26) / 0.1);
  color: var(--emerald-warning-900, #663f1d);
}

.emerald-tag[data-variant="warning"][data-tone="outlined"] {
  border-color: var(--emerald-warning-100, #f7f2ca);
  color: var(--emerald-warning-950, #3b200d);
}

.emerald-tag[data-variant="warning"][data-elevation="sm"] {
  box-shadow: 0 3px 6px 0 rgb(var(--emerald-warning-700-channels, 176 125 26) / 0.09);
}

.emerald-tag[data-variant="warning"][data-elevation="lg"] {
  box-shadow:
    0 8px 20px 0 rgb(var(--emerald-warning-700-channels, 176 125 26) / 0.13),
    0 3px 6px 0 rgb(var(--emerald-warning-700-channels, 176 125 26) / 0.09);
}

/* ─── Variant: info ──────────────────────────────────── */
.emerald-tag[data-variant="info"][data-tone="tinted"] {
  background: var(--emerald-info-50, #f3f6fc);
  border-color: rgb(var(--emerald-info-700-channels, 42 95 165) / 0.1);
  color: var(--emerald-info-900, #1f375b);
}

.emerald-tag[data-variant="info"][data-tone="outlined"] {
  border-color: var(--emerald-info-100, #e6edf8);
  color: var(--emerald-info-950, #000000);
}

.emerald-tag[data-variant="info"][data-elevation="sm"] {
  box-shadow: 0 3px 6px 0 rgb(var(--emerald-info-700-channels, 42 95 165) / 0.09);
}

.emerald-tag[data-variant="info"][data-elevation="lg"] {
  box-shadow:
    0 8px 20px 0 rgb(var(--emerald-info-700-channels, 42 95 165) / 0.13),
    0 3px 6px 0 rgb(var(--emerald-info-700-channels, 42 95 165) / 0.09);
}
</style>
