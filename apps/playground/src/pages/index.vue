<script setup lang="ts">
  import { useHead } from '@unhead/vue'

  // Framework
  import { IN_BROWSER } from '@vuetify/v0'

  // Composables
  import { ONE_PLAYGROUND_PARAM } from '@/composables/useOnePlaygrounds'

  // Content
  import IntroPanel from '@/content/intro.md'

  // Utilities
  import { useRouter } from 'vue-router'

  const router = useRouter()

  // Redirect legacy `/?playground=<id>` to canonical `/playgrounds/<id>` (preserve hash)
  if (IN_BROWSER) {
    const url = new URL(window.location.href)
    const legacyId = url.searchParams.get(ONE_PLAYGROUND_PARAM)
    if (legacyId) {
      router.replace({ path: `/playgrounds/${legacyId}`, hash: url.hash })
    }
  }

  useHead({
    title: 'Vuetify0 Play',
    meta: [
      { key: 'description', name: 'description', content: 'Experiment with @vuetify/v0 headless composables and components in an interactive browser-based editor.' },
      { key: 'og:title', property: 'og:title', content: 'Vuetify0 Play' },
      { key: 'og:description', property: 'og:description', content: 'Experiment with @vuetify/v0 headless composables and components in an interactive browser-based editor.' },
      { key: 'og:image', property: 'og:image', content: 'https://cdn.vuetifyjs.com/docs/images/one/logos/vplay-logo-og.png' },
    ],
  })
</script>

<template>
  <PlaygroundApp>
    <PlaygroundAppBar />

    <PlaygroundAppContent>
      <PlaygroundAppLeft>
        <PlaygroundMarkdownHeader>
          Introduction
        </PlaygroundMarkdownHeader>

        <PlaygroundMarkdown :component="IntroPanel" />
      </PlaygroundAppLeft>

      <PlaygroundAppRight>
        <PlaygroundWorkspace>
          <PlaygroundWorkspaceTop>
            <PlaygroundWorkspaceLeft>
              <PlaygroundEditorFileTree />
            </PlaygroundWorkspaceLeft>

            <PlaygroundWorkspaceRight>
              <PlaygroundEditorTabs />

              <PlaygroundEditorBreadcrumbs />

              <PlaygroundEditor />
            </PlaygroundWorkspaceRight>

            <PlaygroundWorkspaceSide>
              <PlaygroundEditorPreview />
            </PlaygroundWorkspaceSide>
          </PlaygroundWorkspaceTop>

          <PlaygroundWorkspaceBottom>
            <PlaygroundEditorPreview />
          </PlaygroundWorkspaceBottom>
        </PlaygroundWorkspace>
      </PlaygroundAppRight>
    </PlaygroundAppContent>
  </PlaygroundApp>
</template>
