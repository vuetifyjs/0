<script setup lang="ts">
  import { BBreadcrumb } from '@paper/bootstrap'
</script>

<template>
  <BBreadcrumb>
    <BBreadcrumb.Item>
      <BBreadcrumb.Link href="#">Home</BBreadcrumb.Link>
    </BBreadcrumb.Item>

    <BBreadcrumb.Divider>/</BBreadcrumb.Divider>

    <BBreadcrumb.Item>
      <BBreadcrumb.Link href="#">Library</BBreadcrumb.Link>
    </BBreadcrumb.Item>

    <BBreadcrumb.Divider>/</BBreadcrumb.Divider>

    <BBreadcrumb.Item current>
      <BBreadcrumb.Link active href="#">Data</BBreadcrumb.Link>
    </BBreadcrumb.Item>
  </BBreadcrumb>
</template>
