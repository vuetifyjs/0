---
title: Skillz - Interactive v0 Tutorials
meta:
  - name: description
    content: Master Vuetify0 through interactive tutorials. Learn by doing with hands-on coding challenges.
  - name: keywords
    content: vuetify0, tutorial, interactive, learning, skills, v0
features:
  devmode: true
  emphasized: true
  level: 1
  hideNavigator: true
  hideFeedback: true
---

<script setup>
  import { useSkillzStore } from '@/stores/skillz'
  import SkillCardDeck from '@/components/skillz/SkillCardDeck.vue'

  const skillz = useSkillzStore()
</script>

# Vuetify0 Skillz

Master v0 through interactive coding challenges. Each skill teaches a focused concept with hands-on practice.

<SkillCardDeck :items="skillz.items" />
