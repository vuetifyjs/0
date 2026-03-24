<script setup lang="ts">
  import { useRtl } from '@vuetify/v0'
  import { toRef } from 'vue'

  const { isRtl, toggle } = useRtl()

  const direction = toRef(() => isRtl.value ? 'rtl' : 'ltr')
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center gap-3">
      <button
        class="px-4 py-2 rounded-lg bg-primary text-on-primary font-medium text-sm"
        @click="toggle"
      >
        <span class="inline-flex items-center gap-2">
          <span class="i-lucide-arrow-left-right" />
          Switch to {{ isRtl ? 'LTR' : 'RTL' }}
        </span>
      </button>
      <span class="px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant text-xs font-mono uppercase">
        {{ direction }}
      </span>
    </div>

    <div
      class="p-4 rounded-lg border border-divider"
      :dir="direction"
    >
      <div class="flex items-start gap-4 mb-4">
        <div class="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <span class="i-lucide-user text-primary" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-medium text-on-surface">{{ isRtl ? 'أحمد محمد' : 'Jane Smith' }}</div>
          <div class="text-sm text-on-surface-variant">{{ isRtl ? 'مهندس برمجيات' : 'Software Engineer' }}</div>
        </div>
        <span class="px-2 py-0.5 rounded text-xs bg-success/15 text-success">{{ isRtl ? 'متصل' : 'Online' }}</span>
      </div>

      <p class="text-sm text-on-surface-variant mb-4">
        {{ isRtl
          ? 'هذا النص يتدفق من اليمين إلى اليسار. لاحظ كيف يتم عكس التخطيط بالكامل.'
          : 'This text flows from left to right. Notice how the entire layout adapts to the text direction.'
        }}
      </p>

      <div class="flex gap-2">
        <button class="px-3 py-1.5 rounded bg-primary text-on-primary text-sm">
          {{ isRtl ? 'إرسال' : 'Send' }}
        </button>
        <button class="px-3 py-1.5 rounded bg-surface-variant text-on-surface-variant text-sm">
          {{ isRtl ? 'إلغاء' : 'Cancel' }}
        </button>
      </div>
    </div>

    <div class="flex items-center gap-3 p-3 rounded-lg bg-surface-variant/50">
      <span class="i-lucide-info text-on-surface-variant" />
      <p class="text-xs text-on-surface-variant">
        <code class="px-1 py-0.5 rounded bg-surface-variant">useRtl()</code> reads from the plugin context.
        Toggle updates <code class="px-1 py-0.5 rounded bg-surface-variant">isRtl</code> globally.
      </p>
    </div>
  </div>
</template>
