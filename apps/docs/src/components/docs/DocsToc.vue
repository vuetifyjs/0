<script lang="ts" setup>
  import { useToc } from '@/composables/useToc'

  const { headings, selectedId, scrollTo } = useToc()

  function scrollToTop () {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
</script>

<template>
  <aside
    v-if="headings.length > 0"
    class="hidden xl:block fixed right-4 top-25 w-[200px] max-h-[calc(100vh-145px)] overflow-y-auto text-sm"
  >
    <button
      class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide hover:text-primary hover:underline transition-colors cursor-pointer after:content-['_§']"
      type="button"
      @click="scrollToTop"
    >
      On this page
    </button>

    <nav>
      <ul class="space-y-1">
        <li v-for="h2 in headings" :key="h2.id">
          <a
            class="block py-1 hover:text-primary hover:underline transition-colors truncate"
            :class="selectedId === h2.id
              ? 'text-primary font-medium underline'
              : 'text-gray-600 dark:text-gray-300'"
            :href="`#${h2.id}`"
            @click.prevent="scrollTo(h2.id)"
          >
            {{ h2.text }}
          </a>

          <ul v-if="h2.children.length > 0" class="ml-3 space-y-1">
            <li v-for="h3 in h2.children" :key="h3.id">
              <a
                class="block py-1 hover:text-primary hover:underline transition-colors truncate text-xs"
                :class="selectedId === h3.id
                  ? 'text-primary font-medium underline'
                  : 'text-gray-500 dark:text-gray-400'"
                :href="`#${h3.id}`"
                @click.prevent="scrollTo(h3.id)"
              >
                {{ h3.text }}
              </a>

              <ul v-if="h3.children.length > 0" class="ml-3 space-y-0.5">
                <li v-for="h4 in h3.children" :key="h4.id">
                  <a
                    class="block py-0.5 hover:text-primary hover:underline transition-colors truncate text-xs"
                    :class="selectedId === h4.id
                      ? 'text-primary font-medium underline'
                      : 'text-gray-400 dark:text-gray-500'"
                    :href="`#${h4.id}`"
                    @click.prevent="scrollTo(h4.id)"
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
  </aside>
</template>
