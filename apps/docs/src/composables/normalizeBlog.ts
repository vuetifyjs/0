// Framework
import { isArray, isObject, isString, isUndefined } from '@vuetify/v0'

const SLUG = /^\/blog\/[a-z0-9]+(?:[.-][a-z0-9]+)*$/
const HTTPS = /^https:\/\//

export interface BlogPost {
  title: string
  excerpt: string
  date: string
  author: string
  avatar: string
  image: string | null
  slug: string
  url: string
}

function filled (value: unknown): value is string {
  return isString(value) && value.length > 0
}

function normalizeRow (row: unknown): BlogPost | undefined {
  if (!isObject(row)) return undefined

  const title = row.title
  const excerpt = row.shortDescription
  const date = row.date
  const author = row.author
  const avatar = row.avatar
  const to = row.to

  if (!filled(title) || !filled(excerpt) || !filled(date) || !filled(author) || !filled(avatar) || !filled(to)) {
    return undefined
  }

  if (!HTTPS.test(avatar) || !SLUG.test(to)) return undefined

  let image: string | null = null
  if (!isUndefined(row.image)) {
    if (!isString(row.image) || !HTTPS.test(row.image)) return undefined
    image = row.image
  }

  return {
    title,
    excerpt,
    date,
    author,
    avatar,
    image,
    slug: to.slice('/blog/'.length),
    url: `https://vuetifyjs.com${to}/`,
  }
}

export function normalizeBlog (data: unknown): BlogPost[] {
  if (!isArray(data)) return []

  const posts: BlogPost[] = []
  for (const row of data) {
    const post = normalizeRow(row)
    if (!isUndefined(post)) posts.push(post)
  }
  return posts
}
