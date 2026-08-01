<script setup lang="ts">
  defineOptions({ name: 'OnyxCards' })

  const teamName = shallowRef('')
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    <code>OnCard</code> is five flat sub-parts, not a compound with dotted access — mix and
    match whichever pieces a given card needs.
  </p>

  <h2 class="onyx-cards__heading mt-8">Anatomy</h2>

  <div class="onyx-exhibit mt-3">
    <p class="onyx-hallmark onyx-exhibit__caption">Header · title · description · content · footer</p>

    <OnCard style="max-width: 420px;">
      <OnCardHeader>
        <p class="onyx-hallmark">OnCardHeader</p>

        <OnCardTitle>
          <span class="onyx-hallmark" style="display: block;">OnCardTitle</span>
          Card title
        </OnCardTitle>

        <OnCardDescription>
          <span class="onyx-hallmark" style="display: block;">OnCardDescription</span>
          A one-line description sits directly under the title.
        </OnCardDescription>
      </OnCardHeader>

      <OnCardContent>
        <p class="onyx-hallmark">OnCardContent</p>
        <p>The body — any content, not just text.</p>
      </OnCardContent>

      <OnCardFooter>
        <div class="flex flex-col gap-1">
          <p class="onyx-hallmark">OnCardFooter</p>
          <OnButton size="sm">Action</OnButton>
        </div>
      </OnCardFooter>
    </OnCard>
  </div>

  <h2 class="onyx-cards__heading mt-8">Compositions</h2>

  <div class="onyx-exhibit mt-3">
    <p class="onyx-hallmark onyx-exhibit__caption">Stat · form · status</p>

    <div class="grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
      <OnCard>
        <OnCardHeader>
          <OnCardDescription>Total users</OnCardDescription>
        </OnCardHeader>

        <OnCardContent>
          <p style="font-size: var(--onyx-text-3xl-size, 30px); font-weight: 300; font-family: var(--onyx-font-serif, inherit); margin: 0;">2,847</p>
          <p style="color: var(--onyx-success, #16a34a); font-size: 13px; margin: 4px 0 0;">+12.4% this month</p>
        </OnCardContent>
      </OnCard>

      <OnCard>
        <OnCardHeader>
          <OnCardTitle>Create a team</OnCardTitle>
          <OnCardDescription>Teams share billing and permissions.</OnCardDescription>
        </OnCardHeader>

        <OnCardContent>
          <OnInput v-model="teamName" label="Team name" placeholder="Acme Inc." />
        </OnCardContent>

        <OnCardFooter>
          <OnButton size="sm">Create team</OnButton>
        </OnCardFooter>
      </OnCard>

      <OnCard>
        <OnCardHeader>
          <div class="flex items-center gap-2">
            <OnCardTitle>Deployment complete</OnCardTitle>
            <OnBadge variant="secondary">Success</OnBadge>
          </div>

          <OnCardDescription>onyx-wave1 · 2 minutes ago</OnCardDescription>
        </OnCardHeader>

        <OnCardContent>
          <p>Build 4f2a9c1 deployed to production with no errors.</p>
        </OnCardContent>
      </OnCard>
    </div>
  </div>
</template>

<!-- Unscoped: page-local anatomy labels + heading, layout scaffolding only. -->
<style>
  .onyx-cards__heading {
    font-size: var(--onyx-text-lg-size, 18px);
    font-weight: 600;
    margin-bottom: 0;
  }
</style>
