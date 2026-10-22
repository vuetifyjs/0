<script setup lang="ts">
  import { BNavOverflow } from '@paper/bootstrap'
</script>

<template>
  <BNavOverflow>
    <ul class="nav nav-pills">
      <BNavOverflow.Item>
        <a aria-current="page" class="nav-link active" href="#">Home</a>
      </BNavOverflow.Item>

      <BNavOverflow.Item>
        <a class="nav-link" href="#">Dashboard</a>
      </BNavOverflow.Item>

      <BNavOverflow.Item>
        <a class="nav-link" href="#">Products</a>
      </BNavOverflow.Item>

      <BNavOverflow.Item>
        <a class="nav-link" href="#">Services</a>
      </BNavOverflow.Item>

      <BNavOverflow.Item>
        <a class="nav-link" href="#">Analytics</a>
      </BNavOverflow.Item>

      <BNavOverflow.Item>
        <a class="nav-link" href="#">Reports</a>
      </BNavOverflow.Item>

      <BNavOverflow.Item>
        <a class="nav-link" href="#">Billing</a>
      </BNavOverflow.Item>

      <BNavOverflow.Item keep>
        <a class="nav-link" href="#">Contact</a>
      </BNavOverflow.Item>
    </ul>
  </BNavOverflow>
</template>
