<script setup lang="ts">
  // Framework
  import { createSingle } from '@vuetify/v0'

  // Constants
  import { MATURITY_LEVELS as levels } from '@/constants/maturity'
  import { type FeatureType, type ResolvedRelease, releases } from '@/constants/roadmap-buckets'

  // Utilities
  import { toRef } from 'vue'
  import { RouterLink } from 'vue-router'

  const items = releases()

  const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  // Destination tiers on the maturity ladder — the two moves a release makes.
  const ARRIVING = { color: levels.preview.color, icon: 'arrow-up-circle', label: 'Arriving (reaches preview)' }
  const GRADUATING = { color: levels.stable.color, icon: 'shield-check', label: 'Graduating to stable' }

  const typeIcon: Record<FeatureType, string> = {
    composable: 'code',
    component: 'puzzle',
    utility: 'typescript',
  }

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

  const single = createSingle({ mandatory: 'force' })
  single.onboard(items.map(release => ({ id: release.title, value: release.title })))
  single.select(items[0].title)

  const selectedTitle = toRef(() => single.selectedValue.value)
  const selected = toRef(() => items.find(release => release.title === selectedTitle.value))

  function longDate (iso: string): string {
    const at = parts(iso)
    return new Date(at.year, at.month, at.day).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    })
  }
</script>

<template>
  <div class="my-6">
    <!-- Legend -->
    <div class="flex items-center justify-end gap-4 mb-3 text-xs text-on-surface-variant">
      <span class="inline-flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full" :style="{ background: ARRIVING.color }" />
        {{ ARRIVING.label }}
      </span>

      <span class="inline-flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full" :style="{ background: GRADUATING.color }" />
        {{ GRADUATING.label }}
      </span>
    </div>

    <!-- Month cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      <div v-for="month in months" :key="month.key" class="border border-divider rounded-xl bg-surface p-3">
        <div class="flex items-baseline justify-between mb-2 px-0.5">
          <span class="text-sm font-semibold tracking-tight">{{ month.month }}</span>
          <span class="text-[11px] font-mono text-on-surface-variant/50">{{ month.year }}</span>
        </div>

        <div class="grid grid-cols-7 gap-0.5">
          <div
            v-for="(weekday, w) in WEEKDAYS"
            :key="`w-${w}`"
            class="h-5 grid place-items-center text-[10px] font-medium text-on-surface-variant/40"
          >
            {{ weekday }}
          </div>

          <template v-for="(cell, index) in month.cells">
            <!-- Release day -->
            <button
              v-if="cell.release"
              :key="`r-${index}`"
              :aria-current="selectedTitle === cell.release.title ? 'true' : undefined"
              :aria-label="`${cell.release.title}, ${longDate(cell.release.date)}: ${cell.release.features.length} arriving, ${cell.release.stabilizing.length} graduating to stable`"
              class="group relative h-8 flex flex-col items-center justify-center rounded-md overflow-hidden cursor-pointer transition duration-150 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-surface"
              :style="{
                background: tint(accent(cell.release), selectedTitle === cell.release.title ? 26 : 12),
                boxShadow: `inset 0 0 0 ${selectedTitle === cell.release.title ? 2 : 1}px ${tint(accent(cell.release), selectedTitle === cell.release.title ? 100 : 45)}`,
              }"
              type="button"
              @click="single.select(cell.release.title)"
            >
              <span class="text-xs font-mono font-bold leading-none tabular-nums">{{ cell.day }}</span>
              <span class="text-[10px] font-mono leading-none mt-0.5" :style="{ color: accent(cell.release) }">{{ shortTitle(cell.release.title) }}</span>

              <!-- Payload split: arriving | graduating -->
              <span class="absolute inset-x-0 bottom-0 h-1 flex">
                <span class="h-full" :style="{ width: `${newPct(cell.release)}%`, background: ARRIVING.color }" />
                <span class="h-full flex-1" :style="{ background: GRADUATING.color }" />
              </span>
            </button>

            <!-- Non-release day -->
            <div
              v-else
              :key="`d-${index}`"
              class="h-8 grid place-items-center text-[11px] font-mono tabular-nums"
              :class="cell.adjacent ? 'text-on-surface-variant/25' : cell.weekend ? 'text-on-surface-variant/45' : 'text-on-surface-variant/70'"
            >
              {{ cell.day }}
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Selected release detail -->
    <div
      v-if="selected"
      aria-live="polite"
      class="mt-5 rounded-xl bg-surface border border-divider p-4"
      :style="{ borderInlineStartWidth: '4px', borderInlineStartColor: accent(selected) }"
    >
      <div class="flex items-baseline gap-3 flex-wrap">
        <h3 class="text-lg font-mono font-bold">{{ selected.title }}</h3>
        <span class="text-sm text-on-surface-variant">{{ longDate(selected.date) }}</span>

        <span class="ms-auto inline-flex items-center gap-3 text-xs">
          <span v-if="selected.features.length > 0" class="inline-flex items-center gap-1" :style="{ color: ARRIVING.color }">
            <AppIcon :icon="ARRIVING.icon" :size="13" /> {{ selected.features.length }} arriving
          </span>

          <span v-if="selected.stabilizing.length > 0" class="inline-flex items-center gap-1" :style="{ color: GRADUATING.color }">
            <AppIcon :icon="GRADUATING.icon" :size="13" /> {{ selected.stabilizing.length }} graduating
          </span>
        </span>
      </div>

      <div class="mt-4 space-y-4">
        <!-- Net-new features -->
        <div v-if="selected.features.length > 0">
          <div class="text-xs font-semibold uppercase tracking-wide opacity-60 mb-2">New in this release</div>

          <div class="flex flex-wrap gap-2">
            <component
              :is="feature.level === 'draft' ? 'span' : RouterLink"
              v-for="feature in selected.features"
              :key="feature.id"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border no-underline"
              :class="feature.level === 'draft' ? 'cursor-default' : 'hover:bg-surface-tint transition-colors'"
              :style="{ borderColor: levels[feature.level].color, color: levels[feature.level].color }"
              :to="feature.level !== 'draft' ? feature.path : undefined"
            >
              <AppIcon :icon="typeIcon[feature.type]" :size="12" />
              {{ feature.name }}
            </component>
          </div>
        </div>

        <!-- Graduating to stable -->
        <div v-if="selected.stabilizing.length > 0">
          <div class="text-xs font-semibold uppercase tracking-wide opacity-60 mb-2">Graduating to stable</div>

          <div class="flex flex-wrap gap-2">
            <RouterLink
              v-for="feature in selected.stabilizing"
              :key="feature.id"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border no-underline hover:bg-surface-tint transition-colors"
              :style="{ borderColor: GRADUATING.color, color: GRADUATING.color }"
              :to="feature.path"
            >
              <AppIcon :icon="typeIcon[feature.type]" :size="12" />
              {{ feature.name }}
            </RouterLink>
          </div>
        </div>

        <p v-if="selected.stabilizing.length === 0" class="text-sm text-on-surface-variant">
          No stable graduations this release — the two-minor clock resets at v1.0, so the first stable wave lands in v1.2.0.
        </p>
      </div>
    </div>

    <!-- Disclaimer -->
    <p class="mt-6 text-sm opacity-60 text-center">
      Expected dates and graduations are strategic targets, not commitments — they may shift with community feedback and technical requirements.
    </p>
  </div>
</template>
