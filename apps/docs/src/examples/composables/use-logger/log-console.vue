<script setup lang="ts">
  import { createLoggerContext, useLogger } from '@vuetify/v0'
  import type { LogLevel } from '@vuetify/v0'
  import { ref, shallowRef } from 'vue'

  const [, provideLogger] = createLoggerContext({
    level: 'debug',
    enabled: true,
  })

  provideLogger()

  const logger = useLogger()

  const level = shallowRef<LogLevel>(logger.current())
  const enabled = shallowRef(logger.enabled())
  const logs = ref<{ level: string, message: string, time: string }[]>([])

  const levels: LogLevel[] = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']

  const colors: Record<string, string> = {
    trace: 'text-on-surface-variant',
    debug: 'text-info',
    info: 'text-success',
    warn: 'text-warning',
    error: 'text-error',
    fatal: 'text-error font-bold',
  }

  function onLog (lvl: LogLevel) {
    const message = `This is a ${lvl} message`
    const time = new Date().toLocaleTimeString()
    logs.value.push({ level: lvl, message, time })
    logger[lvl](message)
  }

  function onLevel (lvl: LogLevel) {
    level.value = lvl
    logger.level(lvl)
  }

  function onToggle () {
    if (enabled.value) {
      logger.disable()
    } else {
      logger.enable()
    }
    enabled.value = logger.enabled()
  }

  function onClear () {
    logs.value = []
  }
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3 flex-wrap">
      <label class="text-xs text-on-surface-variant">Min level:</label>

      <div class="flex gap-1">
        <button
          v-for="lvl in levels"
          :key="lvl"
          class="px-2 py-1 text-xs rounded-md border transition-all"
          :class="level === lvl
            ? 'border-primary bg-primary/10 text-primary font-medium'
            : 'border-divider text-on-surface-variant hover:border-primary/50'"
          @click="onLevel(lvl)"
        >
          {{ lvl }}
        </button>
      </div>

      <button
        class="ml-auto px-2 py-1 text-xs rounded-md border transition-all"
        :class="enabled
          ? 'border-success bg-success/10 text-success'
          : 'border-error bg-error/10 text-error'"
        @click="onToggle"
      >
        {{ enabled ? 'Enabled' : 'Disabled' }}
      </button>
    </div>

    <div class="flex gap-1.5 flex-wrap">
      <button
        v-for="lvl in levels"
        :key="lvl"
        class="px-3 py-1.5 text-xs rounded-lg border border-divider hover:bg-surface-tint transition-colors"
        :class="colors[lvl]"
        @click="onLog(lvl)"
      >
        {{ lvl }}()
      </button>
    </div>

    <div class="rounded-lg border border-divider bg-surface-variant/30 overflow-hidden">
      <div class="flex items-center justify-between px-3 py-1.5 border-b border-divider">
        <span class="text-[10px] uppercase tracking-wider text-on-surface-variant/60">Console output</span>

        <button
          v-if="logs.length > 0"
          class="text-[10px] text-on-surface-variant hover:text-on-surface"
          @click="onClear"
        >
          Clear
        </button>
      </div>

      <div class="max-h-48 overflow-auto p-2 font-mono text-xs space-y-0.5">
        <div v-if="logs.length === 0" class="text-on-surface-variant/50 py-4 text-center">
          Click a log level button above
        </div>

        <div
          v-for="(log, index) in logs"
          :key="index"
          class="flex gap-2 px-1 py-0.5 rounded hover:bg-surface-variant/50"
        >
          <span class="text-on-surface-variant/50 shrink-0">{{ log.time }}</span>
          <span class="shrink-0 uppercase w-10" :class="colors[log.level]">{{ log.level }}</span>
          <span class="text-on-surface">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
