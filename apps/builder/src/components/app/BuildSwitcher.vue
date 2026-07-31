<script setup lang="ts">
  import { mdiCheck, mdiChevronDown, mdiPencil, mdiPlus } from '@mdi/js'

  // Framework
  import { Button, Input, Popover } from '@vuetify/v0'

  // Context
  import Icon from './Icon.vue'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { nextTick, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  const store = useBuilderStore()

  const open = shallowRef(false)
  const renaming = shallowRef(false)
  const name = shallowRef('')

  // Input.Control is rendered `renderless` so this ref lands on the real <input>. A ref on
  // the component itself would hold a component instance, which has no focus()/select().
  const field = useTemplateRef<HTMLInputElement>('field')

  // Until the first edit there is no build to name — say so rather than inventing one.
  const label = toRef(() => store.active?.name ?? 'No build yet')
  const hasActive = toRef(() => store.active !== null)

  // A switcher over a single build is just a label — the actions still matter, so it stays,
  // but there is nothing to switch between until a second build exists.
  const others = toRef(() => store.builds.filter(entry => entry.id !== store.activeId))

  // Closing mid-rename must not leave the form armed for the next open.
  watch(open, value => {
    if (!value) renaming.value = false
  })

  async function onRename () {
    name.value = label.value
    renaming.value = true
    await nextTick()
    field.value?.focus()
    field.value?.select()
  }

  async function onCommit () {
    if (!store.activeId) return

    await store.renameBuild(store.activeId, name.value)
    renaming.value = false
  }

  // Escape cancels the rename and stops there — the popover's own light-dismiss would
  // otherwise close the whole surface on the same keystroke. A second Escape closes it.
  function onCancel (event: KeyboardEvent) {
    event.stopPropagation()
    renaming.value = false
  }

  async function onSwitch (id: string) {
    await store.switchTo(id)
    open.value = false
  }

  async function onCreate () {
    await store.createBuild()
    open.value = false
  }
</script>

<template>
  <Popover.Root v-model="open">
    <!-- PopoverActivator supplies aria-expanded and aria-controls but not aria-haspopup. -->
    <Popover.Activator
      aria-haspopup="menu"
      :aria-label="`Current build: ${label}. Switch or create a build`"
      class="inline-flex min-w-0 items-center gap-1.5 h-9 max-w-[7.5rem] sm:max-w-[11rem] px-2.5 rounded-md text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors duration-150 cursor-pointer"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />

      <span class="font-mono text-[0.8125rem] truncate">{{ label }}</span>

      <Icon class="flex-shrink-0 opacity-60" :path="mdiChevronDown" :size="14" />
    </Popover.Activator>

    <Popover.Content
      aria-label="Builds"
      class="floating m-0 p-1.5 w-64 rounded-xl"
    >
      <div class="px-2 py-1.5">
        <p class="t-eyebrow text-on-surface-variant">{{ hasActive ? 'Current build' : 'No build yet' }}</p>
      </div>

      <div v-if="renaming && hasActive" class="px-1.5 pb-1.5 flex items-center gap-1.5">
        <Input.Root v-model="name" class="flex-1" label="Build name">
          <Input.Control v-slot="{ attrs }" renderless>
            <input
              ref="field"
              v-bind="attrs"
              class="field-input h-8"
              placeholder="Build name"
              @keydown.enter.prevent="onCommit"
              @keydown.esc.prevent="onCancel"
            >
          </Input.Control>
        </Input.Root>

        <Button.Root aria-label="Save build name" class="btn-ghost h-8 w-8 p-0" @click="onCommit">
          <Button.Icon>
            <Icon :path="mdiCheck" :size="14" />
          </Button.Icon>
        </Button.Root>
      </div>

      <div v-else class="px-1.5 pb-1.5 flex items-center gap-1.5">
        <span class="flex-1 min-w-0 font-mono text-[0.8125rem] truncate px-1.5">{{ label }}</span>

        <Button.Root
          v-if="hasActive"
          aria-label="Rename this build"
          class="btn-ghost h-8 w-8 p-0"
          @click="onRename"
        >
          <Button.Icon>
            <Icon :path="mdiPencil" :size="14" />
          </Button.Icon>
        </Button.Root>
      </div>

      <template v-if="others.length > 0">
        <div class="border-t border-divider mt-0.5 pt-1.5 px-2 pb-1">
          <p class="t-eyebrow text-on-surface-variant">Switch to</p>
        </div>

        <ul class="max-h-64 overflow-y-auto">
          <li v-for="entry in others" :key="entry.id">
            <Button.Root
              class="w-full h-9 px-2.5 rounded-md flex items-center gap-2 text-left hover:bg-surface-variant transition-colors duration-150"
              @click="onSwitch(entry.id)"
            >
              <Button.Content class="flex-1 min-w-0">
                <span class="block font-mono text-[0.8125rem] truncate">{{ entry.name }}</span>
              </Button.Content>
            </Button.Root>
          </li>
        </ul>
      </template>

      <div class="border-t border-divider mt-0.5 pt-1.5">
        <Button.Root
          class="w-full h-9 px-2.5 rounded-md flex items-center gap-2 text-left text-primary hover:bg-primary/8 transition-colors duration-150"
          @click="onCreate"
        >
          <Button.Icon>
            <Icon :path="mdiPlus" :size="14" />
          </Button.Icon>

          <Button.Content>
            <span class="text-[0.8125rem] font-medium">New build</span>
          </Button.Content>
        </Button.Root>
      </div>
    </Popover.Content>
  </Popover.Root>
</template>
