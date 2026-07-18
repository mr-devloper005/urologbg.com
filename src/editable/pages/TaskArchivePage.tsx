import Link from 'next/link'
import { ArrowUpRight, ChevronDown, Download, FileText, Globe, MapPin, Phone, Search, ShieldCheck, Star } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { taskThemeStyle } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

const DISPLAY_LABEL: Record<TaskKey, string> = {
  listing: 'Local Directory',
  pdf: 'Reference Library',
  article: 'Editorial',
  classified: 'Notices',
  image: 'Gallery',
  sbm: 'Bookmarks',
  profile: 'People',
}
const SINGULAR_LABEL: Record<TaskKey, string> = {
  listing: 'directory entry',
  pdf: 'reference document',
  article: 'article',
  classified: 'notice',
  image: 'image',
  sbm: 'bookmark',
  profile: 'profile',
}

const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const isUrl = (v: string) => v.startsWith('/') || /^https?:\/\//i.test(v)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map(item => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}
const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (v: string) =>
  v.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
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
const getSummary = (p: SitePost) =>
  stripHtml(p.summary || asText(getContent(p).description) || asText(getContent(p).excerpt) || asText(getContent(p).body))
const getField = (p: SitePost, keys: string[]) => {
  const c = getContent(p)
  for (const k of keys) {
    const v = asText(c[k])
    if (v) return v
  }
  return ''
}
const cleanDomain = (v: string) => v.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const q = params.toString()
  return q ? `${basePath}?${q}` : basePath
}

const cardBase =
  'group relative flex flex-col overflow-hidden rounded-[20px] border border-[var(--editable-border)] bg-white transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_-40px_rgba(12,4,7,0.35)]'

