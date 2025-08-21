<script lang="ts" setup>
  import { toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const props = defineProps<{
    frontmatter?: {
      meta: {
        description: string
        keywords: string
        title: string
      }
      features: {
        github: string
        label: string
        performance?: number
      }
    }
  }>()

  const route = useRoute()

  const contribute = toRef(() => {
    const link = route.path.split('/').slice(1).filter(Boolean).join('/')

    return `https://github.com/vuetifyjs/0/edit/master/apps/docs/src/pages/${link}.md`
  })

  const github = toRef(() => {
    if (!props.frontmatter) return false

    return `https://github.com/vuetifyjs/0/tree/master/packages/0/src${props.frontmatter.features.github}`
  })

  const label = toRef(() => {
    if (!props.frontmatter) return false

    const original = encodeURIComponent(props.frontmatter.features.label)

    return `https://github.com/vuetifyjs/0/labels/${original}`
  })
</script>

<template>
  <div class="my-2 inline-flex gap-2 flex-wrap">
    <a
      class="text-[none]!"
      :href="contribute"
      rel="noopener noreferrer"
      target="_blank"
    >
      <AppChip
        color="text-blue-800"
        icon="pencil"
        text="Edit this page"
      />
    </a>

    <!-- <AppChip
      color="text-red-400"
      icon="bug"
      text="Report a Bug"
    /> -->

    <a
      v-if="label"
      class="text-[none]!"
      :href="label"
      rel="noopener noreferrer"
      target="_blank"
    >
      <AppChip
        color="text-yellow-600"
        icon="alert"
        text="Open issues"
      />
    </a>

    <a
      v-if="github"
      class="text-[none]!"
      :href="github"
      rel="noopener noreferrer"
      target="_blank"
    >
      <AppChip
        icon="github"
        text="View on GitHub"
      />
    </a>

    <!-- <AppChip
      color="text-gray-500"
      icon="markdown"
      text="Copy Page as Markdown"
    /> -->
  </div>
</template>
