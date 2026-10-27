<script setup lang="ts">
  import { Md1Button, Md1ProgressCircular } from '@paper/md1'
  import { useTimer } from '@vuetify/v0'
  import { nextTick, onMounted, ref, shallowRef, toRef, useTemplateRef } from 'vue'

  /** Pull distance, in px, past which a release refreshes. A decision: the pattern page gives no number. */
  const THRESHOLD = 72
  /** Where the indicator rests while the refresh runs: near the bottom of the refreshing content. */
  const REST = 16

  const list = useTemplateRef<HTMLElement>('list')

  const messages = ref([
    { id: 1, mine: false, text: 'Are you still coming to the market on Saturday?' },
    { id: 2, mine: true, text: 'Yes! What time are you heading over?' },
    { id: 3, mine: false, text: 'Around nine, before the bakery sells out.' },
    { id: 4, mine: true, text: 'Perfect. I will bring the big basket.' },
    { id: 5, mine: false, text: 'Can you grab coffee on the way?' },
    { id: 6, mine: true, text: 'Flat white, no sugar?' },
  ])

  // The replies that arrive with each refresh, newest last.
  const replies = [
    'Exactly, thank you!',
    'Also, Sam might join us.',
    'See you at the north entrance.',
  ]

  const pull = shallowRef(0)
  const dragging = shallowRef(false)
  const refreshing = shallowRef(false)
  const bottom = shallowRef(true)
  const status = shallowRef('')

  let start = 0
  let next = 7

  // At rest the disc waits 48 px below the content, clear of the clip with its shadow, so a cancelled pull slides back out of sight.
  // Past the threshold the indicator moves at a third of the finger's speed: the cue that letting go now refreshes.
  const offset = toRef(() => refreshing.value
    ? REST
    : (pull.value < THRESHOLD ? pull.value : THRESHOLD + (pull.value - THRESHOLD) / 3) - 48)

  const armed = toRef(() => pull.value >= THRESHOLD)

  // While pulling, the arc grows with the distance up to 80% of the ring and the disc turns with it, then turns slower past the threshold.
  const arc = toRef(() => Math.min(pull.value / THRESHOLD, 1) * 80)
  const turn = toRef(() => armed.value ? THRESHOLD * 2 + (pull.value - THRESHOLD) : pull.value * 2)

  // The mirror of the top composition: the disc rises from the bottom edge, so the offset is negative.
  const indicator = toRef(() => ({
    transform: `translate(-50%, ${-offset.value}px) rotate(${refreshing.value ? 0 : turn.value}deg)`,
    opacity: refreshing.value || armed.value ? 1 : 0.4 + 0.6 * (pull.value / THRESHOLD),
    transition: dragging.value ? 'none' : undefined,
  }))

  function onEnd () {
    if (!list.value) return

    list.value.scrollTop = list.value.scrollHeight
  }

  onMounted(onEnd)

  const done = useTimer(async () => {
    const text = replies[(next - 7) % replies.length]!

    messages.value.push({ id: next, mine: false, text })
    next++
    refreshing.value = false
    pull.value = 0
    status.value = 'New message loaded.'

    // The newest message is the one the reader came for, so the list follows it down.
    await nextTick()
    onEnd()
  }, { duration: 1800 })

  function onRefresh () {
    if (refreshing.value) return

    refreshing.value = true
    status.value = 'Loading newer messages.'
    done.start()
  }

  function onScroll () {
    const el = list.value

    bottom.value = !el || el.scrollHeight - el.scrollTop - el.clientHeight <= 1
  }

  function onDown (event: PointerEvent) {
    if (refreshing.value || !bottom.value || event.button !== 0) return

    start = event.clientY
    dragging.value = true
    list.value?.setPointerCapture(event.pointerId)
  }

  function onMove (event: PointerEvent) {
    if (!dragging.value) return

    // Resistance: the content follows the finger at 60% so the pull feels attached to a weight. Upward is positive here.
    pull.value = Math.max(0, (start - event.clientY) * 0.6)
  }

  function onUp () {
    if (!dragging.value) return

    dragging.value = false

    // Releasing short of the threshold, or after reversing back below it, cancels.
    if (armed.value) {
      onRefresh()
    } else {
      pull.value = 0
    }
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-refresh-chat">
    <div class="md1-docs-refresh-chat-bar">
      <span class="md1-docs-refresh-chat-title">Maya Okafor</span>

      <Md1Button aria-label="Load newer messages" :disabled="refreshing" icon="refresh" @click="onRefresh" />
    </div>

    <div class="md1-docs-refresh-chat-viewport">
      <div
        ref="list"
        class="md1-docs-refresh-chat-list"
        :data-bottom="bottom || undefined"
        @pointercancel="onUp"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @scroll="onScroll"
      >
        <p
          v-for="message in messages"
          :key="message.id"
          class="md1-docs-refresh-chat-message"
          :data-mine="message.mine || undefined"
        >
          {{ message.text }}
        </p>
      </div>

      <div
        :aria-hidden="refreshing ? undefined : 'true'"
        class="md1-docs-refresh-chat-indicator"
        :style="indicator"
      >
        <Md1ProgressCircular aria-label="Loading newer messages" :size="28" :value="refreshing ? undefined : arc" />
      </div>
    </div>

    <span class="md1-docs-refresh-chat-status" role="status">{{ status }}</span>
  </div>
</template>

<style>
  .md1-docs-refresh-chat {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-refresh-chat-bar {
    position: relative;
    z-index: 1;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    height: var(--md1-increment, 56px);
    padding-inline: var(--md1-keyline-margin, 16px) 4px;
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
    box-shadow: var(--md1-elevation-4, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12));
  }

  /* Icon buttons on a primary bar take its white ink. */
  .md1-docs-refresh-chat-bar .md1-button[data-variant] {
    color: inherit;
  }

  .md1-docs-refresh-chat-title {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-type-title-weight, 500);
  }

  /* Clips the indicator while it rises from under the content's bottom edge. */
  .md1-docs-refresh-chat-viewport {
    position: relative;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  /* The refresh indicator: a 40 dp disc on the surface colour at 3 dp, centred horizontally on the bottom edge. */
  .md1-docs-refresh-chat-indicator {
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-3, 0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12));
    transition:
      transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      opacity var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-refresh-chat-list {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    box-sizing: border-box;
    height: 100%;
    padding: var(--md1-spacing-2, 16px);
    overflow-y: auto;
    overscroll-behavior-y: contain;
    user-select: none;
  }

  /* At the bottom the upward pull belongs to the page script; scrolled up, the browser scrolls as usual. */
  .md1-docs-refresh-chat-list[data-bottom] {
    touch-action: pan-x pan-up;
  }

  /* Their messages at the start edge on the surface; yours at the end edge on the primary colour. */
  .md1-docs-refresh-chat-message {
    flex-shrink: 0;
    align-self: flex-start;
    max-width: 75%;
    margin: 0;
    padding: var(--md1-spacing-1, 8px) 12px;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-1);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-refresh-chat-message[data-mine] {
    align-self: flex-end;
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-docs-refresh-chat-status {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }

  @media (prefers-reduced-motion: reduce) {
    .md1-docs-refresh-chat-indicator {
      transition: none;
    }
  }
</style>
