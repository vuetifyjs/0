<script setup lang="ts">
  import { Md1Button, Md1Fab, Md1List, Md1Switch, Md1Toolbar } from '@paper/md1'
  import { useEventListener, useResizeObserver } from '@vuetify/v0'
  import { ref, shallowRef, useTemplateRef } from 'vue'

  const show = shallowRef(true)
  const screen = useTemplateRef<HTMLElement>('screen')

  interface Stop {
    top: number
    left: number
  }

  const stops = ref<Stop[]>([])
  const current = shallowRef(-1)

  const tabbable = 'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'

  function items () {
    // Roving groups expose one tab stop; skip the members holding tabindex -1.
    return [...(screen.value?.querySelectorAll<HTMLElement>(tabbable) ?? [])]
      .filter(el => el.tabIndex >= 0 && el.getClientRects().length > 0)
  }

  // Number every tab stop in the order Tab reaches it: the source order.
  function measure () {
    const el = screen.value

    if (!el) return

    const box = el.getBoundingClientRect()

    stops.value = items().map(item => {
      const rect = item.getBoundingClientRect()

      return { top: rect.top - box.top + rect.height / 2, left: rect.left - box.left + rect.width / 2 }
    })
  }

  useResizeObserver(screen, measure)

  useEventListener(screen, 'focusin', event => {
    current.value = items().indexOf(event.target as HTMLElement)
  })

  useEventListener(screen, 'focusout', () => {
    current.value = -1
  })

  const mail = [
    { id: 'brunch', subject: 'Brunch this weekend?', from: 'Ali Connors' },
    { id: 'summer', subject: 'Summer BBQ', from: 'Trevor Hansen' },
  ]
</script>

<template>
  <div class="md1-docs-a11y-stack">
    <Md1Switch v-model="show" label="Show focus order" />

    <div ref="screen" class="md1-docs-screen md1-docs-a11y-focus-screen">
      <!-- The most important actions sit at the top, so they come first in reading and focus order. -->
      <Md1Toolbar variant="primary">
        <Md1Toolbar.Nav aria-label="Show/hide navigation menu" />

        <Md1Toolbar.Title>Inbox</Md1Toolbar.Title>

        <Md1Toolbar.Actions>
          <Md1Button aria-label="Search" icon="search" />

          <Md1Button aria-label="More options" icon="more-vert" />
        </Md1Toolbar.Actions>
      </Md1Toolbar>

      <Md1List aria-label="Inbox" :lines="2">
        <Md1List.Item v-for="message in mail" :key="message.id" href="#">
          <Md1List.Content>
            <Md1List.Primary>{{ message.subject }}</Md1List.Primary>

            <Md1List.Secondary>{{ message.from }}</Md1List.Secondary>
          </Md1List.Content>
        </Md1List.Item>
      </Md1List>

      <Md1Fab aria-label="Compose" icon="edit" />

      <div v-if="show" aria-hidden="true" class="md1-docs-a11y-focus-layer">
        <span
          v-for="(stop, index) in stops"
          :key="index"
          class="md1-docs-a11y-focus-stop"
          :data-current="current === index || undefined"
          :style="{ top: `${stop.top}px`, left: `${stop.left}px` }"
        >{{ index + 1 }}</span>
      </div>
    </div>

    <p class="md1-docs-a11y-note" role="status">{{ current >= 0 ? `Focus is on stop ${current + 1} of ${stops.length}` : 'Tab into the screen to follow the order' }}</p>
  </div>
</template>

<style>
  .md1-docs-a11y-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    width: 100%;
  }

  .md1-docs-a11y-focus-screen {
    width: 100%;
    max-width: 360px;
    outline: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-a11y-focus-layer {
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
  }

  /* The figure's green circles, centred on each tab stop. */
  .md1-docs-a11y-focus-stop {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #2E7D32;
    color: #FFFFFF;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: 12px;
    font-weight: 500;
    translate: -50% -50%;
    opacity: 0.9;
  }

  .md1-docs-a11y-focus-stop[data-current] {
    outline: 3px solid #A5D6A7;
    opacity: 1;
  }

  .md1-docs-a11y-note {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
