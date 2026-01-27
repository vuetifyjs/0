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
    class="hidden xl:block rounded-lg fixed right-4 top-25 w-[200px] max-h-[calc(100vh-145px)] overflow-y-auto text-sm"
    :padding="8"
    step="toc"
  >
    <button
      class="text-xs font-medium text-on-surface-variant mb-3 uppercase tracking-wide hover:text-primary hover:underline transition-colors cursor-pointer after:content-['_§']"
      type="button"
      @click="scrollToTop"
    >
      On this page
    </button>

    <nav aria-label="Table of contents">
      <ul class="space-y-1">
        <li v-for="h2 in toc.headings.value" :key="h2.id">
          <a
            :aria-current="toc.selectedId.value === h2.id ? 'location' : undefined"
            class="block py-1 hover:text-primary hover:underline transition-colors truncate"
            :class="toc.selectedId.value === h2.id
              ? 'text-primary font-medium underline'
              : 'text-on-surface-variant'"
            :href="`#${h2.id}`"
            @click.prevent="toc.scrollTo(h2.id)"
          >
            {{ h2.text }}
          </a>

          <ul v-if="h2.children.length > 0" class="ml-3 space-y-1">
            <li v-for="h3 in h2.children" :key="h3.id">
              <a
                :aria-current="toc.selectedId.value === h3.id ? 'location' : undefined"
                class="block py-1 hover:text-primary hover:underline transition-colors truncate text-xs"
                :class="toc.selectedId.value === h3.id
                  ? 'text-primary font-medium underline'
                  : 'text-on-surface-variant'"
                :href="`#${h3.id}`"
                @click.prevent="toc.scrollTo(h3.id)"
              >
                {{ h3.text }}
              </a>

              <ul v-if="h3.children.length > 0" class="ml-3 space-y-0.5">
                <li v-for="h4 in h3.children" :key="h4.id">
                  <a
                    :aria-current="toc.selectedId.value === h4.id ? 'location' : undefined"
                    class="block py-0.5 hover:text-primary hover:underline transition-colors truncate text-xs"
                    :class="toc.selectedId.value === h4.id
                      ? 'text-primary font-medium underline'
                      : 'text-on-surface-variant'"
                    :href="`#${h4.id}`"
                    @click.prevent="toc.scrollTo(h4.id)"
                  >
                    {{ h4.text }}
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </Discovery.Activator>
</template>
