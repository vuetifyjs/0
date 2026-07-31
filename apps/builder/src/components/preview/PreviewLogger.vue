<script setup lang="ts">
  import { defaultConfig, LOG_LEVELS } from '@/plugins/logger/defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { LoggerConfig, LogLevel } from '@/plugins/logger/defaults'

  interface Line {
    level: LogLevel
    text: string
  }

  const LINES: Line[] = [
    { level: 'trace', text: 'registry:enter useTheme.register()' },
    { level: 'debug', text: 'breakpoints resolved to "md" at 840px' },
    { level: 'info', text: 'theme applied — 8 tokens written to :root' },
    { level: 'warn', text: 'locale "fr" missing key "actions.save"' },
    { level: 'error', text: 'storage quota exceeded, write discarded' },
    { level: 'fatal', text: 'adapter failed to boot; halting' },
  ]

  const TONES: Record<LogLevel, string> = {
    trace: 'text-on-surface-variant/70',
    debug: 'text-on-surface-variant',
    info: 'text-primary',
    warn: 'text-[#b45309]',
    error: 'text-error',
    fatal: 'text-error font-semibold',
    silent: 'text-on-surface-variant',
  }

  const ADAPTERS: Record<string, string> = {
    V0LoggerAdapter: 'v0',
    ConsolaLoggerAdapter: 'consola',
    PinoLoggerAdapter: 'pino',
  }

  const store = useBuilderStore()

  const config = toRef(() => {
    if (store.draft?.id === 'useLogger') return store.draft.config as LoggerConfig

    return (store.pluginConfig.useLogger as LoggerConfig | undefined) ?? defaultConfig
  })

  const floor = toRef(() => LOG_LEVELS.indexOf(config.value.level))

  const visible = toRef(() => {
    if (!config.value.enabled || config.value.level === 'silent') return []

    return LINES.filter(line => LOG_LEVELS.indexOf(line.level) >= floor.value)
  })

  const engine = toRef(() => ADAPTERS[config.value.adapter] ?? config.value.adapter)

  const muted = toRef(() => LINES.length - visible.value.length)
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2 text-xs">
      <span class="px-2 py-0.5 rounded-full bg-primary text-on-primary font-mono">{{ config.level }}</span>

      <span class="px-2 py-0.5 rounded-full border border-divider text-on-surface-variant font-mono">{{ engine }}</span>

      <span class="ml-auto text-on-surface-variant">
        {{ visible.length }} of {{ LINES.length }} shown
      </span>
    </div>

    <MiniFrame title="console">
      <div class="rounded-lg bg-surface-variant/40 p-3 font-mono text-[11px] leading-relaxed min-h-16 space-y-0.5">
        <p
          v-for="(line, index) in visible"
          :key="index"
          class="flex items-baseline gap-2"
          :class="TONES[line.level]"
        >
          <span class="shrink-0 text-on-surface-variant/60">[{{ config.prefix || 'v0' }}]</span>
          <span class="shrink-0 w-10 uppercase font-semibold">{{ line.level }}</span>
          <span class="min-w-0 truncate text-on-surface">{{ line.text }}</span>
        </p>

        <p v-if="visible.length === 0" class="italic text-on-surface-variant">
          {{ config.enabled ? 'Level is "silent" — nothing is written.' : 'Logging is disabled.' }}
        </p>
      </div>
    </MiniFrame>

    <p v-if="muted > 0 && visible.length > 0" class="text-xs text-on-surface-variant">
      {{ muted }} line{{ muted === 1 ? '' : 's' }} below "{{ config.level }}" are dropped before reaching the adapter.
    </p>
  </div>
</template>
