<script setup lang="ts">
  import { Treeview } from '../Treeview/index'
</script>

<template>
  <!-- open-all so nested treeitems are in the DOM for the audit (expand is on Activator, not the treeitem). -->
  <Treeview.Root open-all>
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
