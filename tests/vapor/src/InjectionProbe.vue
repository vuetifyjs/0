<script setup vapor lang="ts">
  // Composables
  import { useLogger } from '#v0/composables'

  // Utilities
  import { isNull } from '#v0/utilities'
  import { getCurrentInstance, hasInjectionContext, inject } from 'vue'

  // createPlugin/index.ts gates every generated useX() consumer on
  // hasInjectionContext(). Under Vapor that guarantee comes from Vue's
  // getCurrentGenericInstance() accessor, not getCurrentInstance() — this
  // probe pins it against a real Vapor render.
  const has = hasInjectionContext()

  // App-level provide → component-level inject is how every v0 plugin
  // delivers its context. Resolve one provided via app.provide().
  const injected = inject<string>('vapor-probe', '<missing>')

  // For contrast, mirror InstanceProbe: the vdom accessor stays null by
  // design, so hasInjectionContext() must NOT be built on it.
  const rawNull = isNull(getCurrentInstance())

  // A real createPluginContext consumer: with createLoggerPlugin installed,
  // inject() resolves the provided context; without it, the fallback logger
  // resolves instead of throwing. current() discriminates the two.
  let level = ''
  let loggerError = ''
  try {
    level = useLogger().current()
  } catch (error) {
    loggerError = (error as Error).message
  }
</script>

<template>
  <div
    :data-has-injection-context="String(has)"
    :data-injected="injected"
    :data-logger-error="loggerError"
    :data-logger-level="level"
    :data-raw-null="String(rawNull)"
  />
</template>
