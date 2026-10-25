<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Fab, Md1List, Md1NavigationDrawer, Md1Subheader, Md1Switch, Md1Toolbar, Md1ToggleButtons } from '@paper/md1'
  import { useResizeObserver } from '@vuetify/v0'
  import { nextTick, ref, shallowRef, useTemplateRef, watch } from 'vue'

  const screen = shallowRef('list')
  const lines = shallowRef(true)

  const frame = useTemplateRef<HTMLElement>('frame')

  interface Redline {
    top: number
    height: number
  }

  const redlines = ref<Redline[]>([])
  const margin = shallowRef(0)

  // Every block marked `data-redline` is measured where it renders, so the
  // numbers are the components' real heights, not a copy of the spec's.
  function measure () {
    const el = frame.value

    if (!el) return

    const box = el.getBoundingClientRect()

    redlines.value = [...el.querySelectorAll<HTMLElement>('[data-redline]')].map(block => {
      const rect = block.getBoundingClientRect()

      return { top: rect.top - box.top, height: Math.round(rect.height) }
    }).filter(line => line.top < box.height)

    const drawer = el.querySelector<HTMLElement>('.md1-navigation-drawer')

    // The sheet's own width: its 1 dp edge divider belongs to the margin side.
    margin.value = drawer ? Math.round(box.width - Number.parseFloat(getComputedStyle(drawer).width)) : 0
  }

  useResizeObserver(frame, measure)

  watch(screen, async () => {
    await nextTick()
    measure()
  })

  const mail = [
    { id: 'brunch', subject: 'Brunch this weekend?', from: 'Ali Connors' },
    { id: 'summer', subject: 'Summer BBQ', from: 'Trevor Hansen' },
    { id: 'oui', subject: 'Oui oui', from: 'Sandra Adams' },
    { id: 'gift', subject: 'Birthday gift', from: 'Britta Holt' },
  ]
</script>

