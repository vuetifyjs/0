<script setup lang="ts">
  import { BBreadcrumb } from '@paper/bootstrap'
</script>

<template>
  <div class="d-flex flex-column align-items-start gap-3">
    <BBreadcrumb>
      <BBreadcrumb.Item>
        <BBreadcrumb.Link href="#">Home</BBreadcrumb.Link>
      </BBreadcrumb.Item>

      <BBreadcrumb.Divider />

      <BBreadcrumb.Item current>
        <BBreadcrumb.Link active href="#">Library</BBreadcrumb.Link>
      </BBreadcrumb.Item>
    </BBreadcrumb>

    <BBreadcrumb>
      <BBreadcrumb.Item>
        <BBreadcrumb.Link href="#">Home</BBreadcrumb.Link>
      </BBreadcrumb.Item>

      <BBreadcrumb.Divider>›</BBreadcrumb.Divider>

      <BBreadcrumb.Item current>
        <BBreadcrumb.Link active href="#">Library</BBreadcrumb.Link>
      </BBreadcrumb.Item>
    </BBreadcrumb>
  </div>
</template>
