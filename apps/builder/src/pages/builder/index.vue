<script setup lang="ts">
  import { mdiArrowLeft, mdiCogOutline, mdiTuneVariant } from '@mdi/js'
  import { GnDotGrid } from '@paper/genesis'

  // Framework
  import { Button, Toggle } from '@vuetify/v0'

  // Components
  import Icon from '@/components/app/Icon.vue'
  import StepBar from '@/components/app/StepBar.vue'
  import PluginInfo from '@/components/PluginInfo.vue'

  import { getPluginById } from '@/data/plugins'
  import { getCategories } from '@/data/questions'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { toRef } from 'vue'
  import { useRouter } from 'vue-router'

  const store = useBuilderStore()
  const router = useRouter()

  // Each category is a panel of the machine, opened up: the line items live inside it
  // rather than floating on the page, so the grouping is a container, not a heading.
  const categories = toRef(() => getCategories().map(category => ({
    ...category,
    picked: category.questions.filter(q => store.isPluginSelected(q.feature)).length,
  })))

  function meta (feature: string) {
    return getPluginById(feature)
  }

  // mdiCogOutline is a defensive fallback only — every question.feature resolves to a
  // PLUGINS entry, so this never actually renders.
  function icon (feature: string) {
    return meta(feature)?.icon ?? mdiCogOutline
  }

  // A uniform dot grid on every selected card reads as stamped, not drafted. Coverage and
  // corner are derived from the plugin id rather than Math.random — stable across
  // re-renders and unrelated toggles, and identical between server and client render so
  // hydration never mismatches. Two different bit slices of the same hash keep coverage
  // and corner from moving in lockstep for adjacent ids.
  function blueprint (id: string): { coverage: number, origin: string } {
    let hash = 0
    for (const char of id) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) % 999_999_937
    const corners = ['top left', 'top right', 'bottom left', 'bottom right']
    return {
      coverage: 40 + (hash % 31),
      origin: corners[Math.trunc(hash / 26) % corners.length],
    }
  }

  function onContinue () {
    router.push('/builder/configure')
  }

  function onBack () {
    router.push('/')
  }
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 sm:px-8 pt-5 sm:pt-6 pb-24">
    <Button.Root class="btn-quiet mb-8" @click="onBack">
      <Button.Icon>
        <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiArrowLeft" fill="currentColor" /></svg>
      </Button.Icon>

      <Button.Content>Back</Button.Content>
    </Button.Root>

    <header class="mb-10">
      <p class="t-eyebrow text-primary mb-3">Step 1 · Select</p>

      <h2 class="t-title mb-3">Choose your plugins</h2>

      <p class="t-body text-on-surface-variant max-w-2xl">
        Plugins are installed at app startup via <code class="code-chip">app.use()</code>.
        Pick the ones your library needs — you will configure each one next.
      </p>
    </header>

    <div class="flex flex-col gap-4">
      <section v-for="category in categories" :key="category.id" class="panel overflow-hidden">
        <div class="flex items-baseline justify-between gap-3 px-4 py-3 border-b border-divider bg-surface-variant/40">
          <div class="min-w-0">
            <h3 class="t-section">{{ category.title }}</h3>
            <p class="t-meta text-on-surface-variant">{{ category.description }}</p>
          </div>

          <p class="t-index flex-shrink-0" :class="category.picked > 0 ? 'text-primary' : 'text-on-surface-variant/60'">
            {{ category.picked }}/{{ category.questions.length }}
          </p>
        </div>

        <!-- Portrait cards, not rows: playing-card proportions read as a hand of choices,
             so the panel spends its body on columns rather than a single divided list. -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 p-3">
          <!-- The info affordance sits outside the toggle: a button inside a button is
               invalid, and nesting it would make the whole card announce as "about". -->
          <div
            v-for="question in category.questions"
            :key="question.id"
            class="group relative"
          >
            <Toggle.Root
              :aria-label="question.title"
              class="pick min-h-56 w-full p-3.5 overflow-hidden flex flex-col"
              :class="store.isPluginSelected(question.feature) ? 'pick-on' : 'pick-off'"
              :model-value="store.isPluginSelected(question.feature)"
              @update:model-value="store.togglePlugin(question.feature)"
            >
              <!-- Picked = drafted into the blueprint: the same dot-grid treatment the
                   manifest aside uses, so a selected card visibly joins that world.
                   Coverage and corner vary per plugin (see `blueprint`) so a row of
                   selected cards reads as organic drafting, not one template stamped
                   across every card. Sits behind an inner `relative` wrapper (see
                   PreviewSummary's identical recipe) so text stacks above it instead of
                   being painted over. -->
              <GnDotGrid
                v-if="store.isPluginSelected(question.feature)"
                aria-hidden="true"
                class="absolute inset-0 pointer-events-none"
                :coverage="blueprint(question.feature).coverage"
                :lines="6"
                :origin="blueprint(question.feature).origin"
              />

              <!-- `flex-1` (not `h-full`): Toggle.Root's own height comes from a
                   `min-height` floor, not an explicit `height`, so percentage heights
                   on this child never reliably resolve to it — flex-grow does, since it
                   sizes off the container's actual layout box, not its declared height.
                   `flex flex-col` on Toggle.Root itself is also required: it renders as
                   a native <button>, and buttons vertically-center their content by
                   default in every browser — without an explicit flex context here to
                   override that, this whole block (and everything in it) would recenter
                   instead of hugging the top edge. -->
              <div class="relative flex-1 flex flex-col items-start gap-2">
                <span
                  class="pick-mark w-7 h-7"
                  :class="store.isPluginSelected(question.feature) ? 'pick-mark-on' : 'pick-mark-off text-on-surface-variant'"
                >
                  <Icon :path="icon(question.feature)" :size="16" />
                </span>

                <span class="t-section leading-snug">{{ question.title }}</span>

                <p class="t-meta text-on-surface-variant w-full break-words">{{ question.description }}</p>

                <span class="flex-1" />

                <span v-if="meta(question.feature)?.hasConfig" class="self-end text-on-surface-variant/70">
                  <Icon :path="mdiTuneVariant" :size="13" />
                  <span class="sr-only">Configurable</span>
                </span>
              </div>
            </Toggle.Root>

            <PluginInfo
              :id="question.feature"
              :description="question.description"
              :docs="meta(question.feature)?.docs"
              :title="question.title"
            />
          </div>
        </div>
      </section>
    </div>
  </div>

  <StepBar>
    <!-- The noun drops below sm so the count and the action stay on one row. Spelled out
         twice rather than wrapping the noun in a span: Vue condenses the leading space
         inside the span away, and "5plugins selected" is worse than a duplicated string. -->
    <p class="t-index text-on-surface-variant">
      <span class="sm:hidden">{{ store.selectedPlugins.size }} selected</span>

      <span class="hidden sm:inline">
        {{ store.selectedPlugins.size }} {{ store.selectedPlugins.size === 1 ? 'plugin' : 'plugins' }} selected
      </span>
    </p>

    <Button.Root
      class="btn-primary"
      :disabled="store.selectedPlugins.size === 0"
      @click="onContinue"
    >
      Continue
    </Button.Root>
  </StepBar>
</template>
