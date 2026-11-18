<script setup lang="ts">
  import { BMenu, BScrollSpy } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const menu = shallowRef(false)

  const copy = 'This is some placeholder content for the scrollspy page. Note that as you scroll down the page, the appropriate navigation link is highlighted. It is repeated throughout the component example. We keep adding some more example copy here to emphasize the scrolling and highlighting.'
</script>

<template>
  <BScrollSpy
    class="overflow-auto rounded-2"
    smooth
    style="height: 16rem"
    tabindex="0"
  >
    <nav class="navbar bg-1 px-3 mb-3 rounded-2 sticky-top">
      <a class="navbar-brand" href="#">Navbar</a>

      <ul class="nav nav-pills">
        <li class="nav-item">
          <BScrollSpy.Link id="scrollspyHeading1">First</BScrollSpy.Link>
        </li>

        <li class="nav-item">
          <BScrollSpy.Link id="scrollspyHeading2">Second</BScrollSpy.Link>
        </li>

        <li class="nav-item">
          <BMenu
            v-model="menu"
            label="Menu"
            trigger-class="nav-link"
          >
            <BMenu.Item href="#scrollspyHeading3">Third</BMenu.Item>
            <BMenu.Item href="#scrollspyHeading4">Fourth</BMenu.Item>
            <BMenu.Divider />
            <BMenu.Item href="#scrollspyHeading5">Fifth</BMenu.Item>
          </BMenu>
        </li>
      </ul>
    </nav>

    <div class="bg-1 p-3 rounded-2">
      <BScrollSpy.Section id="scrollspyHeading1">
        <h4>First heading</h4>
        <p>{{ copy }}</p>
      </BScrollSpy.Section>

      <BScrollSpy.Section id="scrollspyHeading2">
        <h4>Second heading</h4>
        <p>{{ copy }}</p>
      </BScrollSpy.Section>

      <BScrollSpy.Section id="scrollspyHeading3">
        <h4>Third heading</h4>
        <p>{{ copy }}</p>
      </BScrollSpy.Section>

      <BScrollSpy.Section id="scrollspyHeading4">
        <h4>Fourth heading</h4>
        <p>{{ copy }}</p>
      </BScrollSpy.Section>

      <BScrollSpy.Section id="scrollspyHeading5">
        <h4>Fifth heading</h4>
        <p>{{ copy }}</p>
      </BScrollSpy.Section>
    </div>
  </BScrollSpy>
</template>
