<script lang="ts">
  // Framework
  import { clamp, isNumber, Presence, Progress, useLocale } from '@vuetify/v0'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { PresenceState, ProgressRootProps, ProgressRootSlotProps } from '@vuetify/v0'

  /**
   * Quantum withholds `min`, `max`, `name`, `id` and `modelValue` from v0's
   * progress root: the page states progress as a percentage that fills from 0
   * to 100 (so `value` and `buffer` are percentages), the indicator has no
   * text and submits nothing (ruling 7), and the value is an output, so it is
   * a prop rather than a model.
   */
  export interface QuProgressLinearProps extends Pick<ProgressRootProps, 'ariaLabel' | 'namespace'> {
    /** Percent complete, 0 to 100. Leave it unset for the indeterminate indicator. */
    value?: number
    /**
     * Percent buffered, 0 to 100: the buffer variant. The buffered extent is
     * drawn in the track tint ahead of the fill and the unbuffered remainder as
     * a dotted trail.
     */
    buffer?: number
    /** The query variant: the indeterminate sweep runs in reverse until `value` arrives. */
    query?: boolean
  }

  /** The hooks Quantum binds on the root beside the v0 progressbar attrs. A `type`, so it satisfies `mergeProps`' index signature. */
  type QuProgressLinearAttrs = {
    'role': 'progressbar'
    'aria-valuemin': number
    'aria-valuemax': number
    'aria-valuenow': number | undefined
    'aria-valuetext': string | undefined
    'aria-label': string
    'aria-busy': true | undefined
    'data-state': 'determinate' | 'indeterminate'
    'data-complete': true | undefined
    'data-query': true | undefined
    'data-buffer': true | undefined
    'data-presence': PresenceState
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuProgressLinear', inheritAttrs: false })

  const {
    value,
    buffer,
    query = false,
    ariaLabel: _ariaLabel,
    namespace,
  } = defineProps<QuProgressLinearProps>()

  const attrs = useAttrs()
  const locale = useLocale()

  // v0 reads a value of 0 as indeterminate (no segment above zero); the spec's
  // determinate bar starts at 0%, so the state hook and the ARIA values come
  // from Quantum's own prop and the root renders through v0's renderless path.
  const determinate = toRef(() => isNumber(value))
  const percent = toRef(() => clamp(value ?? 0, 0, 100))
  const buffered = toRef(() => isNumber(buffer))

  // The indicator has no text of its own, so the accessible name falls back to
  // the page's one word for what it shows: the app loading content.
  const label = toRef(() => _ariaLabel ?? locale.ti('Quantum.loading') ?? 'Loading')

  // The buffer variant announces both extents (web notes); the plain bar keeps v0's percent text.
  const text = toRef(() => {
    if (!determinate.value) return undefined

    const done = Math.round(percent.value)

    if (!buffered.value) return `${done}%`

    const ahead = Math.round(clamp(buffer ?? 0, 0, 100))

    return locale.ti('Quantum.buffered', { value: done, buffer: ahead }) ?? `${done}%, ${ahead}% buffered`
  })

  function bind (root: ProgressRootSlotProps['attrs'], presence: PresenceState) {
    const own: QuProgressLinearAttrs = {
      'role': root.role,
      'aria-valuemin': root['aria-valuemin'],
      'aria-valuemax': root['aria-valuemax'],
      'aria-valuenow': determinate.value ? percent.value : undefined,
      'aria-valuetext': text.value,
      'aria-label': label.value,
      'aria-busy': determinate.value ? undefined : true,
      'data-state': determinate.value ? 'determinate' : 'indeterminate',
      'data-complete': determinate.value && percent.value >= 100 ? true : undefined,
      'data-query': query || undefined,
      'data-buffer': buffered.value || undefined,
      'data-presence': presence,
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
    <Presence v-slot="{ attrs: phase }" :model-value="true">
      <div v-bind="bind(root, phase['data-state'])" class="quantum-progress-linear">
        <Progress.Track class="quantum-progress-linear__track" :namespace />

        <Progress.Buffer
          v-if="buffered"
          class="quantum-progress-linear__buffer"
          :namespace
          :value="buffer"
        />

        <Progress.Fill class="quantum-progress-linear__fill" :namespace />
      </div>
    </Presence>
  </Progress.Root>
</template>

<!-- Unscoped, like every Quantum stylesheet: the parts are v0 Atoms. -->
<style>
  /*
   * A 4 dp bar the full width of the header or sheet edge it sits on
   * (progress-activity page, measured). The layers are siblings positioned
   * over the root, which clips them: track, then buffer, then fill.
   */
  .quantum-progress-linear {
    position: relative;
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 4px;
    overflow: hidden;
    transform-origin: top;
  }

  .quantum-progress-linear__track,
  .quantum-progress-linear__buffer,
  .quantum-progress-linear__fill {
    position: absolute;
    inset-block: 0;
    inset-inline-start: 0;
    height: 100%;
  }

  /* The track is the indicator colour at 30% (measured 0.33 over the sheet). */
  .quantum-progress-linear__track {
    width: 100%;
    background: rgb(var(--quantum-primary-channels, 63 81 181) / 0.3);
  }

  /*
   * Buffer variant: the buffered extent takes the track tint, and the
   * unbuffered remainder past its edge is a dotted trail in the same tint
   * (page video). The trail hangs off the buffer's end edge and the root
   * clips it, so the dots start exactly where the buffer stops and never show
   * through the translucent buffer. The dot geometry (2 dp dots at an 8 dp
   * pitch) is a decision; the page shows the trail in video only.
   */
  .quantum-progress-linear[data-buffer] .quantum-progress-linear__track {
    background: transparent;
  }

  .quantum-progress-linear__buffer {
    background: rgb(var(--quantum-primary-channels, 63 81 181) / 0.3);
    transition: width var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-progress-linear__buffer::after {
    content: '';
    position: absolute;
    inset-block: 0;
    inset-inline-start: 100%;
    width: 100vw;
    background: radial-gradient(circle, rgb(var(--quantum-primary-channels, 63 81 181) / 0.3) 0 1px, transparent 1.5px) 0 0 / 8px 4px repeat-x;
  }

  /*
   * Determinate: the fill is the primary colour and its width is the percent
   * v0 writes inline; 0% draws nothing. Each step eases on the standard curve,
   * the page's rule for movement within screen bounds; the value only grows.
   */
  .quantum-progress-linear__fill {
    width: 0;
    background: var(--quantum-primary, #3F51B5);
    transition: width var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /*
   * Indeterminate: two segments sweep the track (page video). The segments are
   * the track's pseudo-elements, so the fill stays at 0 width (v0 writes no
   * width while indeterminate) and a query bar that turns determinate grows
   * its fill from the start edge instead of shrinking from full width: the
   * page's determinate bar never decreases. The 2 s cycle is a decision (not
   * in the spec); the curve is the standard curve.
   */
  .quantum-progress-linear[data-state='indeterminate'] .quantum-progress-linear__track::before,
  .quantum-progress-linear[data-state='indeterminate'] .quantum-progress-linear__track::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    background: var(--quantum-primary, #3F51B5);
    animation-duration: 2s;
    animation-timing-function: var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
    animation-iteration-count: infinite;
  }

  .quantum-progress-linear[data-state='indeterminate'] .quantum-progress-linear__track::before {
    animation-name: quantum-progress-linear-long;
  }

  .quantum-progress-linear[data-state='indeterminate'] .quantum-progress-linear__track::after {
    animation-name: quantum-progress-linear-short;
  }

  /*
   * Query runs the sweep from the end edge toward the start while the request
   * is pending (page: "Query Indeterminate"). A right-to-left document mirrors
   * the sweep the same way, so query under RTL is the forward sweep again.
   */
  .quantum-progress-linear[data-state='indeterminate'][data-query] .quantum-progress-linear__track::before,
  [dir='rtl'] .quantum-progress-linear[data-state='indeterminate'] .quantum-progress-linear__track::before {
    animation-name: quantum-progress-linear-long-reverse;
  }

  .quantum-progress-linear[data-state='indeterminate'][data-query] .quantum-progress-linear__track::after,
  [dir='rtl'] .quantum-progress-linear[data-state='indeterminate'] .quantum-progress-linear__track::after {
    animation-name: quantum-progress-linear-short-reverse;
  }

  [dir='rtl'] .quantum-progress-linear[data-state='indeterminate'][data-query] .quantum-progress-linear__track::before {
    animation-name: quantum-progress-linear-long;
  }

  [dir='rtl'] .quantum-progress-linear[data-state='indeterminate'][data-query] .quantum-progress-linear__track::after {
    animation-name: quantum-progress-linear-short;
  }

  @keyframes quantum-progress-linear-long {
    0% {
      left: -90%;
      right: 100%;
    }

    60% {
      left: -90%;
      right: 100%;
    }

    100% {
      left: 100%;
      right: -35%;
    }
  }

  @keyframes quantum-progress-linear-short {
    0% {
      left: -200%;
      right: 100%;
    }

    60% {
      left: 107%;
      right: -8%;
    }

    100% {
      left: 107%;
      right: -8%;
    }
  }

  @keyframes quantum-progress-linear-long-reverse {
    0% {
      right: -90%;
      left: 100%;
    }

    60% {
      right: -90%;
      left: 100%;
    }

    100% {
      right: 100%;
      left: -35%;
    }
  }

  @keyframes quantum-progress-linear-short-reverse {
    0% {
      right: -200%;
      left: 100%;
    }

    60% {
      right: 107%;
      left: -8%;
    }

    100% {
      right: 107%;
      left: -8%;
    }
  }

  /*
   * Appear: the bar is an element entering the screen, so it grows out of the
   * edge it is attached to over the enter duration on the deceleration curve
   * (motion page). `mounted` is Presence's tick before paint, hidden so the
   * first frame is the start of the animation rather than the resting bar.
   */
  .quantum-progress-linear[data-presence='mounted'] {
    opacity: 0;
  }

  .quantum-progress-linear[data-presence='present'] {
    animation: quantum-progress-linear-in var(--quantum-duration-enter, 225ms) var(--quantum-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }

  @keyframes quantum-progress-linear-in {
    from {
      opacity: 0;
      transform: scaleY(0);
    }
  }

  /*
   * Reduced motion: the bar appears in place and the sweep slows to half speed
   * so it still reads as activity (web notes: slow or freeze; a frozen segment
   * would read as stalled determinate progress). The plugin's body attribute
   * wins over the OS query, so `mode: 'never'` keeps the spec motion.
   */
  body[data-reduced-motion='reduce'] .quantum-progress-linear[data-presence='present'] {
    animation: none;
  }

  body[data-reduced-motion='reduce'] .quantum-progress-linear[data-state='indeterminate'] .quantum-progress-linear__track::before,
  body[data-reduced-motion='reduce'] .quantum-progress-linear[data-state='indeterminate'] .quantum-progress-linear__track::after {
    animation-duration: 4s;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-progress-linear[data-presence='present'] {
      animation: none;
    }

    body:not([data-reduced-motion='no-preference']) .quantum-progress-linear[data-state='indeterminate'] .quantum-progress-linear__track::before,
    body:not([data-reduced-motion='no-preference']) .quantum-progress-linear[data-state='indeterminate'] .quantum-progress-linear__track::after {
      animation-duration: 4s;
    }
  }
</style>
