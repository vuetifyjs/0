<script setup lang="ts">
  // Framework
  import { Popover, useBreakpoints, useStorage } from '@vuetify/v0'

  // Components
  import AppIcon from '@/components/app/AppIcon.vue'
  import AppTooltip from '@/components/app/AppTooltip.vue'
  import PlaygroundAuthDialog from '@/components/playground/app/PlaygroundAuthDialog.vue'
  import PlaygroundSaveDialog from '@/components/playground/app/PlaygroundSaveDialog.vue'
  import PlaygroundOpenDialog from '@/components/playground/open/PlaygroundOpenDialog.vue'

  // Context
  import { usePlayground } from './PlaygroundApp.vue'

  // Composables
  import { useOnePlaygrounds } from '@/composables/useOnePlaygrounds'

  // Utilities
  import { onBeforeUnmount, shallowRef, watch } from 'vue'

  const playground = usePlayground()
  const {
    currentId: oneId,
    currentTitle: oneTitle,
    saving: oneSaving,
    autosaveEnabled,
    setAutosave,
    save: saveOne,
  } = useOnePlaygrounds()
  const breakpoints = useBreakpoints()
  const storage = useStorage()
  const sidePref = storage.get('playground-preview-right', false)

  const menu = shallowRef(false)
  const file = shallowRef(false)
  const view = shallowRef(false)
  const confirming = shallowRef(false)
  const dialog = shallowRef(false)
  const saveOpen = shallowRef(false)
  const saveAs = shallowRef(false)
  const saveBusy = shallowRef(false)
  let confirmTimer = 0

  onBeforeUnmount(() => clearTimeout(confirmTimer))

  watch(menu, open => {
    if (!open) {
      clearTimeout(confirmTimer)
      confirming.value = false
    }
  })

  function onSubmenu (target: 'file' | 'view') {
    file.value = target === 'file'
    view.value = target === 'view'
  }

  function onOpen () {
    menu.value = false
    dialog.value = true
  }

  function onSave (asNew = false) {
    menu.value = false
    file.value = false
    saveAs.value = asNew
    saveOpen.value = true
  }

  /** Manual push for a linked playground (works with auto-save on or off). */
  async function onSaveNow () {
    if (!oneId.value || saveBusy.value) return
    saveBusy.value = true
    try {
      await saveOne(playground.snapshotContent())
      menu.value = false
      file.value = false
    } catch {
      // error stays on one.error
    } finally {
      saveBusy.value = false
    }
  }

  function onAutosaveToggle () {
    setAutosave(!autosaveEnabled.value)
  }

  function onReset () {
    if (confirming.value) {
      clearTimeout(confirmTimer)
      confirming.value = false
      menu.value = false
      playground.applyPreset(playground.activePreset.value)
    } else {
      confirming.value = true
      confirmTimer = window.setTimeout(() => {
        confirming.value = false
      }, 3000)
    }
  }

  function onTree () {
    menu.value = false
    playground.tree.value = !playground.tree.value
  }

  function onSide () {
    menu.value = false
    playground.side.value = !playground.side.value
    playground.bottom.value = !playground.bottom.value
    sidePref.value = playground.side.value
  }

  function onIntro () {
    menu.value = false
    playground.left.value = !playground.left.value
    const open = playground.left.value

    if (open && !breakpoints.isMobile.value && playground.side.value) {
      playground.side.value = false
      playground.bottom.value = true
    } else if (!open && !breakpoints.isMobile.value && sidePref.value && !playground.side.value) {
      playground.side.value = true
      playground.bottom.value = false
    }
  }
</script>

