<script setup lang="ts">
  import { useHead } from '@unhead/vue'

  // Content
  import IntroPanel from '@/skillz/intro.md'

  definePage({
    meta: {
      layout: 'playground',
      level: 1,
    },
  })

  useHead({
    title: 'Playground',
    meta: [
      { key: 'description', name: 'description', content: 'Experiment with @vuetify/v0 headless composables and components in an interactive browser-based editor.' },
      { key: 'og:title', property: 'og:title', content: 'Playground' },
      { key: 'og:description', property: 'og:description', content: 'Experiment with @vuetify/v0 headless composables and components in an interactive browser-based editor.' },
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
