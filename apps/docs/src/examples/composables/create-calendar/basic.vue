<script setup lang="ts">
  import { createCalendar } from '@vuetify/v0'
  import { nextTick, useTemplateRef } from 'vue'

  const calendar = createCalendar({
    fixedWeeks: true,
  })

  const grid = useTemplateRef<HTMLElement>('grid')

  function onClick (iso: string, disabled: boolean) {
    if (disabled) return

    calendar.focused.value = iso
  }

  function focusCell () {
    nextTick(() => {
      grid.value?.querySelector<HTMLElement>('[tabindex="0"]')?.focus()
    })
  }

  function onKeydown (event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft': {
        calendar.move('day', -1)
        break
      }
      case 'ArrowRight': {
        calendar.move('day', 1)
        break
      }
      case 'ArrowUp': {
        calendar.move('week', -1)
        break
      }
      case 'ArrowDown': {
        calendar.move('week', 1)
        break
      }
      case 'PageUp': {
        if (event.shiftKey) calendar.move('year', -1)
        else calendar.prev()
        break
      }
      case 'PageDown': {
        if (event.shiftKey) calendar.move('year', 1)
        else calendar.next()
        break
      }
      case 'Home': {
        const week = calendar.months.value[0].weeks.find(days =>
          days.some(cell => cell.iso === calendar.focused.value),
        )
        const first = week?.at(0)

        if (first) calendar.goto(first.iso)
        break
      }
      case 'End': {
        const week = calendar.months.value[0].weeks.find(days =>
          days.some(cell => cell.iso === calendar.focused.value),
        )
        const last = week?.at(-1)

        if (last) calendar.goto(last.iso)
        break
      }
      default: {
        return
      }
    }
    event.preventDefault()
    focusCell()
  }
</script>

<template>
  <div class="w-72 mx-auto flex flex-col gap-2 p-4 bg-surface border border-divider rounded-lg select-none">
    <header class="flex items-center justify-between">
      <button
        aria-label="Previous month"
        class="size-8 flex items-center justify-center border border-divider rounded-md bg-surface hover:bg-surface-tint cursor-pointer"
        type="button"
        @click="calendar.prev()"
      >
        ←
      </button>

      <span class="text-base font-semibold">{{ calendar.label.value }}</span>

      <button
        aria-label="Next month"
        class="size-8 flex items-center justify-center border border-divider rounded-md bg-surface hover:bg-surface-tint cursor-pointer"
        type="button"
        @click="calendar.next()"
      >
        →
      </button>
    </header>

    <div class="grid grid-cols-7 gap-0.5 text-center">
      <span
        v-for="weekday in calendar.weekdays.value"
        :key="weekday.short"
        class="py-1 text-xs font-medium text-on-surface-variant"
      >
        {{ weekday.narrow }}
      </span>
    </div>

    <div
      ref="grid"
      class="grid grid-cols-7 gap-0.5"
      role="grid"
      @keydown="onKeydown"
    >
      <template v-for="(week, weekIndex) in calendar.months.value[0].weeks" :key="weekIndex">
        <button
          v-for="cell in week"
          :key="cell.iso"
          :aria-disabled="cell.disabled"
          :aria-label="cell.iso"
          class="aspect-square flex items-center justify-center rounded-md text-sm bg-transparent border-none cursor-pointer hover:bg-surface-tint data-[outside]:text-on-surface-variant data-[outside]:opacity-50 data-[today]:font-bold data-[today]:text-primary data-[disabled]:text-on-surface-variant data-[disabled]:opacity-30 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none data-[focused]:outline data-[focused]:outline-2 data-[focused]:outline-primary data-[focused]:outline-offset-[-2px]"
          :data-disabled="cell.disabled || undefined"
          :data-focused="calendar.focused.value === cell.iso || undefined"
          :data-outside="cell.outside || undefined"
          :data-today="cell.today || undefined"
          role="gridcell"
          :tabindex="calendar.focused.value === cell.iso ? 0 : -1"
          type="button"
          @click="onClick(cell.iso, cell.disabled)"
        >
          {{ cell.day }}
        </button>
      </template>
    </div>

    <footer class="flex justify-center pt-2 border-t border-divider">
      <button
        class="px-3 py-1.5 border border-divider rounded-md bg-surface text-sm cursor-pointer hover:bg-surface-tint"
        type="button"
        @click="calendar.today()"
      >
        Today
      </button>
    </footer>
  </div>
</template>