<template>
  <Popover.Root v-model="menu">
    <Popover.Activator
      class="pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity"
      :class="menu ? 'opacity-80' : 'opacity-50'"
      target="playground-menu"
      title="Menu"
    >
      <AppIcon icon="menu" />
    </Popover.Activator>

    <Popover.Content
      id="playground-menu"
      class="bg-surface border border-divider rounded-md shadow-lg py-1 min-w-40"
      position-area="bottom span-right"
    >
      <!-- File submenu -->
      <Popover.Root v-model="file">
        <Popover.Activator
          class="w-full flex items-center justify-between px-3 py-1.5 text-xs text-on-surface hover:bg-surface-tint transition-colors cursor-pointer text-left"
          target="playground-menu-file"
          @focus="onSubmenu('file')"
          @mouseenter="onSubmenu('file')"
        >
          <span>File</span>
          <AppIcon icon="chevron-right" :size="14" />
        </Popover.Activator>

        <Popover.Content
          id="playground-menu-file"
          class="bg-surface border border-divider rounded-md shadow-lg py-1 min-w-48"
          style="position-area: unset; inset-area: unset; top: anchor(top); left: anchor(right); position-try-fallbacks: flip-block;"
        >
          <button
            class="w-full flex items-center justify-between px-3 py-1.5 text-xs text-on-surface hover:bg-surface-tint transition-colors text-left"
            type="button"
            @click="onOpen"
          >
            Open
          </button>

          <div class="border-t border-divider my-1" />

          <!--
            Linked + auto-save on: dimmed One# identity + switch (no Save).
            Linked + auto-save off: Save action + switch (no One#).
            Unlinked: Save to Vuetify One only.
          -->
          <div
            v-if="oneId && autosaveEnabled"
            class="w-full flex items-center justify-between gap-2 px-3 py-1.5 text-xs"
          >
            <span class="min-w-0 flex-1 truncate tabular-nums text-on-surface-variant">
              One#{{ oneId }}
            </span>

            <AppTooltip
              as="span"
              class="inline-flex shrink-0 text-on-surface-variant opacity-80"
              :open-delay="200"
              position-area="top"
              :text="oneSaving || saveBusy
                ? 'Syncing…'
                : `Auto-saving to Vuetify One (${oneTitle})`"
            >
              <AppIcon
                :icon="oneSaving || saveBusy ? 'cloud-sync' : 'cloud-check'"
                :size="14"
              />
            </AppTooltip>

            <button
              :aria-checked="true"
              aria-label="Auto-save"
              class="relative shrink-0 h-4 w-7 rounded-full bg-primary transition-colors cursor-pointer border-0 p-0"
              role="switch"
              type="button"
              @click="onAutosaveToggle"
            >
              <span class="absolute top-0.5 left-3.5 size-3 rounded-full bg-on-primary" />
            </button>
          </div>

          <div
            v-else-if="oneId"
            class="w-full flex items-center justify-between gap-2 px-3 py-1.5 text-xs text-on-surface hover:bg-surface-tint"
          >
            <button
              class="min-w-0 flex-1 text-left bg-transparent border-0 p-0 text-xs text-on-surface cursor-pointer disabled:opacity-50"
              :disabled="saveBusy"
              type="button"
              @click="onSaveNow"
            >
              {{ saveBusy ? 'Saving…' : 'Save' }}
            </button>

            <AppTooltip
              as="span"
              class="inline-flex shrink-0 opacity-70"
              :open-delay="200"
              position-area="top"
              text="Auto-save off"
            >
              <AppIcon icon="save" :size="14" />
            </AppTooltip>

            <button
              :aria-checked="false"
              aria-label="Auto-save"
              class="relative shrink-0 h-4 w-7 rounded-full bg-surface-variant transition-colors cursor-pointer border-0 p-0"
              role="switch"
              type="button"
              @click="onAutosaveToggle"
            >
              <span class="absolute top-0.5 left-0.5 size-3 rounded-full bg-on-surface-variant" />
            </button>
          </div>

          <button
            v-else
            class="w-full flex items-center justify-between px-3 py-1.5 text-xs text-on-surface hover:bg-surface-tint transition-colors text-left"
            type="button"
            @click="onSave(false)"
          >
            Save to Vuetify One
          </button>

          <button
            v-if="oneId"
            class="w-full flex items-center justify-between px-3 py-1.5 text-xs text-on-surface hover:bg-surface-tint transition-colors text-left"
            type="button"
            @click="onSave(false)"
          >
            Rename
          </button>

          <button
            v-if="oneId"
            class="w-full flex items-center justify-between px-3 py-1.5 text-xs text-on-surface hover:bg-surface-tint transition-colors text-left"
            type="button"
            @click="onSave(true)"
          >
            Save as new
          </button>

          <div class="border-t border-divider my-1" />

          <button
            class="w-full flex items-center justify-between px-3 py-1.5 text-xs transition-colors text-left"
            :class="confirming ? 'text-error bg-error/10' : 'text-on-surface hover:bg-surface-tint'"
            type="button"
            @click="onReset"
          >
            {{ confirming ? 'Click to confirm' : 'Reset Playground' }}
          </button>
        </Popover.Content>
      </Popover.Root>

      <!-- View submenu -->
      <Popover.Root v-model="view">
        <Popover.Activator
          class="w-full flex items-center justify-between px-3 py-1.5 text-xs text-on-surface hover:bg-surface-tint transition-colors cursor-pointer text-left"
          target="playground-menu-view"
          @focus="onSubmenu('view')"
          @mouseenter="onSubmenu('view')"
        >
          <span>View</span>
          <AppIcon icon="chevron-right" :size="14" />
        </Popover.Activator>

        <Popover.Content
          id="playground-menu-view"
          class="bg-surface border border-divider rounded-md shadow-lg py-1 min-w-48"
          style="position-area: unset; inset-area: unset; top: anchor(top); left: anchor(right); position-try-fallbacks: flip-block;"
        >
          <button
            class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-on-surface hover:bg-surface-tint transition-colors text-left"
            type="button"
            @click="onTree"
          >
            <AppIcon :icon="playground.tree.value ? 'folder-open' : 'folder'" :size="14" />
            <span class="flex-1">File Tree</span>
            <span class="text-on-surface/40 text-2.5">Ctrl+B</span>
          </button>

          <button
            class="w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors text-left"
            :class="playground.left.value ? 'text-on-surface/40 cursor-not-allowed' : 'text-on-surface hover:bg-surface-tint'"
            type="button"
            @click="!playground.left.value && onSide()"
          >
            <AppIcon :icon="playground.side.value ? 'layout-vertical' : 'layout-horizontal'" :size="14" />
            {{ playground.side.value ? 'Preview Bottom' : 'Preview Right' }}
          </button>

          <div class="border-t border-divider my-1" />

          <button
            class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-on-surface hover:bg-surface-tint transition-colors text-left"
            type="button"
            @click="onIntro"
          >
            <AppIcon :icon="playground.left.value ? 'book-open' : 'book-closed'" :size="14" />
            Intro Panel
          </button>
        </Popover.Content>
      </Popover.Root>
    </Popover.Content>
  </Popover.Root>

  <PlaygroundOpenDialog
    v-if="dialog"
    @close="dialog = false"
  />

  <PlaygroundSaveDialog
    v-model="saveOpen"
    :as-new="saveAs"
  />

  <PlaygroundAuthDialog />
</template>
