<template>
  <div class="md1-docs-leading">
    <div class="md1-docs-leading-block">
      <p class="md1-docs-leading-tag md1-type-caption">Subheading, 24 dp under a headline</p>

      <h3 class="md1-docs-leading-text md1-type-headline">Coastal walks</h3>

      <p class="md1-docs-leading-text md1-type-subheading">
        Six routes between the lighthouse and the harbour, each under two hours, with the tide times for every stretch of beach.
      </p>
    </div>

    <div class="md1-docs-leading-block">
      <p class="md1-docs-leading-tag md1-type-caption">Subheading 2, 28 dp paired with body text</p>

      <p class="md1-docs-leading-text md1-type-subheading-2">
        Lighthouse to the harbour: the cliff path, then the long sand
      </p>

      <p class="md1-docs-leading-text md1-type-body-1">
        Leave the car park by the gate behind the lighthouse and follow the cliff path west. Past the second stile the path drops to the beach; at low tide it is sand all the way to the harbour wall.
      </p>
    </div>
  </div>
</template>

<style>
  .md1-docs-leading {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--md1-spacing-3, 24px);
  }

  /* 40 to 60 characters per line: the typography page's ideal measure for body text. */
  .md1-docs-leading-block {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    max-width: 60ch;
  }

  .md1-docs-leading-tag,
  .md1-docs-leading-text {
    margin: 0;
  }
</style>
