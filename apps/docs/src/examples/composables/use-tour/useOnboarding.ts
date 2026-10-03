import { createTour, createValidation } from '@vuetify/v0'
import { shallowRef, toRef } from 'vue'

import type { TourTicketInput } from '@vuetify/v0'

interface Copy {
  title: string
  body: string
}

const copy: Record<string, Copy> = {
  welcome: {
    title: 'Welcome',
    body: 'This step has no enter handler, so Next is ready immediately. No target is activated.',
  },
  search: {
    title: 'Search',
    body: 'enter finds the search field and calls activate. The ring marks that field.',
  },
  settings: {
    title: 'Settings',
    body: 'Press Settings. Next and Prev stay off until done() runs. Open this step with Prev and it is ready immediately.',
  },
  name: {
    title: 'Name',
    body: 'Next submits the form field registered under this step. It stays here while the name is empty. Prev does not validate.',
  },
  avatar: {
    title: 'Account',
    body: 'activate again. The ring moves to the avatar.',
  },
  finish: {
    title: 'Finish',
    body: 'This step activates nothing. Complete runs the completed handler. Stop does not.',
  },
}

function target (id: string) {
  return document.querySelector(`[data-tour-root="sequencer"] [data-tour="${id}"]`)
}

export function useOnboarding () {
  const tour = createTour()
  const name = shallowRef('')
  const note = shallowRef('')
  const validation = createValidation({
    value: name,
    rules: [
      value => String(value ?? '').trim().length > 0 || 'Enter a name.',
    ],
  })
  let release: (() => void) | undefined

  tour.form.register({ id: 'name', value: validation })

  const steps: TourTicketInput[] = [
    {
      id: 'welcome',
    },
    {
      id: 'search',
      enter ({ done, activate }) {
        const el = target('search')
        if (el) activate(el, { scroll: false })
        done()
      },
    },
    {
      id: 'settings',
      enter ({ done, activate, direction }) {
        const el = target('settings')
        if (el) activate(el, { scroll: false })
        if (direction === 'back') {
          release = undefined
          done()
          return
        }
        release = done
      },
      leave () {
        release = undefined
      },
    },
    {
      id: 'name',
      enter ({ done, activate }) {
        const el = target('name')
        if (el) activate(el, { scroll: false })
        done()
      },
      leave () {
        validation.reset()
      },
    },
    {
      id: 'avatar',
      enter ({ done, activate }) {
        const el = target('avatar')
        if (el) activate(el, { scroll: false })
        done()
      },
    },
    {
      id: 'finish',
      completed () {
        note.value = 'The completed handler ran.'
      },
    },
  ]

  tour.steps.onboard(steps)

  const current = toRef(() => {
    const id = tour.selectedId.value
    return id ? copy[id] : undefined
  })
  const index = toRef(() => (tour.steps.selectedIndex.value ?? 0) + 1)

  function confirm () {
    release?.()
    release = undefined
  }

  function restart () {
    name.value = ''
    note.value = ''
    validation.reset()
    tour.start()
  }

  return {
    tour,
    current,
    index,
    name,
    errors: validation.errors,
    note,
    confirm,
    restart,
  }
}
