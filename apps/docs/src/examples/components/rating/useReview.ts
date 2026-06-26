import { ref, shallowRef } from 'vue'

export interface Review {
  stars: number
  comment: string
}

export function useReview () {
  const stars = shallowRef(0)
  const comment = ref('')
  const submitted = shallowRef<Review>()

  function onSubmit (valid: boolean) {
    if (!valid) return

    submitted.value = {
      stars: stars.value,
      comment: comment.value,
    }
  }

  function reset () {
    stars.value = 0
    comment.value = ''
    submitted.value = undefined
  }

  return { stars, comment, submitted, onSubmit, reset }
}
