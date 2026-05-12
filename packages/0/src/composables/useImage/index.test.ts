import { describe, expect, it } from 'vitest'

import { useImage } from './index'

// Utilities
import { effectScope, nextTick, shallowRef } from 'vue'

describe('useImage', () => {
  describe('initial state', () => {
    it('should start in loading when eager defaults to true', () => {
      const image = useImage({ src: '/photo.jpg' })

      expect(image.status.value).toBe('loading')
      expect(image.isLoading.value).toBe(true)
      expect(image.source.value).toBe('/photo.jpg')
    })

    it('should start in idle when eager is false', () => {
      const image = useImage({ src: '/photo.jpg', eager: false })

      expect(image.status.value).toBe('idle')
      expect(image.isIdle.value).toBe(true)
      expect(image.source.value).toBeUndefined()
    })

    it('should withhold source while idle', () => {
      const image = useImage({ src: '/photo.jpg', eager: false })

      expect(image.source.value).toBeUndefined()
    })

    it('should expose source when not idle', () => {
      const image = useImage({ src: '/photo.jpg' })

      expect(image.source.value).toBe('/photo.jpg')
    })
  })

  describe('load handling', () => {
    it('should transition to loaded on onLoad', () => {
      const image = useImage({ src: '/photo.jpg' })

      image.onLoad()

      expect(image.status.value).toBe('loaded')
      expect(image.isLoaded.value).toBe(true)
      expect(image.isLoading.value).toBe(false)
    })

    it('should expose source after loaded', () => {
      const image = useImage({ src: '/photo.jpg' })

      image.onLoad()

      expect(image.source.value).toBe('/photo.jpg')
    })
  })

  describe('error handling', () => {
    it('should transition to error on onError', () => {
      const image = useImage({ src: '/photo.jpg' })

      image.onError()

      expect(image.status.value).toBe('error')
      expect(image.isError.value).toBe(true)
      expect(image.isLoading.value).toBe(false)
    })

    it('should reset to loading on retry when eager is true', async () => {
      const image = useImage({ src: '/photo.jpg' })

      image.onError()
      image.retry()

      // Cycles through 'idle' for one tick to force the browser to refetch
      expect(image.status.value).toBe('idle')
      await nextTick()

      expect(image.status.value).toBe('loading')
      expect(image.isError.value).toBe(false)
    })

    it('should briefly clear source during retry so the browser refetches the same URL', async () => {
      const image = useImage({ src: '/photo.jpg' })

      image.onError()
      expect(image.source.value).toBe('/photo.jpg')

      image.retry()
      expect(image.source.value).toBeUndefined()

      await nextTick()
      expect(image.source.value).toBe('/photo.jpg')
    })

    it('should reset to idle on retry when eager is false', async () => {
      const image = useImage({ src: '/photo.jpg', eager: false })

      image.onError()
      image.retry()

      expect(image.status.value).toBe('idle')
      await nextTick()

      expect(image.status.value).toBe('idle')
    })
  })

  describe('eager reactivity', () => {
    it('should transition from idle to loading when eager becomes true', async () => {
      const eager = shallowRef(false)
      const image = useImage({ src: '/photo.jpg', eager })

      expect(image.status.value).toBe('idle')

      eager.value = true
      await nextTick()

      expect(image.status.value).toBe('loading')
      expect(image.source.value).toBe('/photo.jpg')
    })

    it('should not unload a loaded image when eager flips false', async () => {
      const eager = shallowRef(true)
      const image = useImage({ src: '/photo.jpg', eager })

      image.onLoad()
      eager.value = false
      await nextTick()

      expect(image.status.value).toBe('loaded')
    })

    it('should not regress an error state when eager flips false', async () => {
      const eager = shallowRef(true)
      const image = useImage({ src: '/photo.jpg', eager })

      image.onError()
      eager.value = false
      await nextTick()

      expect(image.status.value).toBe('error')
    })

    it('should regress loading to idle when eager flips false', async () => {
      const eager = shallowRef(true)
      const image = useImage({ src: '/photo.jpg', eager })

      eager.value = false
      await nextTick()

      expect(image.status.value).toBe('idle')
    })
  })

  describe('src reactivity', () => {
    it('should reset to loading when src changes after loaded', async () => {
      const src = shallowRef<string | undefined>('/a.jpg')
      const image = useImage({ src })

      image.onLoad()
      expect(image.status.value).toBe('loaded')

      src.value = '/b.jpg'
      await nextTick()

      expect(image.status.value).toBe('loading')
      expect(image.source.value).toBe('/b.jpg')
    })

    it('should reset to loading when src changes after error', async () => {
      const src = shallowRef<string | undefined>('/a.jpg')
      const image = useImage({ src })

      image.onError()
      src.value = '/b.jpg'
      await nextTick()

      expect(image.status.value).toBe('loading')
    })

    it('should reset to idle when src changes and eager is false', async () => {
      const src = shallowRef<string | undefined>('/a.jpg')
      const image = useImage({ src, eager: false })

      src.value = '/b.jpg'
      await nextTick()

      expect(image.status.value).toBe('idle')
    })
  })

  describe('source gating', () => {
    it('should reflect undefined src', () => {
      const image = useImage({ src: undefined, eager: true })

      expect(image.source.value).toBeUndefined()
    })

    it('should toggle source as eager toggles', async () => {
      const eager = shallowRef(false)
      const image = useImage({ src: '/photo.jpg', eager })

      expect(image.source.value).toBeUndefined()

      eager.value = true
      await nextTick()

      expect(image.source.value).toBe('/photo.jpg')
    })
  })

  describe('cleanup', () => {
    it('should stop reacting to src after scope dispose', async () => {
      const src = shallowRef<string | undefined>('/a.jpg')
      const scope = effectScope()

      let image: ReturnType<typeof useImage>
      scope.run(() => {
        image = useImage({ src })
      })

      image!.onLoad()
      scope.stop()

      src.value = '/b.jpg'
      await nextTick()

      // status was 'loaded' before disposal; should not change after
      expect(image!.status.value).toBe('loaded')
    })
  })
})
