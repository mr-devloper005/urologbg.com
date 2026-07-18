import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/* ---------- Cards — Wordcraft editorial reference ---------- */

const ArrowCircle = ({ size = 'md' as 'sm' | 'md' }) => (
  <span
    className={[
      'flex items-center justify-center rounded-full border border-[var(--editable-border)] bg-white text-[var(--slot4-page-text)] transition duration-500 group-hover:-rotate-45 group-hover:bg-[var(--slot4-page-text)] group-hover:text-white',
      size === 'sm' ? 'h-8 w-8' : 'h-10 w-10',
    ].join(' ')}
  >
    <ArrowUpRight className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
  </span>
)

export function EditorialFeatureCard({
  post,
  href,
  label = 'Featured',
}: { post: SitePost; href: string; label?: string }) {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden ${dc.surface.card} transition duration-500 hover:shadow-[0_30px_80px_-40px_rgba(12,4,7,0.35)]`}
    >
      <div className={`${dc.media.frame} aspect-[16/11]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <span className={`${dc.badge.accentPill} absolute left-5 top-5`}>
          {label}
        </span>
      </div>
      <div className="flex flex-col gap-5 p-7">
        <p className={dc.type.eyebrow}>{getEditableCategory(post)}</p>
        <h3 className="editable-display text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] text-[var(--slot4-page-text)] sm:text-[34px]">
          {post.title}
        </h3>
        <p className="text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">
          {getEditableExcerpt(post, 180)}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[13px] font-medium text-[var(--slot4-page-text)]">Read more</span>
          <ArrowCircle />
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({
  post,
  href,
  index,
}: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} transition duration-500 hover:-translate-y-1`}
    >
      <div className={`${dc.media.frame} aspect-[4/3]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <span className={`${dc.badge.pill} absolute left-4 top-4 bg-white/95`}>
          {getEditableCategory(post)}
        </span>
      </div>
      <div className="flex flex-col gap-4 p-5">
        <span className="editable-eyebrow">
          No. {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="editable-display line-clamp-3 text-[20px] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[13px] font-medium text-[var(--slot4-muted-text)]">Read more</span>
          <ArrowCircle size="sm" />
        </div>
      </div>
    </Link>
  )
}

export function CompactIndexCard({
  post,
  href,
  index,
}: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group flex min-w-0 items-start gap-5 rounded-[20px] border border-transparent p-4 transition duration-500 hover:border-[var(--editable-border)] hover:bg-white`}
    >
      <span className="editable-display flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-page-text)] text-[16px] font-semibold text-white">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0 flex-1">
        <p className="editable-eyebrow">{getEditableCategory(post)}</p>
        <h3 className="editable-display mt-2 line-clamp-2 text-[19px] font-medium leading-[1.25] tracking-[-0.02em] text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[14px] leading-[1.55] text-[var(--slot4-muted-text)]">
          {getEditableExcerpt(post, 110)}
        </p>
      </div>
      <ArrowCircle size="sm" />
    </Link>
  )
}

export function ArticleListCard({
  post,
  href,
  index,
}: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group grid gap-6 overflow-hidden ${dc.surface.card} p-4 transition duration-500 hover:-translate-y-1 sm:grid-cols-[260px_minmax(0,1fr)]`}
    >
      <div className={`${dc.media.frame} aspect-[4/3] sm:aspect-auto sm:min-h-[220px]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <span className={`${dc.badge.accentPill} absolute left-4 top-4`}>
          {getEditableCategory(post)}
        </span>
      </div>
      <div className="flex min-w-0 flex-col justify-between gap-4 p-2 sm:py-4 sm:pr-4">
        <div>
          <span className="editable-eyebrow">
            Read no. {String(index + 1).padStart(2, '0')}
          </span>
          <h2 className="editable-display mt-3 line-clamp-3 text-[26px] font-medium leading-[1.15] tracking-[-0.03em] text-[var(--slot4-page-text)] sm:text-[28px]">
            {post.title}
          </h2>
          <p className="mt-3 line-clamp-3 text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">
            {getEditableExcerpt(post, 200)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-[var(--slot4-page-text)]">Read more</span>
          <ArrowCircle />
        </div>
      </div>
    </Link>
  )
}
