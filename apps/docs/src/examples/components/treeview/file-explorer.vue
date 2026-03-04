<script setup lang="ts">
  import { Treeview } from '@vuetify/v0'

  interface TreeFile {
    title: string
    file?: string
    children?: TreeFile[]
  }

  const svg = {
    folder: 'M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z',
    folderOpen: 'M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.89 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z',
    file: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z',
  }

  const fileColors: Record<string, string> = {
    html: 'text-orange-600',
    js: 'text-yellow-600',
    json: 'text-amber-500',
    md: 'text-sky-500',
    pdf: 'text-red-500',
    png: 'text-green-500',
    txt: 'text-stone-400',
    xls: 'text-emerald-600',
  }

  function color (ext?: string) {
    return ext ? fileColors[ext] ?? 'text-on-surface-variant' : 'text-on-surface-variant'
  }

  const items: TreeFile[] = [
    { title: '.git' },
    { title: 'node_modules' },
    {
      title: 'public',
      children: [
        {
          title: 'static',
          children: [{ title: 'logo.png', file: 'png' }],
        },
        { title: 'favicon.ico', file: 'png' },
        { title: 'index.html', file: 'html' },
      ],
    },
    { title: '.gitignore', file: 'txt' },
    { title: 'babel.config.js', file: 'js' },
    { title: 'package.json', file: 'json' },
    { title: 'README.md', file: 'md' },
    { title: 'vue.config.js', file: 'js' },
    { title: 'yarn.lock', file: 'txt' },
  ]
</script>

<template>
  <Treeview.Root>
    <Treeview.List class="text-sm text-on-surface select-none">
      <template v-for="item in items" :key="item.title">
        <Treeview.Item
          v-if="item.children"
          v-slot="{ isOpen }"
          class="py-0.5"
          :value="item.title"
        >
          <Treeview.Activator
            class="inline-flex items-center gap-2 border-none bg-transparent p-0 cursor-pointer text-on-surface hover:text-primary"
          >
            <svg class="size-4 shrink-0 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path :d="isOpen ? svg.folderOpen : svg.folder" /></svg>
            {{ item.title }}
          </Treeview.Activator>

          <Treeview.Content>
            <Treeview.Group class="pl-5">
              <template v-for="child in item.children" :key="child.title">
                <Treeview.Item
                  v-if="child.children"
                  v-slot="{ isOpen: childOpen }"
                  class="py-0.5"
                  :value="child.title"
                >
                  <Treeview.Activator
                    class="inline-flex items-center gap-2 border-none bg-transparent p-0 cursor-pointer text-on-surface hover:text-primary"
                  >
                    <svg class="size-4 shrink-0 text-amber-400" fill="currentColor" viewBox="0 0 24 24"><path :d="childOpen ? svg.folderOpen : svg.folder" /></svg>
                    {{ child.title }}
                  </Treeview.Activator>

                  <Treeview.Content>
                    <Treeview.Group class="pl-5">
                      <Treeview.Item
                        v-for="leaf in child.children"
                        :key="leaf.title"
                        class="py-0.5"
                        :value="leaf.title"
                      >
                        <span class="inline-flex items-center gap-2">
                          <svg class="size-4 shrink-0" :class="color(leaf.file)" fill="currentColor" viewBox="0 0 24 24"><path :d="svg.file" /></svg>
                          {{ leaf.title }}
                        </span>
                      </Treeview.Item>
                    </Treeview.Group>
                  </Treeview.Content>
                </Treeview.Item>

                <Treeview.Item v-else class="py-0.5" :value="child.title">
                  <span class="inline-flex items-center gap-2">
                    <svg class="size-4 shrink-0" :class="color(child.file)" fill="currentColor" viewBox="0 0 24 24"><path :d="svg.file" /></svg>
                    {{ child.title }}
                  </span>
                </Treeview.Item>
              </template>
            </Treeview.Group>
          </Treeview.Content>
        </Treeview.Item>

        <Treeview.Item v-else class="py-0.5" :value="item.title">
          <span class="inline-flex items-center gap-2">
            <svg class="size-4 shrink-0" :class="item.file ? color(item.file) : 'text-amber-400'" fill="currentColor" viewBox="0 0 24 24"><path :d="item.file ? svg.file : svg.folder" /></svg>
            {{ item.title }}
          </span>
        </Treeview.Item>
      </template>
    </Treeview.List>
  </Treeview.Root>
</template>
