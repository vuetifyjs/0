<script lang="ts">
  // Framework
  import { clamp, isNumber, Progress, useLocale } from '@vuetify/v0'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { ProgressRootProps, ProgressRootSlotProps } from '@vuetify/v0'

  /**
   * Material Design 1 withholds `min`, `max`, `name`, `id` and `modelValue` from v0's
   * progress root: the page states progress as a percentage, the indicator has
   * no text and submits nothing (ruling 7), and the value is an output, so it
   * is a prop rather than a model.
   */
  export interface Md1ProgressCircularProps extends Pick<ProgressRootProps, 'ariaLabel' | 'namespace'> {
    /** Percent complete, 0 to 100. Leave it unset for the indeterminate indicator. */
    value?: number
    /**
     * Outer diameter in px: 40, the one size the page draws, or 64 under `fab`.
     * A rendering knob for the FAB ring and the refresh indicator (SPEC.md,
     * Deviations), not a spec variant; the stroke stays 4 dp at every size.
     */
    size?: number
    /**
     * The ring drawn around a sibling 56 dp `Md1Fab` in the accent colour: 64 dp,
     * positioned 4 dp outside the FAB's edge. The host wrapping both is
     * `position: relative` and sized to the FAB.
     */
    fab?: boolean
  }

  /** The hooks Material Design 1 binds on the root beside the v0 progressbar attrs. A `type`, so it satisfies `mergeProps`' index signature. */
  type Md1ProgressCircularAttrs = {
    'role': 'progressbar'
    'aria-valuemin': number
    'aria-valuemax': number
    'aria-valuenow': number | undefined
    'aria-valuetext': string | undefined
    'aria-label': string
    'aria-busy': true | undefined
    'data-state': 'determinate' | 'indeterminate'
    'data-complete': true | undefined
    'data-fab': true | undefined
  }

  /** About 4 dp, measured on the page's circular sheet at 2 px per dp. */
  const STROKE = 4
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ProgressCircular', inheritAttrs: false })

  const {
    value,
    size,
    fab = false,
    ariaLabel: _ariaLabel,
    namespace,
  } = defineProps<Md1ProgressCircularProps>()

  const attrs = useAttrs()
  const locale = useLocale()

  // v0 reads a value of 0 as indeterminate (no segment above zero); the spec's
  // determinate arc starts at 0%, so the state hook and the ARIA values come
  // from Material Design 1's own prop and the root renders through v0's renderless path.
  const determinate = toRef(() => isNumber(value))
  const percent = toRef(() => clamp(value ?? 0, 0, 100))

  // The indicator has no text of its own, so the accessible name falls back to
  // the page's one word for what it shows: the app loading content.
  const label = toRef(() => _ariaLabel ?? locale.ti('Md1.loading') ?? 'Loading')

  // The geometry is parameterised by `size`: the circle is inset by half the
  // stroke so the ring's outer edge is the diameter. `pathLength` normalises
  // the circumference to 100, so the dash is the percent at any size.
  const diameter = toRef(() => size ?? (fab ? 64 : 40))
  const center = toRef(() => diameter.value / 2)
  const radius = toRef(() => Math.max((diameter.value - STROKE) / 2, 0))
  const dash = toRef(() => determinate.value ? `${percent.value} 100` : undefined)

  function bind (root: ProgressRootSlotProps['attrs']) {
    const own: Md1ProgressCircularAttrs = {
      'role': root.role,
      'aria-valuemin': root['aria-valuemin'],
      'aria-valuemax': root['aria-valuemax'],
      'aria-valuenow': determinate.value ? percent.value : undefined,
      'aria-valuetext': determinate.value ? `${Math.round(percent.value)}%` : undefined,
      'aria-label': label.value,
      'aria-busy': determinate.value ? undefined : true,
      'data-state': determinate.value ? 'determinate' : 'indeterminate',
      'data-complete': determinate.value && percent.value >= 100 ? true : undefined,
      'data-fab': fab || undefined,
    }

    return mergeProps(attrs, own)
  }
</script>

<template>
  <Progress.Root
    v-slot="{ attrs: root }"
    :model-value="value"
    :namespace
    renderless
  >
    <div v-bind="bind(root)" class="md1-progress-circular">
      <!-- Runtime-parameterised geometry, not a glyph: inline SVG is the declared deviation (SPEC.md). -->
      <svg
        aria-hidden="true"
        :height="diameter"
        :viewBox="`0 0 ${diameter} ${diameter}`"
        :width="diameter"
      >
        <circle
          v-if="determinate"
          class="md1-progress-circular__track"
          :cx="center"
          :cy="center"
          pathLength="100"
          :r="radius"
        />

        <circle
          class="md1-progress-circular__arc"
          :cx="center"
          :cy="center"
          pathLength="100"
          :r="radius"
          :stroke-dasharray="dash"
        />
      </svg>
    </div>
  </Progress.Root>
