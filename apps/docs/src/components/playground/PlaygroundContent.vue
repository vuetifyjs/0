<script setup lang="ts">
  // Content
  import IntroPanel from '@/skillz/intro.md'
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
