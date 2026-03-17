<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { Splitter } from '@vuetify/v0'
  import ResizeHandle from './resize-handle.vue'

  const files = {
    'App.vue': `<template>
  <h1>Hello World</h1>
</template>`,
    'main.ts': `import { createApp } from 'vue'
${'import'} App from './App.vue'

createApp(App).mount('#app')`,
    'style.css': `body {
  margin: 0;
  font-family: system-ui, sans-serif;
}

h1 {
  color: #333;
}`,
  } as Record<string, string>

  const active = shallowRef('App.vue')
</script>

<template>
  <Splitter.Root class="h-128 border border-divider rounded-lg overflow-hidden text-sm">
    <Splitter.Panel
      class="flex flex-col bg-surface-variant/30"
      :default-size="20"
      :max-size="30"
      :min-size="15"
    >
      <div class="px-3 py-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wide border-b border-divider">
        Explorer
      </div>

      <div class="flex flex-col gap-0.5 p-2 text-on-surface-variant">
        <div
          v-for="name in Object.keys(files)"
          :key="name"
          :class="[
            'px-2 py-1 rounded cursor-pointer',
            name === active ? 'bg-primary/10 text-primary' : 'hover:bg-surface-tint',
          ]"
          @click="active = name"
        >
          {{ name }}
        </div>
      </div>
    </Splitter.Panel>

    <ResizeHandle label="Resize sidebar" />

    <Splitter.Panel :default-size="80" :min-size="40">
      <Splitter.Root class="h-full" orientation="vertical">
        <Splitter.Panel
          class="flex flex-col bg-surface"
          :default-size="60"
          :min-size="30"
        >
          <div class="px-3 py-2 text-xs border-b border-divider">
            <span class="text-primary">{{ active }}</span>
          </div>

          <pre class="flex-1 p-3 font-mono text-xs text-on-surface-variant overflow-auto">{{ files[active] }}</pre>
        </Splitter.Panel>

        <ResizeHandle :horizontal="false" label="Resize preview" />

        <Splitter.Panel
          class="flex flex-col bg-surface"
          :default-size="40"
          :min-size="20"
        >
          <div class="px-3 py-2 text-xs border-b border-divider text-on-surface-variant">
            Preview
          </div>

          <div class="flex-1 flex items-center justify-center">
            <h1 class="text-xl font-bold">Hello World</h1>
          </div>
        </Splitter.Panel>
      </Splitter.Root>
    </Splitter.Panel>
  </Splitter.Root>
</template>
