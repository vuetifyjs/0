<script setup lang="ts">
  import { Md1Button, Md1Toolbar } from '@paper/md1'

  const ingredients = [
    '500 g strong white flour',
    '1 tsp salt',
    '7 g fast-action dried yeast',
    '1 tbsp caster sugar',
    '300 ml whole milk',
    '50 g unsalted butter, softened',
    '1 egg, beaten, plus one more to glaze',
    'Sesame seeds, to finish',
  ]

  const steps = [
    'Warm the milk to blood heat and stir in the yeast and a spoon of sugar. Leave it ten minutes, until it foams.',
    'Rub the butter into the flour and salt with your fingertips until no lumps remain.',
    'Pour in the yeast mixture and the beaten egg, then bring everything together into a soft, slightly sticky dough.',
    'Knead for ten minutes on a lightly floured board, until the dough is smooth and springs back when pressed.',
    'Cover the bowl and leave the dough somewhere warm for an hour, until it has doubled in size.',
    'Knock it back, divide it into twelve pieces and roll each into a tight ball.',
    'Set the rolls on a lined tray, a finger apart, and leave them to rise for another thirty minutes.',
    'Brush the tops with beaten egg and scatter over sesame seeds.',
    'Bake at 200 °C for fifteen to eighteen minutes, until the rolls are golden and sound hollow when tapped.',
    'Cool them on a rack for ten minutes before serving.',
    'Keep any left over in a tin; they are best warmed through the next day.',
    'For a softer crust, cover the rolls with a clean tea towel as they cool.',
  ]
</script>

<template>
  <div class="md1-docs-screen md1-docs-toolbar-screen">
    <Md1Toolbar app-bar scroll="collapse-hide">
      <Md1Toolbar.Nav icon="up" />

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Share" icon="share" />
      </Md1Toolbar.Actions>

      <Md1Toolbar.Extension>
        <Md1Toolbar.Title>Bread rolls</Md1Toolbar.Title>
      </Md1Toolbar.Extension>
    </Md1Toolbar>

    <div class="md1-docs-toolbar-scroll-off-content">
      <p v-for="ingredient in ingredients" :key="ingredient" class="md1-docs-toolbar-text">{{ ingredient }}</p>

      <p v-for="(step, index) in steps" :key="index" class="md1-docs-toolbar-text">{{ index + 1 }}. {{ step }}</p>
    </div>
  </div>
</template>

<style>
  .md1-docs-toolbar-screen {
    background: var(--md1-background, #FAFAFA);
  }

  /* Padded below the extended bar: a toolbar and one increment of flexible space. */
  .md1-docs-toolbar-scroll-off-content {
    box-sizing: border-box;
    height: 100%;
    padding: calc(var(--md1-increment, 56px) * 2 + var(--md1-spacing-2, 16px)) var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
    overflow-y: auto;
  }

  .md1-docs-toolbar-text {
    margin: 0 0 var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
