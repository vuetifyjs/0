<script setup lang="ts">
  // Framework
  import { Carousel, Tooltip, useMediaQuery, useResizeObserver } from '@vuetify/v0'

  // Constants
  import { MATURITY_LEVELS as levels } from '@/constants/maturity'
  import { type ResolvedRelease, releases } from '@/constants/roadmap-buckets'

  // Utilities
  import { ref, shallowRef, toRef, useTemplateRef } from 'vue'

  // Types
  import type { TooltipActivatorSlotProps } from '@vuetify/v0'

  const items = releases()

  const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  // Destination tiers on the maturity ladder — the two moves a release makes.
  const ARRIVING = { color: levels.preview.color, label: 'Arriving (reaches preview)' }
  const GRADUATING = { color: levels.stable.color, label: 'Graduating to stable' }

  interface DateParts { year: number, month: number, day: number }

  // Parse ISO locally (never `new Date(iso)` — that parses as UTC and can slip a day).
  function parts (iso: string): DateParts {
    const [year, month, day] = iso.split('-').map(Number)
    return { year, month: month - 1, day }
  }

  const dated = items.map(release => ({ release, at: parts(release.date) }))
  const byDay = new Map(dated.map(({ release, at }) => [`${at.year}-${at.month}-${at.day}`, release]))

  interface Cell { day: number, adjacent: boolean, weekend: boolean, release?: ResolvedRelease }
  interface MonthGrid { key: string, month: string, year: number, cells: Cell[] }

  // Every grid is a fixed 6-week block (42 cells) so all month cards share one
  // height. Leading/trailing slots are filled with adjacent-month days, dimmed.
  const WEEKS = 6

  // Render every month from the first release to the last, inclusive.
  const start = dated[0].at
  const end = dated.at(-1)!.at

  const months: MonthGrid[] = []
  for (let year = start.year, month = start.month; year < end.year || (year === end.year && month <= end.month);) {
    const firstDow = new Date(year, month, 1).getDay()
    const total = new Date(year, month + 1, 0).getDate()
    const prevTotal = new Date(year, month, 0).getDate()

    const cells: Cell[] = []

    function push (day: number, adjacent: boolean, release?: ResolvedRelease): void {
      const column = cells.length % 7
      cells.push({ day, adjacent, weekend: column === 0 || column === 6, release })
    }

    // Leading days from the previous month.
    for (let i = firstDow - 1; i >= 0; i--) push(prevTotal - i, true)
    // This month.
    for (let day = 1; day <= total; day++) push(day, false, byDay.get(`${year}-${month}-${day}`))
    // Trailing days from the next month, to a fixed 6-week grid.
    for (let day = 1; cells.length < WEEKS * 7; day++) push(day, true)

    months.push({
      key: `${year}-${month}`,
      month: new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long' }),
      year,
      cells,
    })

    month += 1
    if (month > 11) {
      month = 0
      year += 1
    }
  }

  function shortTitle (title: string): string {
    return title.replace(/^v/, '').replace(/\.0$/, '')
  }

  // Each marker is tinted by whichever move dominates the release. The split bar
  // carries the exact composition, so the tint may overclaim on a near-even
  // release — no planned release is close to even today (the nearest is ~15/85),
  // so a neutral-tint fallback would be dead code. Revisit if that changes.
  function accent (release: ResolvedRelease): string {
    return release.features.length >= release.stabilizing.length ? ARRIVING.color : GRADUATING.color
  }

  function newPct (release: ResolvedRelease): number {
    const total = release.features.length + release.stabilizing.length
    return total === 0 ? 100 : Math.round((release.features.length / total) * 100)
  }

  function tint (color: string, pct: number): string {
    return `color-mix(in srgb, ${color} ${pct}%, transparent)`
  }

  // One row: a month fills it below 640px, two share it from there up.
  // perView matches that split so Next stops on a full row.
  const { matches: wide } = useMediaQuery('(min-width: 640px)')
  const perView = toRef(() => wide.value ? 2 : 1)

  // Padding is the peek. Slides fill the content box, so the neighbor sits in
  // the padding. The fade covers that padding only on a side that has more months.
  const PEEK = '3rem'
  const monthIndex = toRef(() => {
    const index = months.findIndex(month => month.key === activeMonth.value)
    return Math.max(index, 0)
  })
  const hasPrev = toRef(() => monthIndex.value > 0)
  const hasNext = toRef(() => monthIndex.value < months.length - perView.value)
  const rowStyle = toRef(() => {
    const left = hasPrev.value ? PEEK : '0px'
    const right = hasNext.value ? PEEK : '0px'
    const mask = `linear-gradient(to right, transparent, #000 ${left}, #000 calc(100% - ${right}), transparent)`
    return {
      paddingInline: PEEK,
      maskImage: mask,
      WebkitMaskImage: mask,
    }
  })

  const now = new Date()
  const currentKey = `${now.getFullYear()}-${now.getMonth()}`
  const activeMonth = shallowRef(months.some(month => month.key === currentKey) ? currentKey : months[0].key)

  function isToday (key: string, cell: Cell): boolean {
    return !cell.adjacent && key === currentKey && cell.day === now.getDate()
  }

  // Hover opens the highlight. A tap does too — touch has no hover — and a
  // mouse click does not, so the day is not a control.
  const shown = ref<Record<string, boolean>>({})
  let touch = false

  function onPointerdown (event: PointerEvent) {
    touch = event.pointerType === 'touch'
  }

  function onTouchOpen (title: string) {
    if (!touch) return
    shown.value[title] = true
  }

  function hoverAttrs (attrs: TooltipActivatorSlotProps['attrs']) {
    const { onClick: _onClick, ...rest } = attrs
    return rest
  }

  function dayStyle (release: ResolvedRelease): Record<string, string> {
    return {
      background: tint(accent(release), 12),
      boxShadow: `inset 0 0 0 1px ${tint(accent(release), 45)}`,
    }
  }

  function shortDate (iso: string): string {
    const at = parts(iso)
    return new Date(at.year, at.month, at.day).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  function releaseLabel (release: ResolvedRelease): string {
    return `${release.title}, ${shortDate(release.date)}: ${release.features.length} arriving, ${release.stabilizing.length} graduating to stable`
  }

  // The carousel selects the current month before the viewport has a slide
  // step, and that scroll is not retried. Nudge the row once it has a width.
  const rootEl = useTemplateRef<HTMLElement>('root')
  let placed = false

  useResizeObserver(rootEl, () => {
    if (placed) return
    const root = rootEl.value
    const viewport = root?.querySelector<HTMLElement>('[data-orientation]')
    const slide = root?.querySelector<HTMLElement>(`[data-month="${CSS.escape(activeMonth.value)}"]`)
    if (!viewport || !slide || viewport.clientWidth === 0) return

    const pad = Number.parseFloat(getComputedStyle(viewport).paddingInlineStart) || 0
    const left = slide.getBoundingClientRect().left - viewport.getBoundingClientRect().left + viewport.scrollLeft - pad
    viewport.scrollLeft = left
    placed = true
  }, { immediate: true })

</script>

<template>
  <div ref="root" class="my-6">
    <Carousel.Root v-model="activeMonth" label="Release calendar" :per-view>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
        <Carousel.Previous class="grid place-items-center w-7 h-7 rounded-md hover:bg-surface-tint disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors">
          <AppIcon icon="chevron-left" :size="18" />
        </Carousel.Previous>

        <Carousel.Next class="grid place-items-center w-7 h-7 rounded-md hover:bg-surface-tint disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors">
          <AppIcon icon="chevron-right" :size="18" />
        </Carousel.Next>

        <div class="ms-auto flex flex-wrap items-center justify-end gap-4 text-xs text-on-surface-variant">
          <span class="inline-flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full" :style="{ background: ARRIVING.color }" />
            {{ ARRIVING.label }}
          </span>

          <span class="inline-flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full" :style="{ background: GRADUATING.color }" />
            {{ GRADUATING.label }}
          </span>
        </div>
      </div>

      <Carousel.Viewport class="flex-nowrap gap-3 cursor-grab data-[dragging]:cursor-grabbing" :style="rowStyle">
        <Carousel.Item
          v-for="month in months"
          :key="month.key"
          class="shrink-0 w-full sm:w-[calc((100%-0.75rem)/2)] rounded-xl border p-3"
          :class="month.key === currentKey ? 'border-primary/40 bg-primary/5' : 'border-divider bg-surface'"
          :data-month="month.key"
          :value="month.key"
        >
          <div class="flex items-baseline justify-between mb-2 px-0.5">
            <span class="text-sm font-semibold tracking-tight">{{ month.month }}</span>
            <span class="text-[11px] font-mono text-on-surface-variant/50">{{ month.year }}</span>
          </div>

          <div class="grid grid-cols-7 gap-0.5">
            <div
              v-for="(weekday, w) in WEEKDAYS"
              :key="`w-${month.key}-${w}`"
              class="h-5 grid place-items-center text-[10px] font-medium text-on-surface-variant/40"
            >
              {{ weekday }}
            </div>

            <template v-for="(cell, index) in month.cells">
              <Tooltip.Root
                v-if="cell.release"
                :key="`r-${month.key}-${index}`"
                :close-delay="200"
                interactive
                :model-value="!!shown[cell.release.title]"
                :open-delay="200"
                position-area="top"
                position-try="most-height top"
                @update:model-value="shown[cell.release.title] = $event"
              >
                <Tooltip.Activator v-slot="{ attrs, styles }" renderless>
                  <div
                    :aria-label="releaseLabel(cell.release)"
                    class="relative h-8 flex flex-col items-center justify-center rounded-md overflow-hidden cursor-default transition duration-150 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-surface"
                    :style="[styles, dayStyle(cell.release)]"
                    tabindex="0"
                    v-bind="hoverAttrs(attrs)"
                    @click="onTouchOpen(cell.release.title)"
                    @pointerdown="onPointerdown"
                  >
                    <span class="text-xs font-mono font-bold leading-none tabular-nums">{{ cell.day }}</span>
                    <span class="text-[10px] font-mono leading-none mt-0.5" :style="{ color: accent(cell.release) }">{{ shortTitle(cell.release.title) }}</span>

                    <span class="absolute inset-x-0 bottom-0 h-1 flex">
                      <span class="h-full" :style="{ width: `${newPct(cell.release)}%`, background: ARRIVING.color }" />
                      <span class="h-full flex-1" :style="{ background: GRADUATING.color }" />
                    </span>
                  </div>
                </Tooltip.Activator>

                <Tooltip.Content
                  class="w-72 rounded-xl border border-divider bg-surface p-3 text-start text-on-surface shadow-lg"
                  :style="{ margin: '8px 0' }"
                >
                  <div class="flex items-baseline justify-between gap-3">
                    <span class="text-sm font-semibold tracking-tight">{{ cell.release.title }}</span>
                    <span class="shrink-0 text-[11px] font-mono text-on-surface-variant">{{ shortDate(cell.release.date) }}</span>
                  </div>

                  <div class="mt-2.5 space-y-2.5">
                    <div v-if="cell.release.features.length > 0">
                      <div class="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-on-surface-variant">
                        <span class="h-1.5 w-1.5 rounded-full" :style="{ background: ARRIVING.color }" />
                        Arriving
                      </div>

                      <div class="flex flex-wrap gap-1">
                        <span
                          v-for="feature in cell.release.features"
                          :key="feature.id"
                          class="rounded-md px-1.5 py-0.5 text-[11px] font-mono"
                          :style="{ background: tint(ARRIVING.color, 16), color: ARRIVING.color }"
                        >
                          {{ feature.name }}
                        </span>
                      </div>
                    </div>

                    <div v-if="cell.release.stabilizing.length > 0">
                      <div class="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-on-surface-variant">
                        <span class="h-1.5 w-1.5 rounded-full" :style="{ background: GRADUATING.color }" />
                        Graduating
                      </div>

                      <div class="flex flex-wrap gap-1">
                        <span
                          v-for="feature in cell.release.stabilizing"
                          :key="feature.id"
                          class="rounded-md px-1.5 py-0.5 text-[11px] font-mono"
                          :style="{ background: tint(GRADUATING.color, 16), color: GRADUATING.color }"
                        >
                          {{ feature.name }}
                        </span>
                      </div>
                    </div>

                    <p
                      v-if="cell.release.features.length === 0 && cell.release.stabilizing.length === 0"
                      class="text-xs text-on-surface-variant"
                    >
                      Nothing arrives or graduates in this release.
                    </p>
                  </div>
                </Tooltip.Content>
              </Tooltip.Root>

              <div
                v-else
                :key="`d-${month.key}-${index}`"
                :aria-current="isToday(month.key, cell) ? 'date' : undefined"
                class="h-8 grid place-items-center rounded-md text-[11px] font-mono tabular-nums"
                :class="isToday(month.key, cell)
                  ? 'bg-primary/10 font-semibold text-primary'
                  : cell.adjacent ? 'text-on-surface-variant/25' : cell.weekend ? 'text-on-surface-variant/45' : 'text-on-surface-variant/70'"
              >
                {{ cell.day }}
              </div>
            </template>
          </div>
        </Carousel.Item>
      </Carousel.Viewport>
    </Carousel.Root>

    <!-- Disclaimer -->
    <p class="mt-6 text-sm opacity-60 text-center">
      Expected dates and graduations are strategic targets, not commitments — they may shift with community feedback and technical requirements.
    </p>
  </div>
</template>
