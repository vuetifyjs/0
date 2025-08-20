<script lang="ts" setup>
  import { toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  const contribute = toRef(() => {
    const link = route.path.split('/').slice(1).filter(Boolean).join('/')

    return `https://github.com/vuetifyjs/0/edit/master/apps/docs/src/pages/${link}.md`
  })

  // const label = computed(() => {
  //   if (!frontmatter.value?.features?.label) return false

  //   const original = encodeURIComponent(frontmatter.value.features.label)

  //   return `https://github.com/vuetifyjs/vuetify/labels/${original}`
  // })
</script>

<template>
  <div class="my-2 inline-flex gap-2 flex-wrap">
    <a class="text-[none]!" :href="contribute" rel="noopener noreferrer" target="_blank">
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

    <!-- <AppChip
      color="text-yellow-600"
      icon="alert"
      text="Open issues"
    /> -->

    <!-- <a class="text-[none]!" :href="contribute" rel="noopener noreferrer" target="_blank">
      <AppChip
        icon="github"
        text="View on GitHub"
      />
    </a> -->

    <!-- <AppChip
      color="text-gray-500"
      icon="markdown"
      text="Copy Page as Markdown"
    /> -->
  </div>
</template>
