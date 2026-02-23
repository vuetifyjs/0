<script setup lang="ts">
  // Content
  import IntroPanel from '@/skillz/intro.md'

  definePage({
    meta: {
      layout: 'playground',
      level: 1,
    },
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
          </PlaygroundWorkspaceTop>

          <PlaygroundWorkspaceBottom>
            <PlaygroundEditorPreview />
          </PlaygroundWorkspaceBottom>
        </PlaygroundWorkspace>
      </PlaygroundAppRight>
    </PlaygroundAppContent>
  </PlaygroundApp>
</template>
