<script lang="ts">
  // Framework
  import {
    createCombobox,
    isNullOrUndefined,
    isUndefined,
    useClickOutside,
    usePopover,
  } from '@vuetify/v0'

  // Utilities
  import { mergeProps, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  export interface BComboboxItem {
    /** Submitted value. Also the registry id. */
    value: string
    /** Label rendered in the menu and, once selected, in the toggle. */
    text: string
  }

  export interface BComboboxProps {
    /** Options onboarded into `createCombobox`. An empty list still opens. */
    items?: BComboboxItem[]
    /** Text shown in `.combobox-value` when nothing is selected. */
    placeholder?: string
    /** When set, a hidden input submits the selected value. */
    name?: string
    disabled?: boolean
    /** Adds `form-control-sm` or `form-control-lg` on the toggle. */
    size?: 'sm' | 'lg'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BCombobox', inheritAttrs: false })

  defineEmits<{
    'update:model-value': [value: string | undefined]
  }>()

  const {
    items = [],
    placeholder = '',
    name,
    disabled = false,
    size,
  } = defineProps<BComboboxProps>()

  const model = defineModel<string>()
  const attrs = useAttrs()
  const triggerEl = useTemplateRef<HTMLButtonElement>('trigger')
  const menuEl = useTemplateRef<HTMLElement>('menu')
  const open = shallowRef(false)

  // Selection and filtering live on createCombobox. Its own popover is left
  // unattached: showPopover would throw, and a popover attribute would
  // top-layer the menu. Positioning matches BMenu's bottom-start.
  const box = createCombobox({ strict: true })

  const popover = usePopover({
    isOpen: open,
    positionArea: () => 'block-end span-inline-end',
  })

  watch(menuEl, element => {
    if (isNullOrUndefined(element)) return
    element.showPopover = () => {}
  }, { flush: 'sync' })

  popover.attachAnchor(triggerEl)
  popover.attach(menuEl)

  useClickOutside([triggerEl, menuEl], () => {
    open.value = false
  })

  function selectedId () {
    const id = box.selection.selectedIds.values().next().value
    return isUndefined(id) ? '' : String(id)
  }

  function applyModel (value: string | undefined) {
    const wanted = isUndefined(value) || value === '' ? '' : value
    if (selectedId() === wanted) return
    const current = selectedId()
    if (current !== '') box.selection.unselect(current)
    if (wanted !== '' && box.selection.has(wanted)) box.selection.select(wanted)
  }

  function syncItems () {
    const next = new Set(items.map(item => item.value))
    for (const id of box.selection.keys()) {
      if (!next.has(String(id))) box.selection.unregister(id)
    }
    for (const item of items) {
      if (!box.selection.has(item.value)) {
        box.selection.register({ id: item.value, value: item.value })
      }
    }
  }

  function itemKey () {
    return items.map(item => item.value).join('\0')
  }

  function publish () {
    const next = selectedId()
    const value = next === '' ? undefined : next
    if (value === model.value) return
    model.value = value
  }

  watch(selectedId, publish)

  watch(itemKey, () => {
    syncItems()
    applyModel(model.value)
  }, { immediate: true })

  watch(() => model.value, applyModel)

  const picked = toRef(() => {
    const id = selectedId()
    return id === '' ? undefined : id
  })

  const visible = toRef(() => items.filter(item => box.filtered.value.has(item.value)))

  const labelText = toRef(() => {
    if (isUndefined(picked.value)) return placeholder
    const found = items.find(item => item.value === picked.value)
    return found?.text ?? picked.value
  })

  const controlClass = toRef(() => {
    const list = ['form-control', 'combobox-toggle']
    if (size === 'sm') list.push('form-control-sm')
    if (size === 'lg') list.push('form-control-lg')
    return list
  })

  function onToggle () {
    if (disabled) return
    open.value = !open.value
  }

  function onToggleKey (event: KeyboardEvent) {
    if (event.key === 'ArrowDown' && !open.value) {
      event.preventDefault()
      if (!disabled) open.value = true
      return
    }
    if (event.key === 'Escape' && open.value) {
      event.preventDefault()
      open.value = false
    }
  }

  function onMenuKey (event: KeyboardEvent) {
    if (event.key !== 'Escape') return
    event.preventDefault()
    open.value = false
    triggerEl.value?.focus()
  }

  function onPick (id: string) {
    if (disabled) return
    box.select(id)
    open.value = false
  }

  const triggerBind = toRef(() => ({
    'type': 'button' as const,
    'class': controlClass.value,
    'disabled': disabled || undefined,
    'aria-expanded': open.value,
    'aria-haspopup': 'listbox' as const,
    'aria-controls': popover.id,
    'style': popover.anchorStyles.value,
    'onClick': onToggle,
    'onKeydown': onToggleKey,
  }))

  const menuClass = toRef(() => ({
    menu: true,
    show: open.value,
  }))

  const menuStyle = toRef(() => popover.contentStyles.value)
</script>

<template>
  <button
    ref="trigger"
    v-bind="mergeProps(attrs, triggerBind)"
  >
    <span class="combobox-value">{{ labelText }}</span>

    <svg
      class="combobox-caret"
      fill="none"
      height="16"
      viewBox="0 0 10 16"
      width="10"
      xmlns="http://www.w3.org/2000/svg"
    ><path d="M0.46967 5.46967C0.762563 5.17678 1.23744 5.17678 1.53033 5.46967L5 8.93934L8.46967 5.46967C8.76256 5.17678 9.23744 5.17678 9.53033 5.46967C9.82322 5.76256 9.82322 6.23744 9.53033 6.53033L5.53033 10.5303C5.23744 10.8232 4.76256 10.8232 4.46967 10.5303L0.46967 6.53033C0.176777 6.23744 0.176777 5.76256 0.46967 5.46967Z" fill="currentcolor" /></svg>
  </button>

  <div
    :id="popover.id"
    ref="menu"
    :class="menuClass"
    data-bs-placement="bottom-start"
    :style="menuStyle"
    @keydown="onMenuKey"
  >
    <button
      v-for="item in visible"
      :key="item.value"
      :aria-selected="picked === item.value ? true : undefined"
      class="menu-item"
      :class="{ selected: picked === item.value }"
      type="button"
      @click="onPick(item.value)"
    >
      {{ item.text }}
    </button>
  </div>

  <input
    v-if="!isUndefined(name)"
    :name
    type="hidden"
    :value="model ?? ''"
  >
</template>
