<script setup lang="ts">
  import { BuMenu } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const active = shallowRef('Manage Your Team')
</script>

<template>
  <BuMenu v-model="active">
    <BuMenu.Label>Administration</BuMenu.Label>

    <BuMenu.List>
      <BuMenu.Item>
        <BuMenu.Link value="Team Settings">
          <span class="icon is-small">
            <i aria-hidden="true" class="fas fa-cog" />
          </span>

          <span>Team Settings</span>
        </BuMenu.Link>
      </BuMenu.Item>

      <BuMenu.Item>
        <BuMenu.Link value="Manage Your Team">
          <span class="icon is-small">
            <i aria-hidden="true" class="fas fa-users" />
          </span>

          <span>Manage Your Team</span>
          <span class="tag is-info is-light ml-2">3</span>
        </BuMenu.Link>

        <BuMenu.List nested>
          <BuMenu.Item>
            <BuMenu.Link value="Members">Members</BuMenu.Link>
          </BuMenu.Item>

          <BuMenu.Item>
            <BuMenu.Link value="Plugins">Plugins</BuMenu.Link>
          </BuMenu.Item>

          <BuMenu.Item>
            <BuMenu.Link value="Add a member">Add a member</BuMenu.Link>
          </BuMenu.Item>
        </BuMenu.List>
      </BuMenu.Item>

      <BuMenu.Item>
        <BuMenu.Link value="Invitations">Invitations</BuMenu.Link>
      </BuMenu.Item>

      <BuMenu.Item>
        <BuMenu.Link value="Authentication">Authentication</BuMenu.Link>
      </BuMenu.Item>
    </BuMenu.List>
  </BuMenu>
</template>
