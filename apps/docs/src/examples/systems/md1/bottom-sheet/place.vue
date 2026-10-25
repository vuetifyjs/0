<script setup lang="ts">
  import { useResizeObserver } from '@vuetify/v0'
  import { Md1BottomSheet, Md1Button, Md1Fab, Md1List } from '@paper/md1'
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  const open = shallowRef(true)
  const height = shallowRef(0)
  const layer = shallowRef(0)
  const details = useTemplateRef<HTMLElement>('details')

  // The sheet sizes to its content; follow its height so the FAB can ride its top edge.
  useResizeObserver(() => details.value?.closest<HTMLElement>('.md1-bottom-sheet') ?? undefined, entries => {
    const entry = entries[0]

    height.value = entry?.borderBoxSize[0]?.blockSize ?? 0
    // The FAB floats above the sheet it rides on, whatever level the stack gave the sheet.
    layer.value = (Number.parseInt(entry ? getComputedStyle(entry.target).zIndex : '', 10) || 0) + 1
  })

  // Open, the FAB's centre sits on the sheet's top edge; closed, it returns to the screen's bottom keyline.
  const lift = toRef(() => open.value && height.value > 0 ? { insetBlockEnd: `${height.value - 28}px`, zIndex: layer.value } : undefined)
</script>

<template>
  <div class="md1-docs-screen md1-docs-sheet-map">
    <Md1Button
      aria-label="Dandelion Chocolate"
      class="md1-docs-sheet-pin"
      icon="place"
      @click="open = !open"
    />

    <Md1BottomSheet v-model="open" persistent :teleport="false">
      <div ref="details" class="md1-docs-sheet-place">
        <div class="md1-docs-sheet-place-head">
          <span class="md1-type-headline">Dandelion Chocolate</span>

          <span class="md1-docs-sheet-secondary md1-type-body-1">4.7 (51 reviews) · Chocolate shop</span>

          <span class="md1-docs-sheet-eta md1-type-body-1">12 min away</span>
        </div>

        <Md1List aria-label="Place details">
          <Md1List.Item>
            <Md1List.Icon name="place" />

            <Md1List.Content>
              <Md1List.Primary>740 Valencia St, San Francisco, CA</Md1List.Primary>
            </Md1List.Content>
          </Md1List.Item>

          <Md1List.Item>
            <Md1List.Icon name="phone" />

            <Md1List.Content>
              <Md1List.Primary>(415) 349-0942</Md1List.Primary>
            </Md1List.Content>
          </Md1List.Item>

          <Md1List.Item>
            <Md1List.Icon name="schedule" />

            <Md1List.Content>
              <Md1List.Primary>Wed, 10 AM – 9 PM</Md1List.Primary>
            </Md1List.Content>
          </Md1List.Item>
        </Md1List>
      </div>
    </Md1BottomSheet>

    <Md1Fab aria-label="Directions" icon="near-me" :style="lift" />
  </div>
</template>

<style>
  /* A stand-in map: the background with a street grid drawn in the divider ink. */
  .md1-docs-sheet-map {
    height: 480px;
    background-color: var(--md1-background, #FAFAFA);
    background-image:
      linear-gradient(var(--md1-divider, rgba(0, 0, 0, 0.12)) 2px, transparent 2px),
      linear-gradient(90deg, var(--md1-divider, rgba(0, 0, 0, 0.12)) 2px, transparent 2px),
      linear-gradient(35deg, transparent 49%, var(--md1-divider, rgba(0, 0, 0, 0.12)) 49%, var(--md1-divider, rgba(0, 0, 0, 0.12)) 51%, transparent 51%);
    background-size: 64px 64px, 64px 64px, 100% 100%;
  }

  .md1-docs-sheet-pin {
    position: absolute;
    top: 64px;
    left: 50%;
    color: var(--md1-accent, #FF4081);
    transform: translateX(-50%);
  }

  .md1-docs-sheet-place-head {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: var(--md1-spacing-3, 24px) var(--md1-keyline-margin, 16px) var(--md1-spacing-1, 8px);
  }

  .md1-docs-sheet-secondary {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-sheet-eta {
    color: var(--md1-primary, #3F51B5);
  }
</style>
