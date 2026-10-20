<script setup lang="ts">
  const area = defineModel<string>('area', { required: true })
  const fallback = defineModel<string>('fallback', { required: true })
  const subArea = defineModel<string>('subArea', { required: true })
  const hover = defineModel<boolean>('hover', { required: true })
  const openDelay = defineModel<number>('openDelay', { required: true })
  const closeDelay = defineModel<number>('closeDelay', { required: true })
  const disabled = defineModel<boolean>('disabled', { required: true })

  const { pick, tries, subs } = defineProps<{
    pick: (value: string) => void
    tries: { label: string, value: string }[]
    subs: { label: string, value: string }[]
  }>()

  const field = 'rounded-md border border-divider bg-surface px-2 py-1.5 text-sm text-on-surface'

  function chip (value: string) {
    return area.value === value
      ? 'border-primary bg-primary/10 text-primary'
      : 'border-divider bg-surface text-on-surface hover:bg-surface-variant'
  }
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="flex flex-col gap-1 text-sm text-on-surface">
        Fallback
        <select v-model="fallback" :class="field">
          <option v-for="choice in tries" :key="choice.value" :value="choice.value">
            {{ choice.label }}
          </option>
        </select>
      </label>

      <label class="flex flex-col gap-1 text-sm text-on-surface">
        Submenu side
        <select v-model="subArea" :class="field">
          <option v-for="choice in subs" :key="choice.value" :value="choice.value">
            {{ choice.label }}
          </option>
        </select>
      </label>

      <label class="flex flex-col gap-1 text-sm text-on-surface">
        Open delay (ms)
        <input
          v-model.number="openDelay"
          :class="field"
          max="2000"
          min="0"
          step="50"
          type="number"
        >
      </label>

      <label class="flex flex-col gap-1 text-sm text-on-surface">
        Close delay (ms)
        <input
          v-model.number="closeDelay"
          :class="field"
          max="2000"
          min="0"
          step="50"
          type="number"
        >
      </label>

      <label class="inline-flex items-center gap-2 text-sm text-on-surface">
        <input v-model="hover" class="size-4" type="checkbox">
        Open on hover
      </label>

      <label class="inline-flex items-center gap-2 text-sm text-on-surface">
        <input v-model="disabled" class="size-4" type="checkbox">
        Disabled
      </label>
    </div>

    <div class="mx-auto grid w-full max-w-sm grid-cols-3 gap-2">
      <button
        :aria-pressed="area === 'top left'"
        class="rounded-md border px-2 py-2 text-xs font-medium"
        :class="chip('top left')"
        type="button"
        @click="pick('top left')"
      >
        Top left
      </button>

      <button
        :aria-pressed="area === 'top'"
        class="rounded-md border px-2 py-2 text-xs font-medium"
        :class="chip('top')"
        type="button"
        @click="pick('top')"
      >
        Top
      </button>

      <button
        :aria-pressed="area === 'top right'"
        class="rounded-md border px-2 py-2 text-xs font-medium"
        :class="chip('top right')"
        type="button"
        @click="pick('top right')"
      >
        Top right
      </button>

      <button
        :aria-pressed="area === 'left'"
        class="rounded-md border px-2 py-2 text-xs font-medium"
        :class="chip('left')"
        type="button"
        @click="pick('left')"
      >
        Left
      </button>

      <div class="flex items-center justify-center rounded-md border border-dashed border-divider px-2 text-center text-xs text-on-surface-variant">
        Activator
      </div>

      <button
        :aria-pressed="area === 'right'"
        class="rounded-md border px-2 py-2 text-xs font-medium"
        :class="chip('right')"
        type="button"
        @click="pick('right')"
      >
        Right
      </button>

      <button
        :aria-pressed="area === 'bottom left'"
        class="rounded-md border px-2 py-2 text-xs font-medium"
        :class="chip('bottom left')"
        type="button"
        @click="pick('bottom left')"
      >
        Bottom left
      </button>

      <button
        :aria-pressed="area === 'bottom'"
        class="rounded-md border px-2 py-2 text-xs font-medium"
        :class="chip('bottom')"
        type="button"
        @click="pick('bottom')"
      >
        Bottom
      </button>

      <button
        :aria-pressed="area === 'bottom right'"
        class="rounded-md border px-2 py-2 text-xs font-medium"
        :class="chip('bottom right')"
        type="button"
        @click="pick('bottom right')"
      >
        Bottom right
      </button>
    </div>
  </div>
</template>