/* -------------------------- Route + View exports -------------------------- */

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const voice = taskPageVoices[task]
  const displaySingular = SINGULAR_LABEL[task]
  const page = pagination.page || 1
  const categoryLabel =
    category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find(item => item.slug === category)?.name || category

  return (
    <EditableSiteShell>
      <main
        style={taskThemeStyle(task)}
        className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]"
      >
        {/* Header */}
        <section className={`${dc.shell.section} pt-14 pb-6 sm:pt-20`}>
          <EditableReveal index={0}>
            <span className={dc.badge.pill}>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-soft)]" />
              {voice.eyebrow}
            </span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`${dc.type.sectionTitle} mt-6 max-w-[900px]`}>
              {voice.headline.split('.')[0]}
              <span className="editable-display italic text-[var(--slot4-muted-text)]">
                {voice.headline.includes('.') ? '.' : ''}
              </span>
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className={`${dc.type.body} mt-6 max-w-[640px]`}>{voice.description}</p>
          </EditableReveal>
          <EditableReveal index={3} className="mt-8 flex flex-wrap items-center gap-2">
            {voice.chips.map(chip => (
              <span key={chip} className={dc.badge.pill}>{chip}</span>
            ))}
          </EditableReveal>

          {/* Filter row */}
          <EditableReveal index={4} className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <form action={basePath} method="GET" className="relative">
              <label htmlFor="category" className="sr-only">{voice.filterLabel}</label>
              <div className="relative">
                <select
                  name="category"
                  id="category"
                  defaultValue={category}
                  className="appearance-none rounded-full border border-[var(--editable-border)] bg-white py-3 pl-5 pr-11 text-[14px] font-medium text-[var(--slot4-page-text)] focus:outline-none focus:ring-2 focus:ring-[var(--slot4-page-text)]"
                >
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt.slug} value={opt.slug}>{opt.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" />
              </div>
              <noscript>
                <button type="submit" className="ml-2 rounded-full bg-[var(--slot4-page-text)] px-4 py-2 text-[13px] text-white">Filter</button>
              </noscript>
            </form>
            <p className="text-[13px] text-[var(--slot4-muted-text)]">
              Showing <span className="font-medium text-[var(--slot4-page-text)]">{posts.length}</span> · {categoryLabel} · Page {page} of {pagination.totalPages || 1}
            </p>
          </EditableReveal>
        </section>

        {/* Header slot ad — only Reference Library archive */}
        {task === 'pdf' && (
          <div className={`${dc.shell.section} pb-4`}>
            <Ads slot="header" size={pickRandom(getSlotSizes('header'))} showLabel className="mx-auto w-full" />
          </div>
        )}

        {/* Grid */}
        <section className={`${dc.shell.section} pb-20`}>
          {posts.length === 0 ? (
            <EmptyBlock label={displaySingular} />
          ) : (
            <div className={gridFor(task)}>
              {posts.map((post, i) => (
                <EditableReveal key={post.slug || post.id || i} index={i % 6}>
                  <ArchivePostCard task={task} post={post} basePath={basePath} index={i} />
                </EditableReveal>
              ))}

              {/* In-feed ad — only Local Directory archive */}
              {task === 'listing' && posts.length > 3 && (
                <div className="col-span-full my-4">
                  <Ads slot="rail" size={pickRandom(getSlotSizes('rail'))} showLabel className="mx-auto w-full" />
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-3">
              {pagination.hasPrevPage && (
                <Link
                  href={pageHref(basePath, category, page - 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-5 py-2.5 text-[13px] font-medium hover:bg-[var(--slot4-page-text)] hover:text-white"
                >
                  Previous
                </Link>
              )}
              <span className="rounded-full bg-[var(--slot4-page-text)] px-5 py-2.5 text-[13px] font-medium text-white">
                {page} / {pagination.totalPages}
              </span>
              {pagination.hasNextPage && (
                <Link
                  href={pageHref(basePath, category, page + 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-5 py-2.5 text-[13px] font-medium hover:bg-[var(--slot4-page-text)] hover:text-white"
                >
                  Next <ArrowUpRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}

/* -------------------------- Internal helpers -------------------------- */

function EmptyBlock({ label }: { label: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[var(--editable-border)] bg-white px-8 py-20 text-center">
      <Search className="mx-auto h-8 w-8 text-[var(--slot4-muted-text)]" />
      <p className="editable-display mt-6 text-[22px] font-medium tracking-[-0.02em]">
        No {label} in this view yet.
      </p>
      <p className="mt-3 text-[15px] text-[var(--slot4-muted-text)]">
        Try a different category or clear the filter.
      </p>
    </div>
  )
}

function gridFor(task: TaskKey) {
  if (task === 'listing') return 'grid gap-6 md:grid-cols-2 xl:grid-cols-2'
  if (task === 'pdf') return 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3'
  if (task === 'image') return 'columns-1 gap-6 [column-fill:_balance] sm:columns-2 xl:columns-3'
  if (task === 'article') return 'grid gap-8 md:grid-cols-2 xl:grid-cols-3'
  if (task === 'profile') return 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  return 'grid gap-6 md:grid-cols-2 xl:grid-cols-3'
}

function ArchivePostCard({
  task,
  post,
  basePath,
  index,
}: {
  task: TaskKey
  post: SitePost
  basePath: string
  index: number
}) {
  const href = `${basePath}/${post.slug}`
  const image = getImage(post)
  const category = getCategory(post, DISPLAY_LABEL[task])
  const summary = getSummary(post)

  if (task === 'listing') return <ListingArchiveCard post={post} href={href} image={image} category={category} summary={summary} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} category={category} summary={summary} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} image={image} />
  if (task === 'article') return <ArticleArchiveCard post={post} href={href} image={image} category={category} summary={summary} index={index} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} image={image} category={category} summary={summary} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} image={image} category={category} summary={summary} />
  return <ProfileArchiveCard post={post} href={href} image={image} category={category} />
}

/* --- Per-task card variants (visually unified, slight differences) --- */

function ArticleArchiveCard({ post, href, image, category, summary, index }: { post: SitePost; href: string; image: string; category: string; summary: string; index: number }) {
  return (
    <Link href={href} className={cardBase}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <span className={`${dc.badge.accentPill} absolute left-4 top-4`}>{category}</span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <span className="editable-eyebrow">No. {String(index + 1).padStart(2, '0')}</span>
        <h3 className="editable-display line-clamp-3 text-[22px] font-medium leading-[1.2] tracking-[-0.02em]">{post.title}</h3>
        {summary && <p className="line-clamp-3 text-[14px] leading-[1.6] text-[var(--slot4-muted-text)]">{summary}</p>}
        <span className="mt-auto inline-flex items-center gap-2 text-[13px] font-medium">Read more <ArrowUpRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href, image, category, summary }: { post: SitePost; href: string; image: string; category: string; summary: string }) {
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'contact', 'contactNumber'])
  const website = getField(post, ['website', 'url', 'link'])
  const hours = getField(post, ['hours', 'timing', 'openingHours'])
  return (
    <Link href={href} className={`${cardBase} sm:grid sm:grid-cols-[220px_1fr]`}>
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-auto sm:h-full">
        <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <span className={`${dc.badge.pill} absolute left-4 top-4 bg-white/95`}>
          <ShieldCheck className="h-3 w-3" /> Verified
        </span>
      </div>
      <div className="flex flex-col gap-3 p-6">
        <span className="editable-eyebrow">{category}</span>
        <h3 className="editable-display line-clamp-2 text-[22px] font-medium leading-[1.2] tracking-[-0.02em]">{post.title}</h3>
        {summary && <p className="line-clamp-2 text-[14px] leading-[1.55] text-[var(--slot4-muted-text)]">{summary}</p>}
        <div className="mt-2 grid gap-1.5 text-[13px] text-[var(--slot4-muted-text)]">
          {address && <span className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {address}</span>}
          {phone && <span className="inline-flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> {phone}</span>}
          {website && <span className="inline-flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> {cleanDomain(website)}</span>}
          {hours && <span className="inline-flex items-center gap-2"><Star className="h-3.5 w-3.5" /> {hours}</span>}
        </div>
        <span className="mt-auto inline-flex items-center gap-2 text-[13px] font-medium">Open entry <ArrowUpRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href, category, summary }: { post: SitePost; href: string; category: string; summary: string }) {
  const pages = getField(post, ['pages', 'pageCount'])
  const size = getField(post, ['fileSize', 'size'])
  return (
    <Link href={href} className={`${cardBase} p-6`}>
      <div className="flex items-start justify-between gap-4">
        <span className={`${dc.badge.pill} bg-white`}>
          <FileText className="h-3 w-3" /> {category}
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] transition duration-500 group-hover:-rotate-45 group-hover:bg-[var(--slot4-page-text)] group-hover:text-white">
          <Download className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-6 flex aspect-[4/5] items-center justify-center rounded-[16px] bg-[var(--slot4-media-bg)]">
        <span className="editable-display text-[64px] font-semibold tracking-[-0.05em] text-[var(--slot4-muted-text)]">
          PDF
        </span>
      </div>
      <h3 className="editable-display mt-6 line-clamp-3 text-[20px] font-medium leading-[1.25] tracking-[-0.02em]">{post.title}</h3>
      {summary && <p className="mt-3 line-clamp-2 text-[14px] leading-[1.55] text-[var(--slot4-muted-text)]">{summary}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        {pages && <span className={dc.badge.pill}>{pages} pages</span>}
        {size && <span className={dc.badge.pill}>{size}</span>}
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href, image, category, summary }: { post: SitePost; href: string; image: string; category: string; summary: string }) {
  return (
    <Link href={href} className={cardBase}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <span className={`${dc.badge.accentPill} absolute left-4 top-4`}>{category}</span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="editable-display line-clamp-2 text-[20px] font-medium leading-[1.2] tracking-[-0.02em]">{post.title}</h3>
        {summary && <p className="line-clamp-3 text-[14px] leading-[1.55] text-[var(--slot4-muted-text)]">{summary}</p>}
        <span className="mt-auto inline-flex items-center gap-2 text-[13px] font-medium">Open notice <ArrowUpRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, image }: { post: SitePost; href: string; image: string }) {
  return (
    <Link href={href} className={`group mb-6 block break-inside-avoid overflow-hidden rounded-[20px] border border-[var(--editable-border)] bg-white transition duration-500 hover:-translate-y-1`}>
      <div className="relative overflow-hidden">
        <img src={image} alt={post.title} className="w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="p-4">
        <h3 className="editable-display line-clamp-2 text-[16px] font-medium tracking-[-0.02em]">{post.title}</h3>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, image, category, summary }: { post: SitePost; href: string; image: string; category: string; summary: string }) {
  const website = getField(post, ['url', 'link', 'website'])
  return (
    <Link href={href} className={`${cardBase} p-6`}>
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--slot4-media-bg)]">
          <img src={image} alt="" className="h-8 w-8 rounded-full object-cover" />
        </span>
        <div className="min-w-0">
          <span className="editable-eyebrow">{category}</span>
          {website && <p className="truncate text-[13px] text-[var(--slot4-muted-text)]">{cleanDomain(website)}</p>}
        </div>
      </div>
      <h3 className="editable-display mt-5 line-clamp-2 text-[20px] font-medium tracking-[-0.02em]">{post.title}</h3>
      {summary && <p className="mt-3 line-clamp-3 text-[14px] leading-[1.55] text-[var(--slot4-muted-text)]">{summary}</p>}
      <span className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium">Open bookmark <ArrowUpRight className="h-4 w-4" /></span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href, image, category }: { post: SitePost; href: string; image: string; category: string }) {
  return (
    <Link href={href} className={`${cardBase} p-6 text-center`}>
      <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-[var(--slot4-media-bg)]">
        <img src={image} alt={post.title} className="h-full w-full object-cover" />
      </div>
      <h3 className="editable-display mt-5 line-clamp-2 text-[18px] font-medium tracking-[-0.02em]">{post.title}</h3>
      <span className={`${dc.badge.pill} mx-auto mt-3`}>{category}</span>
    </Link>
  )
}
