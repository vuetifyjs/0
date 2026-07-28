<script setup lang="ts">
  import { Treeview } from '../Treeview/index'
</script>

<template>
  <Treeview.Root>
    <Treeview.List>
      <Treeview.Item>
        <Treeview.Activator>Documents</Treeview.Activator>

        <Treeview.Content>
          <Treeview.Group>
            <Treeview.Item>
              <Treeview.Activator>Resume.pdf</Treeview.Activator>
            </Treeview.Item>
          </Treeview.Group>
        </Treeview.Content>
      </Treeview.Item>
    </Treeview.List>
  </Treeview.Root>
</template>
