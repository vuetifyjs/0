<script setup lang="ts">
  import {
    BuMenu,
    BuMenuItem,
    BuMenuLabel,
    BuMenuLink,
    BuMenuList,
  } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const active = shallowRef('Manage Your Team')
</script>

<template>
  <BuMenu v-model="active">
    <BuMenuLabel>Administration</BuMenuLabel>

    <BuMenuList>
      <BuMenuItem>
        <BuMenuLink value="Team Settings">
          <span class="icon is-small">
            <i aria-hidden="true" class="fas fa-cog" />
          </span>
          <span>Team Settings</span>
        </BuMenuLink>
      </BuMenuItem>

      <BuMenuItem>
        <BuMenuLink value="Manage Your Team">
          <span class="icon is-small">
            <i aria-hidden="true" class="fas fa-users" />
          </span>
          <span>Manage Your Team</span>
          <span class="tag is-info is-light ml-2">3</span>
        </BuMenuLink>

        <BuMenuList nested>
          <BuMenuItem>
            <BuMenuLink value="Members">Members</BuMenuLink>
          </BuMenuItem>

          <BuMenuItem>
            <BuMenuLink value="Plugins">Plugins</BuMenuLink>
          </BuMenuItem>

          <BuMenuItem>
            <BuMenuLink value="Add a member">Add a member</BuMenuLink>
          </BuMenuItem>
        </BuMenuList>
      </BuMenuItem>

      <BuMenuItem>
        <BuMenuLink value="Invitations">Invitations</BuMenuLink>
      </BuMenuItem>

      <BuMenuItem>
        <BuMenuLink value="Authentication">Authentication</BuMenuLink>
      </BuMenuItem>
    </BuMenuList>
  </BuMenu>
</template>
