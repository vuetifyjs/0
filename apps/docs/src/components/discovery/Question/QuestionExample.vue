/**
 * Example usage of the Question component.
 * This is for demonstration/testing purposes.
 */

<script setup lang="ts">
  // Utilities
  import { ref } from 'vue'

  import { Question } from '.'

  const singleAnswer = ref<string>()
  const multiAnswer = ref<string[]>()
</script>

<template>
  <div class="question-examples">
    <h3>Single Choice Example</h3>
    <Question.Root
      v-slot="{ submit, isSubmitted, hasSelection }"
      v-model="singleAnswer"
      correct-answer="b"
    >
      <Question.Stem>
        What composable provides single selection?
      </Question.Stem>

      <div class="options">
        <Question.Option v-slot="{ attrs, isSelected }" value="a">
          <span v-bind="attrs" :class="{ selected: isSelected }">
            <Question.Indicator>✓ </Question.Indicator>
            createMultiple
          </span>
        </Question.Option>

        <Question.Option v-slot="{ attrs, isSelected }" value="b">
          <span v-bind="attrs" :class="{ selected: isSelected }">
            <Question.Indicator>✓ </Question.Indicator>
            createSingle
          </span>
        </Question.Option>

        <Question.Option v-slot="{ attrs, isSelected }" value="c">
          <span v-bind="attrs" :class="{ selected: isSelected }">
            <Question.Indicator>✓ </Question.Indicator>
            createGroup
          </span>
        </Question.Option>
      </div>

      <button :disabled="!hasSelection || isSubmitted" @click="submit">
        Submit
      </button>

      <Question.Feedback>
        <template #correct>
          <div class="feedback correct">✅ That's right!</div>
        </template>
        <template #incorrect>
          <div class="feedback incorrect">❌ Not quite. createSingle is correct.</div>
        </template>
      </Question.Feedback>
    </Question.Root>

    <hr>

    <h3>Multiple Choice Example</h3>
    <Question.Root
      v-slot="{ submit, isSubmitted, hasSelection }"
      v-model="multiAnswer"
      :correct-answer="['a', 'c']"
      mode="multiple"
    >
      <Question.Stem>
        Which are valid v0 composables? (Select all that apply)
      </Question.Stem>

      <div class="options">
        <Question.Option v-slot="{ attrs, isSelected }" value="a">
          <span v-bind="attrs" :class="{ selected: isSelected }">
            <Question.Indicator>☑ </Question.Indicator>
            <template v-if="!isSelected">☐ </template>
            useHotkey
          </span>
        </Question.Option>

        <Question.Option v-slot="{ attrs, isSelected }" value="b">
          <span v-bind="attrs" :class="{ selected: isSelected }">
            <Question.Indicator>☑ </Question.Indicator>
            <template v-if="!isSelected">☐ </template>
            useVuetify
          </span>
        </Question.Option>

        <Question.Option v-slot="{ attrs, isSelected }" value="c">
          <span v-bind="attrs" :class="{ selected: isSelected }">
            <Question.Indicator>☑ </Question.Indicator>
            <template v-if="!isSelected">☐ </template>
            useEventListener
          </span>
        </Question.Option>
      </div>

      <button :disabled="!hasSelection || isSubmitted" @click="submit">
        Submit
      </button>

      <Question.Feedback>
        <template #correct>
          <div class="feedback correct">✅ All correct!</div>
        </template>
        <template #partial>
          <div class="feedback partial">🟡 Partially correct. useHotkey and useEventListener are both valid.</div>
        </template>
        <template #incorrect>
          <div class="feedback incorrect">❌ None of those are correct.</div>
        </template>
      </Question.Feedback>
    </Question.Root>
  </div>
</template>

<style scoped>
.question-examples {
  padding: 1rem;
  font-family: system-ui, sans-serif;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
}

.options span {
  display: block;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.options span:hover {
  border-color: #666;
}

.options span.selected {
  border-color: #2563eb;
  background: #eff6ff;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.feedback {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}

.feedback.correct {
  background: #dcfce7;
  color: #166534;
}

.feedback.incorrect {
  background: #fee2e2;
  color: #991b1b;
}

.feedback.partial {
  background: #fef9c3;
  color: #854d0e;
}

hr {
  margin: 2rem 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}
</style>
