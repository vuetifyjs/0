<script lang="ts">
  // Framework
  import { DataTable, Dialog, Input, isNumber, isString, Popover, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useMd1DataTable } from './Md1DataTable.vue'

  // Utilities
  import { nextTick, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Components
  import Md1Button from '../Md1Button/Md1Button.vue'
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  /** The two edit dialogs of the data tables page: a sheet over the cell, or a modal dialog. */
  export type Md1DataTableEditable = 'small' | 'large'

  export interface Md1DataTableCellProps {
    /** A cell of numbers: right-aligned. */
    numeric?: boolean
    /**
     * Makes the cell editable. `small` opens a raised sheet over the cell with
     * one text field, confirmed by Enter; `large` opens a dialog confirmed only
     * by Save. Escape, Cancel and an outside press revert.
     */
    editable?: Md1DataTableEditable
    /** Shown at 38% while the value is empty: the page denotes editable fields by placeholder text. */
    placeholder?: string
    /** The field's accessible name and the large dialog's title. Defaults to "Edit". */
    label?: string
    /** A character limit: the editor shows "used/limit" and refuses to save past it. */
    counter?: number
    /** The optional 18 dp edit icon at the cell edge opposite the content. */
    icon?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DataTableCell' })

  defineSlots<{
    /** The cell content. For an editable cell it defaults to the value. */
    default?: () => any
  }>()

  const {
    numeric = false,
    editable,
    placeholder,
    label,
    counter,
    icon = false,
  } = defineProps<Md1DataTableCellProps>()

  const model = defineModel<string>({ default: '' })

  const context = useMd1DataTable()
  const locale = useLocale()

  orphan('Md1DataTableCell', context)

  const open = shallowRef(false)
  const draft = shallowRef('')
  const field = useTemplateRef<HTMLElement>('field')

  const name = toRef(() => label ?? locale.ti('Md1.edit') ?? 'Edit')
  const cancel = toRef(() => locale.ti('Md1.cancel') ?? 'Cancel')
  const save = toRef(() => locale.ti('Md1.save') ?? 'Save')
  const empty = toRef(() => !isString(model.value) || model.value.length === 0)
  const over = toRef(() => isNumber(counter) && draft.value.length > counter)

  // Every open starts from the committed value; a revert is simply not writing it back.
  watch(open, value => {
    if (!value) return

    draft.value = model.value

    nextTick(() => {
      const input = field.value?.querySelector('input')

      input?.focus()
      input?.select()
    })
  })

  function onConfirm () {
    if (over.value) return

    model.value = draft.value
    open.value = false
  }

  function onCancel () {
    open.value = false
  }

  // The small sheet confirms on Enter; the large dialog confirms only through Save (data tables page).
  function onKeydown (event: KeyboardEvent) {
    if (event.key !== 'Enter') return

    event.preventDefault()
    onConfirm()
  }
</script>

<template>
  <DataTable.Cell
    class="md1-data-table__cell"
    :data-editable="editable"
    :data-editing="open || undefined"
    :data-numeric="numeric || undefined"
  >
    <Popover.Root
      v-if="editable === 'small'"
      v-model="open"
      position-area="center"
    >
      <Popover.Activator class="md1-data-table__edit">
        <Md1Ripple />

        <span
          v-if="empty"
          class="md1-data-table__placeholder"
        >
          {{ placeholder }}
        </span>

        <span
          v-else
          class="md1-data-table__value"
        >
          <slot>{{ model }}</slot>
        </span>

        <span
          v-if="icon"
          class="md1-data-table__pencil"
        >
          <Md1Icon name="mode-edit" />
        </span>
      </Popover.Activator>

      <Popover.Content class="md1-data-table__sheet">
        <div
          ref="field"
          class="md1-data-table__field"
          @keydown="onKeydown"
        >
          <Input.Root
            v-model="draft"
            class="md1-data-table__input"
            :label="name"
          >
            <Input.Control class="md1-data-table__control" />
          </Input.Root>

          <span
            v-if="isNumber(counter)"
            class="md1-data-table__counter"
            :data-over="over || undefined"
          >
            {{ draft.length }}/{{ counter }}
          </span>
        </div>
      </Popover.Content>
    </Popover.Root>

    <Dialog.Root
      v-else-if="editable === 'large'"
      v-model="open"
    >
      <Dialog.Activator class="md1-data-table__edit">
        <Md1Ripple />

        <span
          v-if="empty"
          class="md1-data-table__placeholder"
        >
          {{ placeholder }}
        </span>

        <span
          v-else
          class="md1-data-table__value"
        >
          <slot>{{ model }}</slot>
        </span>

        <span
          v-if="icon"
          class="md1-data-table__pencil"
        >
          <Md1Icon name="mode-edit" />
        </span>
      </Dialog.Activator>

      <Dialog.Content
        class="md1-data-table__dialog"
        :scrim="false"
      >
        <div class="md1-data-table__dialog-sheet">
          <Dialog.Title class="md1-data-table__dialog-title">
            {{ name }}
          </Dialog.Title>

          <div
            ref="field"
            class="md1-data-table__field"
          >
            <Input.Root
              v-model="draft"
              class="md1-data-table__input"
              :label="name"
            >
              <Input.Control class="md1-data-table__control" />
            </Input.Root>

            <span
              v-if="isNumber(counter)"
              class="md1-data-table__counter"
              :data-over="over || undefined"
            >
              {{ draft.length }}/{{ counter }}
            </span>
          </div>

          <div class="md1-data-table__dialog-actions">
            <Md1Button @click="onCancel">
              {{ cancel }}
            </Md1Button>

            <Md1Button
              :disabled="over"
              @click="onConfirm"
            >
              {{ save }}
            </Md1Button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>

    <slot v-else />
  </DataTable.Cell>
</template>

<style>
  /*
   * An editable cell hands its box to the activator, which carries the cell's
   * own padding so the text stays on the keylines and the sheet can align with
   * the cell's divider lines and edges (the page's small edit dialog rule).
   */
  .md1-data-table__cell[data-editable] {
    padding: 0;
  }

  .md1-data-table__edit {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    /* The row is 48 dp including the cell's 1 dp divider. */
    height: 47px;
    margin: 0;
    padding: 0 28px;
    border: 0;
    border-radius: 0;
    background: transparent;
    font: inherit;
    letter-spacing: inherit;
    text-align: inherit;
    white-space: inherit;
    color: inherit;
    cursor: text;
    -webkit-tap-highlight-color: transparent;
  }

  .md1-data-table__row > :first-child .md1-data-table__edit {
    padding-inline-start: var(--md1-spacing-3, 24px);
  }

  .md1-data-table__row > :last-child .md1-data-table__edit {
    padding-inline-end: var(--md1-spacing-3, 24px);
  }

  .md1-data-table__select + .md1-data-table__cell .md1-data-table__edit {
    padding-inline-start: 0;
  }

  .md1-data-table__cell[data-numeric] .md1-data-table__edit {
    flex-direction: row-reverse;
  }

  .md1-data-table__edit:focus-visible {
    outline: 2px solid transparent;
    background-color: var(--md1-focus, rgba(0, 0, 0, 0.12));
  }

  .md1-data-table__value,
  .md1-data-table__placeholder {
    position: relative;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Placeholder text, 13 sp at 38%, with no line under it (data tables page). */
  .md1-data-table__placeholder {
    color: var(--md1-text-hint, rgba(0, 0, 0, 0.38));
  }

  /* The 18 dp edit icon at 54%, at the cell edge opposite the content. */
  .md1-data-table__pencil {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    margin-inline-start: auto;
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }
  /* Md1Icon sets its own size property, so the host retunes the glyph on the icon itself. */
  .md1-data-table__pencil .md1-icon {
    --md1-icon-size: 18px;
  }

  .md1-data-table__cell[data-numeric] .md1-data-table__pencil {
    margin-inline-start: 0;
    margin-inline-end: auto;
  }

  /*
   * The small edit dialog: a raised sheet the width of the cell, centred over
   * it, 24 dp padding on each side, one text field. The page states no
   * elevation for it; the inline menu's 8 dp. Layout lives on the inner field,
   * not on the popover element, so the UA's display: none still hides it.
   */
  .md1-data-table__sheet {
    box-sizing: border-box;
    width: anchor-size(width);
    min-width: 180px;
    min-height: 56px;
    margin: 0;
    padding: 0 var(--md1-spacing-3, 24px);
    border: 0;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    overflow: visible;
  }

  .md1-data-table__sheet .md1-data-table__field {
    min-height: 56px;
  }

  .md1-data-table__field {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-data-table__input {
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
  }

  /*
   * The field: the text at the table's 13 sp over the text-fields page's
   * line, 1 dp at 42% black (70% white) rising to 2 dp in the accent on focus.
   * No token carries that pair; the line derives it from the primary text
   * channel (0 for black, 255 for white), as Md1TextField does. Scaling the
   * hover token by 7 drifted to 41% / 71%: the 8-digit hex rounds 10% white.
   */
  .md1-data-table__control {
    box-sizing: border-box;
    width: 100%;
    height: 32px;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    outline: 0;
    background: transparent;
    box-shadow: inset 0 -1px 0 rgb(from var(--md1-text-primary, rgba(0, 0, 0, 0.87)) r g b / calc(0.42 + 0.28 * r / 255));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: 13px;
    line-height: 20px;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    transition: box-shadow var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /*
   * The 2 dp accent line is the field's focus indicator (text fields page). The
   * outline is transparent so a host's focus ring cannot box the field, and solid
   * so forced colours mode, which drops box shadows, still draws one.
   */
  .md1-data-table__control:focus,
  .md1-data-table__control:focus-visible {
    outline: 2px solid transparent;
    box-shadow: inset 0 -2px 0 var(--md1-accent, #FF4081);
  }

  /* The character counter, Caption 12 sp at 54%; over the limit it takes the error colour. */
  .md1-data-table__counter {
    flex-shrink: 0;
    font-size: var(--md1-type-caption-size, 12px);
    font-weight: var(--md1-font-weight-regular, 400);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-data-table__counter[data-over] {
    color: var(--md1-error, #FF1744);
  }

  /* The large edit dialog follows the dialogs page: 24 dp padding, 24 dp elevation, title, field, Cancel and Save. */
  .md1-data-table__dialog {
    padding: 0;
    margin: auto;
    border: none;
    background: transparent;
    max-width: calc(100vw - 80px);
    max-height: calc(100vh - 48px);
    overflow: visible;
  }

  .md1-data-table__dialog::backdrop {
    background: var(--md1-scrim, rgba(33, 33, 33, 0.46));
  }

  .md1-data-table__dialog-sheet {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: fit-content;
    min-width: 280px;
    max-width: 560px;
    padding: var(--md1-spacing-3, 24px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
    box-shadow: var(--md1-elevation-24, 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-data-table__dialog-title {
    margin: 0 0 20px;
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-type-title-weight, 500);
    line-height: 28px;
    letter-spacing: var(--md1-type-title-tracking, 0.005em);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* The dialog's field is a full text field: Regular 16 sp over the same line. */
  .md1-data-table__dialog-sheet .md1-data-table__control {
    height: 40px;
    font-size: var(--md1-type-subheading-size, 16px);
    line-height: var(--md1-type-subheading-leading, 24px);
  }

  .md1-data-table__dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--md1-spacing-1, 8px);
    box-sizing: border-box;
    min-height: 52px;
    padding: var(--md1-spacing-1, 8px);
    margin: var(--md1-spacing-3, 24px) calc(-1 * var(--md1-spacing-3, 24px)) calc(-1 * var(--md1-spacing-3, 24px));
  }
</style>