<template>
  <div class="md1-docs-layout-pattern-stack">
    <div class="md1-docs-layout-vspace-controls">
      <Md1ToggleButtons v-model="screen" label="Screen" mandatory>
        <Md1ToggleButtons.Item value="list">List</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item value="detail">Detail</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item value="drawer">Drawer</Md1ToggleButtons.Item>
      </Md1ToggleButtons>

      <Md1Switch v-model="lines" label="Redlines" />
    </div>

    <div class="md1-docs-layout-vspace-frame">
      <div ref="frame" class="md1-docs-screen md1-docs-layout-vspace-screen">
        <!-- The status bar is the platform's, drawn here only so the spacing reads from the top of the screen. -->
        <div aria-hidden="true" class="md1-docs-layout-vspace-status" data-redline />

        <template v-if="screen === 'list'">
          <Md1Toolbar data-redline variant="primary">
            <Md1Toolbar.Nav />

            <Md1Toolbar.Title>Inbox</Md1Toolbar.Title>

            <Md1Toolbar.Actions>
              <Md1Button aria-label="Search" icon="search" />
            </Md1Toolbar.Actions>
          </Md1Toolbar>

          <Md1Subheader data-redline>Today</Md1Subheader>

          <Md1List aria-label="Today" :lines="2">
            <Md1List.Item v-for="message in mail" :key="message.id" data-redline>
              <Md1List.Avatar>{{ message.from[0] }}</Md1List.Avatar>

              <Md1List.Content>
                <Md1List.Primary>{{ message.subject }}</Md1List.Primary>

                <Md1List.Secondary>{{ message.from }}</Md1List.Secondary>
              </Md1List.Content>
            </Md1List.Item>
          </Md1List>

          <Md1Fab aria-label="Compose" icon="edit" />
        </template>

        <template v-else-if="screen === 'detail'">
          <Md1Toolbar data-redline variant="primary">
            <Md1Toolbar.Nav icon="up" />

            <Md1Toolbar.Title>Contact</Md1Toolbar.Title>
          </Md1Toolbar>

          <div aria-hidden="true" class="md1-docs-layout-vspace-gap" data-redline />

          <Md1Card class="md1-docs-layout-vspace-card">
            <Md1List aria-label="Contact">
              <Md1List.Item data-redline :lines="2">
                <Md1List.Avatar>A</Md1List.Avatar>

                <Md1List.Content>
                  <Md1List.Primary>Ali Connors</Md1List.Primary>

                  <Md1List.Secondary>Product designer</Md1List.Secondary>
                </Md1List.Content>
              </Md1List.Item>
            </Md1List>

            <Md1Subheader data-redline>Phone</Md1Subheader>

            <Md1List aria-label="Phone" :lines="2">
              <Md1List.Item data-redline>
                <Md1List.Icon name="phone" />

                <Md1List.Content>
                  <Md1List.Primary>(650) 555-1234</Md1List.Primary>

                  <Md1List.Secondary>Mobile</Md1List.Secondary>
                </Md1List.Content>
              </Md1List.Item>
            </Md1List>
          </Md1Card>

          <div aria-hidden="true" class="md1-docs-layout-vspace-gap" data-redline />

          <Md1Card class="md1-docs-layout-vspace-card">
            <Md1List aria-label="Email" :lines="2">
              <Md1List.Item data-redline>
                <Md1List.Icon name="email" />

                <Md1List.Content>
                  <Md1List.Primary>ali@example.com</Md1List.Primary>

                  <Md1List.Secondary>Work</Md1List.Secondary>
                </Md1List.Content>
              </Md1List.Item>
            </Md1List>
          </Md1Card>
        </template>

        <Md1NavigationDrawer v-else type="permanent">
          <Md1NavigationDrawer.Content>
            <Md1List aria-label="Account">
              <Md1List.Item data-redline>
                <Md1List.Icon name="account-circle" />

                ada@example.com
              </Md1List.Item>
            </Md1List>

            <div aria-hidden="true" class="md1-docs-layout-vspace-gap" data-redline />

            <Md1List aria-label="Folders" model-value="inbox">
              <Md1List.Item data-redline value="inbox">
                <Md1List.Icon name="inbox" />

                Inbox
              </Md1List.Item>

              <Md1List.Item data-redline value="starred">
                <Md1List.Icon name="star" />

                Starred
              </Md1List.Item>

              <Md1List.Item data-redline value="sent">
                <Md1List.Icon name="send" />

                Sent mail
              </Md1List.Item>
            </Md1List>
          </Md1NavigationDrawer.Content>
        </Md1NavigationDrawer>
      </div>

      <!-- Outside the screen, in a gutter of its own, so the redlines never cover the UI. -->
      <div v-if="lines" aria-hidden="true" class="md1-docs-layout-vspace-lines">
        <span
          v-for="(line, index) in redlines"
          :key="index"
          class="md1-docs-layout-vspace-line"
          :style="{ top: `${line.top}px`, height: `${line.height}px` }"
        >
          <span class="md1-docs-layout-vspace-label">{{ line.height }}</span>
        </span>

        <span v-if="margin" class="md1-docs-layout-vspace-margin" :style="{ width: `${margin}px` }">
          <span class="md1-docs-layout-vspace-label">{{ margin }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-layout-vspace-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-layout-vspace-frame {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    max-width: 416px;
    padding-inline-end: 56px;
  }

  .md1-docs-layout-vspace-screen {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 560px;
    outline: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    background: var(--md1-background, #FAFAFA);
  }

  /* The drawer variant lays the drawer at the start with the screen's width less its margin beside it. */
  .md1-docs-layout-vspace-screen:has(.md1-navigation-drawer) {
    display: flex;
    flex-direction: column;
  }

  .md1-docs-layout-vspace-screen .md1-navigation-drawer {
    flex: 1 1 auto;
  }

  .md1-docs-layout-vspace-status {
    height: 24px;
    background: var(--md1-primary-dark, #303F9F);
  }

  .md1-docs-layout-vspace-gap {
    height: var(--md1-spacing-1, 8px);
  }

  .md1-docs-layout-vspace-card {
    margin-inline: var(--md1-spacing-1, 8px);
  }

  /* Redlines: a bracket per measured block on the end edge, labelled in dp. */
  .md1-docs-layout-vspace-lines {
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
  }

  .md1-docs-layout-vspace-line {
    position: absolute;
    inset-inline-end: 48px;
    box-sizing: border-box;
    width: 8px;
    border: 1px solid #E91E63;
    border-inline-start: 0;
    background: rgb(233 30 99 / 0.08);
  }

  .md1-docs-layout-vspace-margin {
    position: absolute;
    inset-block-end: var(--md1-spacing-2, 16px);
    inset-inline-end: 56px;
    box-sizing: border-box;
    height: 8px;
    border: 1px solid #E91E63;
    border-top: 0;
  }

  .md1-docs-layout-vspace-label {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: calc(100% + 4px);
    translate: 0 -50%;
    padding: 0 4px;
    border-radius: 2px;
    background: #E91E63;
    color: #FFFFFF;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: 11px;
    line-height: 16px;
  }

  .md1-docs-layout-vspace-margin .md1-docs-layout-vspace-label {
    inset-block-start: auto;
    inset-block-end: calc(100% + 4px);
    inset-inline-start: 50%;
    translate: -50% 0;
  }
</style>
