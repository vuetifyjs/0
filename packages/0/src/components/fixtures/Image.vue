<script setup lang="ts">
  import { Image } from '../Image/index'
</script>

<template>
  <Image.Root src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==">
    <Image.Img alt="A photo" height="1" width="1" />
    <Image.Placeholder>Loading...</Image.Placeholder>
    <Image.Fallback>Failed to load</Image.Fallback>
  </Image.Root>
</template>
