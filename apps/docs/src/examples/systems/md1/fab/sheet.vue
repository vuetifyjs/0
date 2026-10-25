<script setup lang="ts">
  import { Md1Card, Md1Fab, Md1List, Md1Subheader, useMorph } from '@paper/md1'
  import { nextTick, shallowRef, useTemplateRef } from 'vue'

  const fab = useTemplateRef('fab')
  const sheet = useTemplateRef('sheet')
  const open = shallowRef(false)
  const busy = shallowRef(false)
  const shared = shallowRef<string>()
  const { morph } = useMorph()

  const people = ['Ali Connors', 'Sandra Adams', 'Trevor Hansen']

  async function onOpen () {
    if (busy.value) return

    busy.value = true
    open.value = true
    await nextTick()
    ;(await morph({ from: fab, to: sheet, clip: '.md1-card' }))()
    busy.value = false
  }

  // The morph is reversible: the sheet folds back into the button it came from.
  async function onClose (name?: unknown) {
    if (!open.value || busy.value) return

    busy.value = true
    shared.value = (name as string | undefined) ?? shared.value

    const done = await morph({ from: fab, to: sheet, clip: '.md1-card', reverse: true })

    open.value = false
    await nextTick()
    done()
    busy.value = false
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-fab-screen" @click.self="onClose()">
    <p class="md1-docs-fab-note" role="status">
      {{ shared ? `Shared with ${shared}.` : 'Press the button to share this page.' }}
    </p>

    <Md1Fab
      ref="fab"
      aria-label="Share"
      :class="{ 'md1-docs-fab-away': open }"
      icon="share"
      @click="onOpen"
    />

    <div v-if="open" ref="sheet" class="md1-docs-fab-morph">
      <Md1Card>
        <Md1Subheader>Share with</Md1Subheader>

        <Md1List aria-label="Share with" :model-value="undefined" @update:model-value="onClose">
          <Md1List.Item v-for="person in people" :key="person" :value="person">
            <Md1List.Icon name="person" />

            <Md1List.Content>
              <Md1List.Primary>{{ person }}</Md1List.Primary>
            </Md1List.Content>
          </Md1List.Item>
        </Md1List>
      </Md1Card>
    </div>
  </div>
</template>

<style>
  .md1-docs-fab-away {
    visibility: hidden;
  }

  /* The sheet joins the screen under the status line, above the FAB, so the arc rises clear of the bottom edge. */
  .md1-docs-fab-morph {
    position: absolute;
    inset: 56px 16px auto auto;
    width: 240px;
    z-index: 2;
  }
</style>
