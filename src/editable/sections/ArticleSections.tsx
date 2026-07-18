import Link from 'next/link'
import { ArrowUpRight, ChevronLeft } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export function EditableArticleArchive({
  posts,
  pagination,
  category = 'all',
  basePath = '/article',
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category?: string
  basePath?: string
}) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) =>
    `${basePath}?${new URLSearchParams({
      ...(category && category !== 'all' ? { category } : {}),
      page: String(nextPage),
    }).toString()}`

  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-14 pb-6 sm:pt-20`}>
        <EditableReveal index={0}>
          <span className={dc.badge.pill}>{voice.eyebrow}</span>
        </EditableReveal>
        <EditableReveal index={1}>
          <h1 className={`${dc.type.sectionTitle} mt-6 max-w-[900px]`}>
            {voice.headline.split('.')[0]}
            <span className="italic text-[var(--slot4-muted-text)]">.</span>
          </h1>
        </EditableReveal>
        <EditableReveal index={2}>
          <p className={`${dc.type.body} mt-6 max-w-[640px]`}>{voice.description}</p>
        </EditableReveal>
        <EditableReveal index={3} className="mt-10">
          <form action={basePath} className="flex max-w-xl flex-col gap-3 sm:flex-row">
            <select
              name="category"
              defaultValue={category || 'all'}
              className="min-w-0 flex-1 rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-[14px] font-medium outline-none"
            >
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map(item => (
                <option key={item.slug} value={item.slug}>{item.name}</option>
              ))}
            </select>
            <button className={dc.button.primary} type="submit">
              Filter <ArrowUpRight className="h-4 w-4" />
            </button>
          </form>
        </EditableReveal>
      </section>

      <section className={`${dc.shell.section} pb-24`}>
        {posts.length ? (
          <div className="grid gap-6">
            {posts.map((post, index) => (
              <EditableReveal key={post.id} index={index % 6}>
                <ArticleListCard
                  post={post}
                  href={postHref('article', post, basePath)}
                  index={index + (page - 1) * pagination.limit}
                />
              </EditableReveal>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-[var(--editable-border)] bg-white p-12 text-center">
            <h2 className="editable-display text-[28px] font-medium tracking-[-0.03em]">No articles found.</h2>
            <p className="mt-3 text-[14px] text-[var(--slot4-muted-text)]">Try another category.</p>
          </div>
        )}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage && (
            <Link href={pageHref(page - 1)} className={dc.button.secondary}>Previous</Link>
          )}
          <span className="rounded-full bg-[var(--slot4-page-text)] px-5 py-3 text-[13px] font-medium text-white">
            {page} / {pagination.totalPages || 1}
          </span>
          {pagination.hasNextPage && (
            <Link href={pageHref(page + 1)} className={dc.button.secondary}>
              Next <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-14`}>
        <Link href="/article" className={dc.button.ghost}>
          <ChevronLeft className="h-4 w-4" /> Back
        </Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <span className={dc.badge.pill}>{voice.eyebrow}</span>
            <h1 className="editable-display mt-6 text-[44px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[68px]">
              {post?.title || pagesContent.detailPages.article.fallbackTitle}
            </h1>
          </div>
          <aside className="rounded-[24px] bg-[var(--slot4-page-text)] p-6 text-white">
            <p className="editable-eyebrow text-white/60">Reading note</p>
            <p className="mt-4 text-[14px] leading-[1.6] text-white/80">{voice.secondaryNote}</p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] font-medium text-[var(--slot4-page-text)]">
              Contact <ArrowUpRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>
      <section className={`${dc.shell.section} py-14`}>
        <div className="mx-auto max-w-[760px]">
          <p className="text-[16px] leading-[1.7] text-[var(--slot4-muted-text)]">
            {post?.summary || `Article detail content for ${slug} will render through the editable detail page.`}
          </p>
        </div>
      </section>
    </main>
  )
}
