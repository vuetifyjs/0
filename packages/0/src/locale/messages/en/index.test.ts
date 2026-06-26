import { describe, expect, it } from 'vitest'

import en from './index'

describe('locale/messages/en', () => {
  it('should export an English aria-string catalog for every v0 component namespace', () => {
    expect(en).toBeTypeOf('object')

    for (const key of ['AlertDialog', 'Avatar', 'Breadcrumbs', 'Button', 'Carousel', 'Dialog', 'NumberField', 'Pagination', 'Rating', 'Snackbar']) {
      expect(en).toHaveProperty(key)
    }
  })

  it('should expose interpolation placeholders on parameterized keys', () => {
    expect(en.Avatar.indicatorLabel).toContain('{count}')
    expect(en.Pagination.status).toContain('{page}')
    expect(en.Pagination.status).toContain('{pages}')
    expect(en.Rating.valueText).toContain('{value}')
    expect(en.Carousel.slide).toContain('{current}')
  })

  it('should provide plain string labels for static keys', () => {
    expect(en.Dialog.close).toBeTypeOf('string')
    expect(en.Pagination.next).toBeTypeOf('string')
    expect(en.Snackbar.close).toBeTypeOf('string')
  })
})
