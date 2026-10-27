<script setup lang="ts">
  import { Md1Button, Md1List, Md1Subheader } from '@paper/md1'
  import { nextTick, ref, shallowRef, useTemplateRef } from 'vue'

  const starter = [
    { id: 'notes', name: 'Field notes.pdf', detail: '2.4 MB, Yesterday' },
    { id: 'itinerary', name: 'Lisbon itinerary.docx', detail: '86 KB, Mon' },
    { id: 'receipt', name: 'Hotel receipt.pdf', detail: '140 KB, Sep 12' },
    { id: 'boarding', name: 'Boarding pass.png', detail: '310 KB, Sep 10' },
  ]

  const files = ref([...starter])
  const status = shallowRef('')
  const sheet = useTemplateRef<HTMLElement>('sheet')

  // The delete buttons in row order, read after the DOM settles.
  function buttons () {
    return [...(sheet.value?.querySelectorAll<HTMLElement>('.md1-list__action button') ?? [])]
  }

  async function onDelete (index: number) {
    const [file] = files.value.splice(index, 1)

    await nextTick()

    // The focused button is gone: take the row that slid into its place, the
    // new last row when the list shrank from the end, or the empty state's action.
    const rows = buttons()
    const next = rows[Math.min(index, rows.length - 1)]
      ?? sheet.value?.querySelector<HTMLElement>('.md1-docs-a11y-recover-empty button')

    next?.focus()

    status.value = `Deleted ${file?.name}. ${files.value.length} ${files.value.length === 1 ? 'file' : 'files'} left.`
  }

  async function onRestore () {
    files.value = [...starter]
    status.value = 'Downloads restored.'

    await nextTick()

    buttons()[0]?.focus()
  }
</script>

<template>
  <div class="md1-docs-a11y-recover">
    <div ref="sheet" class="md1-docs-a11y-recover-sheet md1-elevation-2">
      <template v-if="files.length > 0">
        <Md1Subheader>Downloads</Md1Subheader>

        <Md1List aria-label="Downloads" :lines="2">
          <Md1List.Item v-for="(file, index) in files" :key="file.id">
            <Md1List.Icon name="file-download" />

            <Md1List.Content>
              <Md1List.Primary>{{ file.name }}</Md1List.Primary>

              <Md1List.Secondary>{{ file.detail }}</Md1List.Secondary>
            </Md1List.Content>

            <Md1List.Action>
              <Md1Button :aria-label="`Delete ${file.name}`" icon="delete" @click="onDelete(index)" />
            </Md1List.Action>
          </Md1List.Item>
        </Md1List>
      </template>

      <div v-else class="md1-docs-a11y-recover-empty">
        <p class="md1-docs-a11y-recover-message">No downloads</p>

        <Md1Button @click="onRestore">Restore downloads</Md1Button>
      </div>
    </div>

    <p class="md1-docs-a11y-note" role="status">{{ status || 'Delete a file with the keyboard: focus stays in the list' }}</p>
  </div>
</template>

<style>
  .md1-docs-a11y-recover {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    width: 100%;
  }

  /* A list sheet with room for four two-line rows, so the empty state does not collapse the figure. */
  .md1-docs-a11y-recover-sheet {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    min-height: 344px;
    padding-block: var(--md1-spacing-1, 8px);
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-a11y-recover-sheet .md1-list .md1-icon {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-a11y-recover-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--md1-spacing-1, 8px);
    min-height: 328px;
  }

  .md1-docs-a11y-recover-message {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-subhead-size, 16px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
