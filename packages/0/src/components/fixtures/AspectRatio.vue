<script setup lang="ts">
  import { AspectRatio } from '../AspectRatio/index'
</script>

<template>
  <AspectRatio :ratio="16 / 9">
    <img alt="A landscape" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==">
  </AspectRatio>
</template>
