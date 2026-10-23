<script lang="ts">
  // Framework
  import { Atom, Button, createContext, isElement, isNull, isNullOrUndefined, Popover, useId, useLocale, useLogger, useMutationObserver } from '@vuetify/v0'

  // Utilities
  import { mergeProps, onMounted, shallowRef, toRef, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { QuIconName } from '../../icons'
  import type { ButtonRootProps } from '@vuetify/v0'
  import type { Ref } from 'vue'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  /** What the `Addresses` and `Address` parts read from the chip they sit in. */
  export interface QuChipContext {
    /** The in-field contact chip, the only chip that opens. */
    contact: Readonly<Ref<boolean>>
    disabled: Readonly<Ref<boolean>>
    /** The contact's photo, repeated at 40 dp in the open chip. */
    avatar: Readonly<Ref<string | undefined>>
    /** The label's text: the contact's name at 16 sp in the open chip. */
    name: Readonly<Ref<string>>
    /**
     * An `Addresses` part announces itself so the chip becomes the popover's
     * activator; the returned function withdraws it on unmount.
     */
    register: () => () => void
    /** The id of the element beside the chip that the `Addresses` sheet teleports into; rendered on contact chips only. */
    outlet: string
  }

  /**
   * Quantum withholds every v0 button prop but `disabled`: a chip's accessible
   * name is its label, it never joins a `Button.Group`, and it has no loading,
   * readonly or passive state on the chips page. The press itself is the
   * consumer's `@click` (the page's "opens a full detail view or a menu") or,
   * on a contact chip, the open state with its alternative addresses.
   */
  export interface QuChipProps extends Pick<ButtonRootProps, 'disabled'> {
    /** A glyph role drawn through `QuIcon` ahead of the label: the page's "chip with text and an icon". */
    icon?: QuIconName
    /** A photo at the start edge, filling the chip's height: the contact chip's avatar. `avatar` wins over `icon`. */
    avatar?: string
    /**
     * Shows the delete glyph (`cancel`, 24 dp at 54%) and emits `delete` from
     * it and from the Delete key on the focused chip. Persistent on desktop,
     * as the page requires: Quantum never hides it on hover.
     */
    deletable?: boolean
    /**
     * The in-field contact chip: 8 dp between avatar and name, the name at
     * 14 sp, 40 dp tall at 2 dp while focused, and a press opens the
     * `Addresses` part at 8 dp when one is present.
     */
    contact?: boolean
  }

  const [useQuChip, provideQuChip] = createContext<QuChipContext | null>('quantum:chip', null)

  export { useQuChip }

  /** Dev-time guard for the parts: an orphan renders, but its chip state is inert. */
  export function orphan (part: string, context: QuChipContext | null): void {
    if (__DEV__ && isNull(context)) useLogger().warn(`[${part}] rendered outside <QuChip>; its state is inert`)
  }

  /** The page names Delete; Backspace is what a chip inside a text field receives when the caret backs into it. */
  const DELETE = new Set(['Delete', 'Backspace'])
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuChip', inheritAttrs: false })

  defineSlots<{
    /** The label: free or predefined text, a rule, or a contact's name. */
    default?: () => any
  }>()

  const emit = defineEmits<{
    /** The delete glyph was pressed, or Delete was pressed on the focused chip. The consumer removes the chip. */
    delete: []
  }>()

  const {
    disabled = false,
    icon,
    avatar,
    deletable = false,
    contact = false,
  } = defineProps<QuChipProps>()

  /** The open state of a contact chip's `Addresses`; a second press, a press on the open chip, Escape and a press outside all close it. */
  const open = defineModel<boolean>('open', { default: false })

  const attrs = useAttrs()
  const locale = useLocale()

  const label = useTemplateRef<HTMLElement>('label')
  const name = shallowRef('')
  const focused = shallowRef(false)
  const parts = shallowRef(0)
  const outlet = `quantum-chip-${useId()}`

  // A chip is a button when a press does something: a contact chip opens its
  // addresses, and a consumer click makes any chip the page's action ("opens a
  // full detail view or a menu"). Otherwise it is text printed on the sheet.
  const pressable = toRef(() => contact || !isNullOrUndefined(attrs.onClick))
  const addresses = toRef(() => contact && parts.value > 0)

  const verb = toRef(() => locale.ti('Quantum.delete') ?? 'Delete')
  const remove = toRef(() => name.value ? `${verb.value} ${name.value}` : verb.value)

  // The label is the slot, so its text is read from the DOM: it names the
  // delete control ("Delete Alice Jones") and heads the open contact chip.
  function read () {
    name.value = label.value?.textContent?.trim() ?? ''
  }

  onMounted(read)
  useMutationObserver(label, read, { characterData: true, subtree: true })

  function onClick (event: MouseEvent) {
    // A text chip's delete control is its own Button.Root and emits for itself.
    if (!pressable.value || !deletable || !isElement(event.target) || !event.target.closest('.quantum-chip__delete')) return

    // On a pressable chip the glyph is part of the button, so the press is
    // redirected: no popover toggle (the activation behaviour) and no consumer
    // click (the listener merged after this one).
    event.preventDefault()
    event.stopImmediatePropagation()

    if (!disabled) emit('delete')
  }

  function onKeydown (event: KeyboardEvent) {
    if (!deletable || disabled || event.target !== event.currentTarget || !DELETE.has(event.key)) return

    event.preventDefault()
    emit('delete')
  }

  function onFocusin () {
    focused.value = true
  }

  function onFocusout () {
    focused.value = false
  }

  function onDelete () {
    if (!disabled) emit('delete')
  }

  function onDeleteKeydown (event: KeyboardEvent) {
    if (!DELETE.has(event.key)) return

    event.preventDefault()
    onDelete()
  }

  // Merged ahead of the consumer's attrs so the delete interception runs first.
  const hooks = toRef(() => ({
    'class': 'quantum-chip',
    'data-deletable': deletable || undefined,
    'data-contact': contact || undefined,
    'data-focused': focused.value || undefined,
    'aria-keyshortcuts': pressable.value && deletable ? 'Delete' : undefined,
    'onClick': onClick,
    'onKeydown': onKeydown,
    'onFocusin': onFocusin,
    'onFocusout': onFocusout,
  }))

  const root = toRef(() => mergeProps(
    pressable.value ? { disabled } : { 'as': 'span', 'data-disabled': disabled || undefined },
    hooks.value,
    attrs,
  ))

  provideQuChip({
    contact: toRef(() => contact),
    disabled: toRef(() => disabled),
    avatar: toRef(() => avatar),
    name: toRef(() => name.value),
    register () {
      parts.value++

      return () => {
        parts.value--
      }
    },
    outlet,
  })
</script>

<template>
  <Popover.Root v-model="open">
    <Popover.Activator v-slot="{ attrs: activator }" renderless>
      <component
        :is="pressable ? Button.Root : Atom"
        v-bind="mergeProps(root, addresses ? activator : {})"
      >
        <QuRipple v-if="pressable" />

        <img
          v-if="avatar"
          alt=""
          class="quantum-chip__avatar"
          :src="avatar"
        >

        <span
          v-else-if="icon"
          aria-hidden="true"
          class="quantum-chip__icon"
        >
          <QuIcon :name="icon" />
        </span>

        <span ref="label" class="quantum-chip__label">
          <slot />
        </span>

        <template v-if="deletable">
          <!-- A button cannot hold a button: on a pressable chip the glyph is inert and the root redirects its press. -->
          <Button.Root
            v-if="!pressable"
            :aria-label="remove"
            class="quantum-chip__delete"
            :disabled
            @click="onDelete"
            @keydown="onDeleteKeydown"
          >
            <QuRipple />

            <QuIcon name="cancel" />
          </Button.Root>

          <span
            v-else
            aria-hidden="true"
            class="quantum-chip__delete"
          >
            <QuIcon name="cancel" />
          </span>
        </template>
      </component>
    </Popover.Activator>

    <!--
      Where the Addresses sheet mounts: beside the chip, because a <button>
      cannot hold it, and inside the chip's own tree, so a scoped theme
      (<Theme>, a data-theme panel) still reaches it. `display: contents`
      keeps it out of the layout; a closed popover renders nothing and an
      open one paints in the top layer.
    -->
    <span
      v-if="contact"
      :id="outlet"
      class="quantum-chip__outlet"
    />
  </Popover.Root>
</template>

<!-- Unscoped: Button.Root and Atom are multi-root; a scoped data-v never lands on the rendered element. -->
<style>
  /*
   * 32 dp tall, 12 dp of padding, the 13 sp label at 87% (chips page). The
   * fill (Grey 300, #555555 dark) and the full pill radius are image-derived
   * (SPEC.md); chips are absent from the elevation table, so they rest flat.
   */
  .quantum-chip {
    position: relative;
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    height: 32px;
    max-width: 100%;
    margin: 0;
    padding: 0 12px;
    border: 0;
    border-radius: 16px;
    background: var(--quantum-chip, #E0E0E0);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: 13px;
    font-weight: var(--quantum-font-weight-regular, 400);
    line-height: 1;
    letter-spacing: normal;
    text-align: start;
    text-decoration: none;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-tap-highlight-color: transparent;
    transition:
      height var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      box-shadow 280ms var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-chip__outlet {
    display: contents;
  }

  /* A pressable chip is a native button:the page's "opens a full detail view or a menu", or the contact chip. */
  button.quantum-chip {
    appearance: none;
    cursor: pointer;
    user-select: none;
  }

  /*
   * The 48 dp touch target (metrics and keylines page) around the 32 dp chip as
   * a transparent hit area, as QuButton draws it: no layout cost, no margin.
   */
  button.quantum-chip::after {
    content: '';
    position: absolute;
    inset: calc((32px - var(--quantum-touch-target, 48px)) / 2) 0;
  }

  .quantum-chip[data-contact][data-focused]::after {
    inset: calc((40px - var(--quantum-touch-target, 48px)) / 2) 0;
  }

  /* Hover: the page states no value; the 6% overlay of lead decision 3, painted as a layer over the fill. */
  @media (hover: hover) {
    button.quantum-chip:hover {
      background-image: linear-gradient(var(--quantum-hover, rgba(0, 0, 0, 0.06)), var(--quantum-hover, rgba(0, 0, 0, 0.06)));
    }
  }

  /*
   * Keyboard focus: the 12% overlay every focused Quantum control shows. The
   * outline is transparent so nothing paints beside the overlay, and solid so
   * forced-colours mode still draws a ring.
   */
  button.quantum-chip:focus-visible {
    outline: 2px solid transparent;
    background-image: linear-gradient(var(--quantum-focus, rgba(0, 0, 0, 0.12)), var(--quantum-focus, rgba(0, 0, 0, 0.12)));
  }

  /* "Upon focus, the chip rises to an elevation of 2dp" (chips page): any focus, keyboard or pointer, on the chip or its delete control. */
  .quantum-chip[data-focused] {
    box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  /* The contact chip: the name at 14 sp; focused and activated in its field it grows to 40 dp (the field gives back the 4 dp of padding on each side). */
  .quantum-chip[data-contact] {
    font-size: 14px;
  }

  .quantum-chip[data-contact][data-focused] {
    height: 40px;
  }

  /* The avatar fills the chip's height at the start edge; 8 dp to the name, 12 dp after it (chips page). */
  .quantum-chip:has(> .quantum-chip__avatar) {
    padding-inline-start: 0;
  }

  .quantum-chip__avatar {
    position: relative;
    flex: none;
    height: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    object-fit: cover;
  }

  .quantum-chip__avatar + .quantum-chip__label {
    margin-inline-start: var(--quantum-spacing-1, 8px);
  }

  /*
   * The leading icon has no metrics on the page: a 24 dp glyph at the icon
   * tier (54%), inset 4 dp like the delete glyph, 8 dp before the label
   * (decision, SPEC.md).
   */
  .quantum-chip:has(> .quantum-chip__icon) {
    padding-inline-start: 4px;
  }

  .quantum-chip__icon {
    position: relative;
    display: inline-flex;
    flex: none;
    margin-inline-end: var(--quantum-spacing-1, 8px);
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  /* Positioned so the label paints above the ink layer, which is absolutely positioned on a pressable chip. */
  .quantum-chip__label {
    position: relative;
  }

  /* Deletable: the 24 dp `cancel` glyph at 54% with its 4 dp margin replaces the end padding (chips page). */
  .quantum-chip[data-deletable] {
    padding-inline-end: 4px;
  }

  .quantum-chip__delete {
    position: relative;
    z-index: 1;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    margin: 0;
    margin-inline-start: 4px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
    cursor: pointer;
    transition:
      color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* The glyph's own hit area: the full 48 dp height and the 4 dp either side, without eating the label. */
  .quantum-chip__delete::after {
    content: '';
    position: absolute;
    inset: -12px -4px;
  }

  .quantum-chip__delete .quantum-icon {
    position: relative;
  }

  /* The glyph takes the focused icon tier under the pointer and on keyboard focus; the 12% overlay marks keyboard focus. */
  .quantum-chip__delete:hover,
  .quantum-chip__delete:focus-visible {
    color: var(--quantum-icon-focused, rgba(0, 0, 0, 0.87));
  }

  .quantum-chip__delete:focus-visible {
    outline: 2px solid transparent;
    background-color: var(--quantum-focus, rgba(0, 0, 0, 0.12));
  }

  /*
   * Disabled: the page states nothing; the text drops to the disabled tier
   * (38%, 50% dark) and the glyphs to the inactive icon tier, the chip casts
   * no shadow and takes no pointer. The avatar fades to the same tier (decision).
   */
  .quantum-chip[data-disabled] {
    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
    box-shadow: none;
    cursor: default;
    pointer-events: none;
  }

  .quantum-chip[data-disabled] .quantum-chip__icon,
  .quantum-chip[data-disabled] .quantum-chip__delete {
    color: var(--quantum-icon-inactive, rgba(0, 0, 0, 0.38));
  }

  .quantum-chip[data-disabled] .quantum-chip__avatar {
    opacity: 0.38;
  }
</style>
