<script setup lang="ts">
  import { useHead } from '@unhead/vue'

  // Content
  import IntroPanel from '@/content/intro.md'

  useHead({
    title: 'Vuetify Play',
    meta: [
      { key: 'description', name: 'description', content: 'Experiment with @vuetify/v0 headless composables and components in an interactive browser-based editor.' },
      { key: 'og:title', property: 'og:title', content: 'Vuetify Play' },
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
