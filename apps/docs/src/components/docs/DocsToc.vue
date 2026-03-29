<script setup lang="ts">
  // Components
  import { Discovery } from '@/components/discovery'

  // Composables
  import { useAsk } from '@/composables/useAsk'
  import { useSettings } from '@/composables/useSettings'
  import { useToc } from '@/composables/useToc'

  const ask = useAsk()
  const toc = useToc()
  const settings = useSettings()

  function scrollToTop () {
    window.scrollTo({ top: 0, behavior: settings.prefersReducedMotion.value ? 'auto' : 'smooth' })
  }
</script>

<template>
  <Discovery.Activator
    v-if="toc.headings.value.length > 0 && !ask.isOpen.value"
    as="aside"
    class="hidden xl:block rounded-lg fixed end-4 top-25 w-[200px] max-h-[calc(100vh-145px)] overflow-y-auto text-sm"
    :padding="8"
    step="toc"
  >
    <HxToc
      :active-id="toc.selectedId.value"
      :headings="toc.headings.value"
      @select="toc.scrollTo($event)"
    >
      <template #header>
        <button
          class="section-label mb-3 hover:text-primary hover:underline transition-colors cursor-pointer after:content-['_§']"
          type="button"
          @click="scrollToTop"
        >
          On this page
        </button>
      </template>
    </HxToc>
  </Discovery.Activator>
</template>
