<script setup lang="ts">
  import { QuButton, QuProgressCircular } from '@paper/quantum'
  import { useTimer } from '@vuetify/v0'
  import { ref, shallowRef, toRef, useTemplateRef } from 'vue'

  /** Pull distance, in px, past which a release refreshes. A decision: the pattern page gives no number. */
  const THRESHOLD = 72
  /** Where the indicator rests while the refresh runs: near the top of the refreshing content. */
  const REST = 16

  const list = useTemplateRef<HTMLElement>('list')

  const messages = ref([
    { id: 1, from: 'Ali Connors', text: 'Brunch this weekend?' },
    { id: 2, from: 'Sandra Adams', text: 'Summer BBQ plans' },
    { id: 3, from: 'Trevor Hansen', text: 'Oui oui, the Paris trip' },
    { id: 4, from: 'Britta Holt', text: 'Birthday gift ideas' },
    { id: 5, from: 'Jennifer Lee', text: 'Recipe to try' },
    { id: 6, from: 'Kai Rivera', text: 'Board meeting notes' },
  ])

  const pull = shallowRef(0)
  const dragging = shallowRef(false)
  const refreshing = shallowRef(false)
  const top = shallowRef(true)
  const status = shallowRef('')

  let start = 0
  let next = 7

  // At rest the disc waits 48 px above the content, clear of the clip with its shadow, so a cancelled pull slides back out of sight.
  // Past the threshold the indicator moves at a third of the finger's speed: the cue that letting go now refreshes.
  const offset = toRef(() => refreshing.value
    ? REST
    : (pull.value < THRESHOLD ? pull.value : THRESHOLD + (pull.value - THRESHOLD) / 3) - 48)

  const armed = toRef(() => pull.value >= THRESHOLD)

  // While pulling, the arc grows with the distance up to 80% of the ring and the disc turns with it, then turns slower past the threshold.
  const arc = toRef(() => Math.min(pull.value / THRESHOLD, 1) * 80)
  const turn = toRef(() => armed.value ? THRESHOLD * 2 + (pull.value - THRESHOLD) : pull.value * 2)

  const indicator = toRef(() => ({
    transform: `translate(-50%, ${offset.value}px) rotate(${refreshing.value ? 0 : turn.value}deg)`,
    opacity: refreshing.value || armed.value ? 1 : 0.4 + 0.6 * (pull.value / THRESHOLD),
    transition: dragging.value ? 'none' : undefined,
  }))

  const done = useTimer(() => {
    messages.value.unshift({ id: next, from: 'Quantum', text: `New message ${next}` })
    next++
    refreshing.value = false
    pull.value = 0
    status.value = 'Inbox updated.'
  }, { duration: 1800 })

  function onRefresh () {
    if (refreshing.value) return

    refreshing.value = true
    status.value = 'Refreshing.'
    done.start()
  }

  function onScroll () {
    top.value = (list.value?.scrollTop ?? 0) <= 0
  }

  function onDown (event: PointerEvent) {
    if (refreshing.value || !top.value || event.button !== 0) return

    start = event.clientY
    dragging.value = true
    list.value?.setPointerCapture(event.pointerId)
  }

  function onMove (event: PointerEvent) {
    if (!dragging.value) return

    // Resistance: the content follows the finger at 60% so the pull feels attached to a weight.
    pull.value = Math.max(0, (event.clientY - start) * 0.6)
  }

  function onUp () {
    if (!dragging.value) return

    dragging.value = false

    // Releasing short of the threshold, or after reversing back above it, cancels.
    if (armed.value) {
      onRefresh()
    } else {
      pull.value = 0
    }
  }
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-refresh">
    <div class="quantum-docs-refresh-bar">
      <span class="quantum-docs-refresh-title">Inbox</span>

      <QuButton aria-label="Refresh" :disabled="refreshing" icon="refresh" @click="onRefresh" />
    </div>

    <div class="quantum-docs-refresh-viewport">
      <div
        :aria-hidden="refreshing ? undefined : 'true'"
        class="quantum-docs-refresh-indicator"
        :style="indicator"
      >
        <QuProgressCircular aria-label="Refreshing inbox" :size="28" :value="refreshing ? undefined : arc" />
      </div>

      <div
        ref="list"
        class="quantum-docs-refresh-list"
        :data-top="top || undefined"
        @pointercancel="onUp"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @scroll="onScroll"
      >
        <div v-for="message in messages" :key="message.id" class="quantum-docs-refresh-row">
          <span class="quantum-docs-refresh-from">{{ message.from }}</span>

          <span class="quantum-docs-refresh-text">{{ message.text }}</span>
        </div>
      </div>
    </div>

    <span class="quantum-docs-refresh-status" role="status">{{ status }}</span>
  </div>
</template>

<style>
  .quantum-docs-refresh {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-refresh-bar {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    height: var(--quantum-increment, 56px);
    padding-inline: var(--quantum-keyline-margin, 16px) 4px;
    background: var(--quantum-primary, #3F51B5);
    color: var(--quantum-on-primary, #FFFFFF);
    box-shadow: var(--quantum-elevation-4, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12));
    position: relative;
    z-index: 1;
  }

  /* Icon buttons on a primary bar take its white ink. */
  .quantum-docs-refresh-bar .quantum-button[data-variant] {
    color: inherit;
  }

  .quantum-docs-refresh-title {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-title-size, 20px);
    font-weight: var(--quantum-type-title-weight, 500);
  }

  /* Clips the indicator while it slides out from under the app bar. */
  .quantum-docs-refresh-viewport {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  /* The refresh indicator: a 40 dp disc on the surface colour at 3 dp, centred horizontally. */
  .quantum-docs-refresh-indicator {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--quantum-surface, #FFFFFF);
    box-shadow: var(--quantum-elevation-3, 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12));
    transition:
      transform var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      opacity var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-docs-refresh-list {
    height: 100%;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    user-select: none;
  }

  /* At the top the vertical pull belongs to the page script; scrolled down, the browser scrolls as usual. */
  .quantum-docs-refresh-list[data-top] {
    touch-action: pan-x pan-down;
  }

  .quantum-docs-refresh-row {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 72px;
    padding-inline: var(--quantum-keyline-margin, 16px);
    border-bottom: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
  }

  .quantum-docs-refresh-from {
    font-size: var(--quantum-type-subheading-size, 16px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-docs-refresh-text {
    font-size: var(--quantum-type-body-1-size, 14px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-refresh-status {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
