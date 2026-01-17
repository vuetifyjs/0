<script setup lang="ts">
  // Framework
  import { useTheme } from '@vuetify/v0'

  // Utilities
  import { Repl, useStore, useVueImportMap } from '@vue/repl'
  import Monaco from '@vue/repl/monaco-editor'
  import '@vue/repl/style.css'
  import { ref, watch, onMounted, computed } from 'vue'

  const props = defineProps<{
    initialCode: string
  }>()

  const emit = defineEmits<{
    'update:code': [code: string]
  }>()

  // Get theme from v0 to sync with user's preference
  const theme = useTheme()
  const replTheme = computed(() => theme.isDark.value ? 'dark' : 'light')

  // Set up Vue import map with proper CDN sources
  const { importMap: builtinImportMap, vueVersion } = useVueImportMap({
    runtimeDev: 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom/dist/runtime-dom.esm-browser.js',
    runtimeProd: 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom/dist/runtime-dom.esm-browser.prod.js',
    serverRenderer: 'https://cdn.jsdelivr.net/npm/@vue/server-renderer/dist/server-renderer.esm-browser.js',
  })

  // Extend builtin import map with v0 packages
  const importMap = computed(() => ({
    imports: {
      ...builtinImportMap.value?.imports,
      '@vuetify/v0': 'https://esm.sh/@vuetify/v0',
    },
  }))

  // Create the repl store
  const store = useStore({
    builtinImportMap: importMap,
    vueVersion,
    showOutput: ref(true),
  })

  // Expose code for parent component validation
  const code = ref(props.initialCode)

  // Track if store is initialized
  const isInitialized = ref(false)

  // Computed to safely access active file code
  const activeCode = computed(() => {
    if (!isInitialized.value) return ''
    return store.activeFile?.code ?? ''
  })

  // Initialize store with code
  onMounted(async () => {
    // Set initial code
    if (props.initialCode) {
      store.setFiles({
        'App.vue': props.initialCode,
      }, 'App.vue')
    }

    isInitialized.value = true
  })

  // Watch for code changes and emit
  watch(activeCode, newCode => {
    if (newCode && isInitialized.value) {
      code.value = newCode
      emit('update:code', newCode)
    }
  })

  // Watch for prop changes to update code
  watch(() => props.initialCode, newCode => {
    if (newCode && isInitialized.value) {
      store.setFiles({
        'App.vue': newCode,
      }, 'App.vue')
    }
  })

  // Expose code ref and store for parent validation
  defineExpose({
    code,
    store,
  })
</script>

<template>
  <div class="skill-playground" :class="{ dark: theme.isDark.value }">
    <Repl
      :auto-resize="true"
      :clear-console="true"
      :editor="Monaco"
      layout="horizontal"
      :preview-theme="true"
      :show-compile-output="false"
      :show-import-map="false"
      :show-ts-config="false"
      :store="store"
      :theme="replTheme"
    />
  </div>
</template>

<style scoped>
.skill-playground {
  height: 100%;
  min-height: 500px;
  border: 1px solid var(--v0-divider);
  border-radius: 8px;
  overflow: hidden;
}

.skill-playground :deep(.vue-repl) {
  height: 100%;
}

.skill-playground :deep(.split-pane) {
  height: 100%;
}

/* Give the editor panel more space in horizontal layout */
.skill-playground :deep(.left) {
  flex: 1.2 !important;
}

.skill-playground :deep(.right) {
  flex: 0.8 !important;
}

/* Hide the floating toggles (show error / auto save) */
.skill-playground :deep(.editor-floating) {
  display: none !important;
}

/* Hide editor file tabs since we only have one file */
.skill-playground :deep(.tab-buttons) {
  display: none !important;
}

/* Override @vue/repl branding color to use v0 primary */
.skill-playground :deep(.vue-repl) {
  --color-branding: var(--v0-primary);
  --color-branding-dark: var(--v0-primary);
}

/* Dark theme - override CSS variables used by @vue/repl */
.skill-playground.dark :deep(.vue-repl) {
  --bg: #1a1a1a;
  --bg-soft: #242424;
  --border: #383838;
  --text-light: #aaa;
}
</style>
