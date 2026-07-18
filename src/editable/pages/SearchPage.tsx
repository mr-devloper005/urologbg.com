import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

const DISPLAY_LABEL: Record<string, string> = {
  listing: 'Local Directory',
  pdf: 'Reference Library',
  article: 'Editorial',
  classified: 'Notices',
  image: 'Gallery',
  sbm: 'Bookmarks',
  profile: 'People',
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (v: string) => v.replace(/<[^>]*>/g, ' ')
const compactText = (v: unknown) => (typeof v === 'string' ? stripHtml(v).replace(/\s+/g, ' ').trim().toLowerCase() : '')
const getContent = (p: SitePost) => (p.content && typeof p.content === 'object' ? (p.content as Record<string, unknown>) : {})
const compactRaw = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const getImage = (p: SitePost) => {
  const content = getContent(p)
  const media = Array.isArray(p.media) ? p.media.find(item => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images)
    ? (content.images.find(item => typeof item === 'string') as string | undefined)
    : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (p: SitePost) => {
  const content = getContent(p)
  return toPlainText(
    (typeof p.summary === 'string' && p.summary) ||
      compactRaw(content.description) ||
      compactRaw(content.excerpt) ||
      compactRaw(content.body) ||
      ''
  )
}
const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some(value => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find(item => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const displayLabel = task ? DISPLAY_LABEL[task] || DISPLAY_LABEL.article : 'Post'
  const strong = index % 5 === 0

  return (
    <Link
      href={href}
      className={`group flex flex-col overflow-hidden rounded-[20px] border border-[var(--editable-border)] bg-white transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_80px_-40px_rgba(12,4,7,0.35)] ${strong ? 'md:col-span-2' : ''}`}
    >
      {image ? (
        <div className={`relative overflow-hidden ${strong ? 'aspect-[16/8]' : 'aspect-[4/3]'}`}>
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
          <span className={`${dc.badge.pill} absolute left-4 top-4 bg-white/95`}>{displayLabel}</span>
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center bg-[var(--slot4-page-bg)]">
          <span className="editable-display text-[48px] font-semibold tracking-[-0.05em] text-[var(--slot4-muted-text)]">
            {displayLabel.split(' ').map(w => w[0]).join('')}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <span className="editable-eyebrow">{displayLabel}</span>
        <h3 className="editable-display line-clamp-3 text-[22px] font-medium leading-[1.2] tracking-[-0.02em]">{post.title}</h3>
        {summary && <p className="line-clamp-3 text-[14px] leading-[1.6] text-[var(--slot4-muted-text)]">{summary}</p>}
        <span className="mt-auto inline-flex items-center gap-2 text-[13px] font-medium">
          Open result <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined
  )
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
      ? []
      : SITE_CONFIG.tasks.filter(item => item.enabled).flatMap(item => getMockPostsForTask(item.key))
  const results = posts.filter(post => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter(item => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen">
        <section className={`${dc.shell.section} pt-14 pb-4 sm:pt-20`}>
          <EditableReveal index={0}>
            <span className={dc.badge.pill}>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-soft)]" />
              {pagesContent.search.hero.badge}
            </span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`${dc.type.sectionTitle} mt-6 max-w-[900px]`}>
              {pagesContent.search.hero.title.split('.')[0]}
              <span className="italic text-[var(--slot4-muted-text)]">.</span>
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className={`${dc.type.body} mt-6 max-w-[640px]`}>{pagesContent.search.hero.description}</p>
          </EditableReveal>

          <EditableReveal index={3}>
            <form action="/search" className="mt-10 rounded-[24px] border border-[var(--editable-border)] bg-white p-4">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-full border border-[var(--editable-border)] bg-white px-5 py-4">
                <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={pagesContent.search.hero.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[var(--slot4-muted-text)]"
                />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <label className="flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-5 py-3">
                  <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-[var(--slot4-muted-text)]" />
                </label>
                <select
                  name="task"
                  defaultValue={task}
                  className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-[14px] font-medium outline-none"
                >
                  <option value="">Everything</option>
                  {enabledTasks.map(item => (
                    <option key={item.key} value={item.key}>{DISPLAY_LABEL[item.key] || item.key}</option>
                  ))}
                </select>
                <button className={dc.button.primary} type="submit">
                  Search <ArrowUpRight className="h-4 w-4 transition duration-500 group-hover:-rotate-45" />
                </button>
              </div>
            </form>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} pb-16`}>
          <EditableReveal index={0} className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className={dc.type.eyebrow}>{results.length} results</p>
              <h2 className={`${dc.type.subsectionTitle} mt-3`}>
                {query ? `Results for “${query}”` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link href="/listing" className={dc.button.ghost}>
              Browse the directory <ArrowUpRight className="h-4 w-4" />
            </Link>
          </EditableReveal>

          {results.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => (
                <EditableReveal key={post.id || post.slug || index} index={index % 6}>
                  <SearchResultCard post={post} index={index} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[24px] border border-dashed border-[var(--editable-border)] bg-white p-12 text-center">
              <Search className="mx-auto h-8 w-8 text-[var(--slot4-muted-text)]" />
              <p className="editable-display mt-6 text-[22px] font-medium tracking-[-0.02em]">No matches yet.</p>
              <p className="mt-3 text-[15px] text-[var(--slot4-muted-text)]">
                Try a different keyword, category, or surface.
              </p>
            </div>
          )}

          <div className="mt-16">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel className="mx-auto w-full" />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
