<script lang="ts" setup>
  import { shallowRef, toRef } from 'vue'
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

  const base = 'https://github.com/vuetifyjs/0'
  const copied = shallowRef(false)

  const route = useRoute()

  const link = toRef(() => route.path.split('/').slice(1).filter(Boolean).join('/'))
  const edit = toRef(() => `${base}/edit/master/apps/docs/src/pages/${link.value}.md`)

  const github = toRef(() => {
    const github = props.frontmatter?.features?.github

    if (!github) return false

    return `${base}/tree/master/packages/0/src${github}`
  })

  const label = toRef(() => {
    const label = props.frontmatter?.features?.label

    if (!label) return false

    const original = encodeURIComponent(label)

    return `${base}/labels/${original}`
  })

  async function onClickCopy () {
    let raw = ''

    function replace (element: string, value: string) {
      const regexp = new RegExp(`<${element}[\\s\\S]*?>([\\s\\S]*?\\/>\n\n)?`, 'g')

      return value.replace(regexp, '')
    }

    try {
      copied.value = true

      const { request } = await import('@/plugins/octokit').then(m => m.default || m)
      const { data: { content } } = await request('GET /repos/vuetifyjs/0/contents/apps/docs/src/pages/{link}.md', {
        link: link.value,
      })

      raw = atob(content)
      raw = replace('DocsPageFeatures', raw)

      navigator.clipboard.writeText(raw)
    } catch (error) {
      navigator.clipboard.writeText(String(error))
    } finally {
      setTimeout(() => (copied.value = false), 2000)
    }
  }
</script>

<template>
  <div class="my-2 inline-flex gap-2 flex-wrap mb-8">
    <a
      :href="edit"
      rel="noopener noreferrer"
      target="_blank"
    >
      <AppChip
        color="text-blue-800"
        icon="pencil"
        text="Edit this page"
      />
    </a>

    <a
      href="https://issues.vuetifyjs.com/"
      rel="noopener noreferrer"
      target="_blank"
    >
      <AppChip
        color="text-red-400"
        icon="bug"
        text="Report a Bug"
      />
    </a>

    <a
      v-if="label"
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
      :href="github"
      rel="noopener noreferrer"
      target="_blank"
    >
      <AppChip
        icon="github"
        text="View on GitHub"
      />
    </a>

    <AppChip
      :color="copied ? 'text-green-700' : 'text-gray-500'"
      :icon="copied ? 'success' : 'markdown'"
      :text="copied ? 'Copied' : 'Copy Page as Markdown'"
      @click="onClickCopy"
    />
  </div>
</template>