</template>

<!-- Unscoped, like every Material Design 1 stylesheet. -->
<style>
  /*
   * The indicator colour is the primary (page video: the blue 500 range); the
   * arc and track read it as currentColor. `--md1-primary-ink` keeps the 500
   * on light and takes a lighter tone of the primary on the dark sheet, where
   * the 500 misses the 3:1 non-text floor (colour page; Lead decision 12).
   */
  .md1-progress-circular {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    vertical-align: middle;
    color: var(--md1-primary-ink, var(--md1-primary, #3F51B5));
  }

  /*
   * Determinate: the arc starts at the top and grows clockwise (page video),
   * so the circle is turned a quarter back from SVG's 3 o'clock origin.
   */
  .md1-progress-circular > svg {
    display: block;
    transform: rotate(-90deg);
  }

  .md1-progress-circular__track,
  .md1-progress-circular__arc {
    fill: none;
    stroke: currentcolor;
    stroke-width: 4;
  }

  /*
   * The determinate track: the page shows none, so it is Vuetify 1.5's
   * underlay, black 10% in both themes (var:288), which nearly vanishes on the
   * dark theme (SPEC.md Known limitations).
   */
  .md1-progress-circular__track {
    stroke: color-mix(in srgb, var(--md1-black, #000000) 10%, transparent);
  }

  /* Each value step eases on the standard curve, the page's rule for movement within screen bounds. */
  .md1-progress-circular__arc {
    transition: stroke-dasharray var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /*
   * Indeterminate: the arc rotates while its sweep grows and shrinks (page
   * video). The 1.4 s cycle is a decision (not in the spec); the sweep eases
   * on the standard curve and the rotation is linear so the speed reads even.
   */
  .md1-progress-circular[data-state='indeterminate'] > svg {
    animation: md1-progress-circular-rotate 1.4s linear infinite;
  }

  .md1-progress-circular[data-state='indeterminate'] .md1-progress-circular__arc {
    transition: none;
    animation: md1-progress-circular-dash 1.4s var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)) infinite;
  }

  @keyframes md1-progress-circular-rotate {
    from {
      transform: rotate(-90deg);
    }

    to {
      transform: rotate(270deg);
    }
  }

  /* Dash lengths are in pathLength units, so 80 is 80% of any circumference. */
  @keyframes md1-progress-circular-dash {
    0% {
      stroke-dasharray: 1 200;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 80 200;
      stroke-dashoffset: -12;
    }

    100% {
      stroke-dasharray: 80 200;
      stroke-dashoffset: -99;
    }
  }

  /*
   * FAB integration (page: "A circular loader may be integrated with a floating
   * action button"): the ring takes the accent, the FAB's own colour, and sits
   * 4 dp outside the 56 dp FAB it wraps, so the host box is the FAB's and the
   * ring overhangs it by half the difference. The 4 dp gap is read from the
   * page video (low confidence); the completion flip to a check glyph is the
   * FAB's, documented on the progress-circular page. The ring is centred in
   * that box, so an explicit `size` still draws concentric with the FAB.
   */
  .md1-progress-circular[data-fab] {
    position: absolute;
    inset: -4px;
    align-items: center;
    justify-content: center;
    color: var(--md1-accent, #FF4081);
    pointer-events: none;
  }

  /*
   * Reduced motion: the rotation and the sweep slow to half speed so the
   * indicator still reads as activity (web notes: slow or freeze). The
   * plugin's body attribute wins over the OS query, so `mode: 'never'` keeps
   * the spec motion.
   */
  body[data-reduced-motion='reduce'] .md1-progress-circular[data-state='indeterminate'] > svg,
  body[data-reduced-motion='reduce'] .md1-progress-circular[data-state='indeterminate'] .md1-progress-circular__arc {
    animation-duration: 2.8s;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-progress-circular[data-state='indeterminate'] > svg,
    body:not([data-reduced-motion='no-preference']) .md1-progress-circular[data-state='indeterminate'] .md1-progress-circular__arc {
      animation-duration: 2.8s;
    }
  }
</style>
