<script setup lang="ts">
  // Framework
  import maturityData from '#v0/maturity.json'
  import { MATURITY_LEVELS as levels } from '@/constants/maturity'

  // Types
  import type { Level, MaturityData } from '@/constants/maturity'

  interface Gate {
    promoter: string
    requirements: string[]
  }

  interface Rung {
    level: Level
    meaning: string
    /** Requirements to reach this rung from the one above it. Absent on the entry rung. */
    gate?: Gate
  }

  const data = maturityData as MaturityData

  function tally (): Record<Level, number> {
    const result: Record<Level, number> = { draft: 0, preview: 0, stable: 0, mature: 0, deprecated: 0 }
    for (const bucket of [data.composables, data.components, data.utilities]) {
      for (const entry of Object.values(bucket)) result[entry.level]++
    }
    return result
  }

  const counts = tally()

  const rungs: Rung[] = [
    {
      level: 'draft',
      meaning: 'Planned, not yet implemented. There is nothing to import.',
    },
    {
      level: 'preview',
      meaning: 'Implemented, tested, and documented. The API may still move in minor releases — every change lands in the release notes.',
      gate: {
        promoter: 'Author promotes in the landing PR',
        requirements: [
          'Implementation landed',
          'Unit tests cover happy path and edge cases',
          'Docs page with a working example',
        ],
      },
    },
    {
      level: 'stable',
      meaning: 'Production-ready. Breaking changes require a major version.',
      gate: {
        promoter: 'Maintainer decision',
        requirements: [
          'API unchanged for 2+ minor releases',
          'Edge cases and failure modes tested',
          'SSR-safe, or explicitly browser-only',
          'Accessibility reviewed',
          'Benchmarked when performance-critical',
        ],
      },
    },
    {
      level: 'mature',
      meaning: 'API frozen. Downstream frameworks — Vuetify itself — depend on it.',
      gate: {
        promoter: 'Maintainer decision',
        requirements: [
          'Proven in production downstream',
          'Adapter ecosystem where applicable',
          'API frozen — breaking changes need a major',
        ],
      },
    },
  ]

  function plural (count: number): string {
    return count === 1 ? 'feature' : 'features'
  }
</script>

<template>
  <div class="mb-8">
    <ol class="list-none m-0 p-0">
      <li v-for="(rung, index) in rungs" :key="rung.level">
        <!-- Rung node -->
        <div class="flex items-center gap-3">
          <span
            aria-hidden="true"
            class="inline-flex items-center justify-center size-7 rounded-full border-2 shrink-0"
            :style="{
              borderColor: levels[rung.level].color,
              color: levels[rung.level].color,
              backgroundColor: levels[rung.level].color + '15',
            }"
          >
            <AppIcon :icon="levels[rung.level].icon" :size="14" />
          </span>

          <span
            class="text-sm font-semibold uppercase tracking-wide"
            :style="{ color: levels[rung.level].color }"
          >
            {{ levels[rung.level].label }}
          </span>

          <span class="font-mono text-xs text-on-surface-variant">
            {{ counts[rung.level] }} {{ plural(counts[rung.level]) }}
          </span>
        </div>

        <!-- Rail segment: this rung's meaning, then the gate to the next rung -->
        <div class="relative ml-3.5 pl-6 pt-1" :class="index < rungs.length - 1 ? 'pb-5' : 'pb-0'">
          <span
            v-if="index < rungs.length - 1"
            aria-hidden="true"
            class="absolute left-0 top-0 bottom-0 w-0.5 -translate-x-1/2"
            :style="{
              background: `linear-gradient(to bottom, ${levels[rung.level].color}, ${levels[rungs[index + 1]!.level].color})`,
            }"
          />

          <p class="text-sm text-on-surface-variant m-0 mt-1 leading-relaxed">
            {{ rung.meaning }}
          </p>

          <div
            v-if="rungs[index + 1]?.gate"
            class="mt-3 rounded-lg bg-glass-surface px-4 py-3"
          >
            <div class="flex items-center gap-2 flex-wrap">
              <span
                class="text-[10px] font-semibold uppercase tracking-widest"
                :style="{ color: levels[rungs[index + 1]!.level].color }"
              >
                Gate to {{ levels[rungs[index + 1]!.level].label }}
              </span>

              <span class="flex-1" />

              <span class="text-[10px] uppercase tracking-wide text-on-surface-variant/70">
                {{ rungs[index + 1]!.gate!.promoter }}
              </span>
            </div>

            <ul class="list-none m-0 mt-2 p-0 grid gap-x-6 gap-y-1.5 md:grid-cols-2">
              <li
                v-for="requirement in rungs[index + 1]!.gate!.requirements"
                :key="requirement"
                class="flex items-start gap-2 text-sm text-on-surface-variant"
              >
                <AppIcon
                  aria-hidden="true"
                  class="mt-0.5 shrink-0"
                  icon="check"
                  :size="14"
                  :style="{ color: levels[rungs[index + 1]!.level].color }"
                />

                <span>{{ requirement }}</span>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ol>

    <!-- Deprecated sits off the track: any rung can exit here -->
    <div
      class="mt-6 rounded-lg border border-dashed px-4 py-3"
      :style="{ borderColor: levels.deprecated.color + '80' }"
    >
      <div class="flex items-center gap-2 flex-wrap">
        <AppIcon
          aria-hidden="true"
          :icon="levels.deprecated.icon"
          :size="14"
          :style="{ color: levels.deprecated.color }"
        />

        <span
          class="text-sm font-semibold uppercase tracking-wide"
          :style="{ color: levels.deprecated.color }"
        >
          {{ levels.deprecated.label }}
        </span>

        <span class="font-mono text-xs text-on-surface-variant">
          {{ counts.deprecated }} {{ plural(counts.deprecated) }}
        </span>

        <span class="flex-1" />

        <span class="text-[10px] uppercase tracking-widest text-on-surface-variant/70">
          Exit — from any level
        </span>
      </div>

      <p class="text-sm text-on-surface-variant m-0 mt-2 leading-relaxed">
        A feature leaves the track when a better pattern supersedes it. Deprecation always ships
        with a migration guide and a removal timeline — nothing disappears in a minor release.
      </p>
    </div>
  </div>
</template>
