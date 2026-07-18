import Link from 'next/link'
import { ArrowUpRight, Building2, Compass, FileText, Search, ShieldCheck } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import {
  EditorialFeatureCard,
  RailPostCard,
  ArticleListCard,
  postHref,
} from '@/editable/cards/PostCards'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

/* Display-safe task labels (never the raw SITE_CONFIG labels). */
const DISPLAY_LABEL: Record<TaskKey, string> = {
  listing: 'Local Directory',
  pdf: 'Reference Library',
  article: 'Editorial',
  classified: 'Notices',
  image: 'Gallery',
  sbm: 'Bookmarks',
  profile: 'People',
}

function displayLabel(task: TaskKey) {
  return DISPLAY_LABEL[task] || 'Discover'
}

/* ---------------- Hero ---------------- */

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const hero = pagesContent.home.hero
  const featured = posts.slice(0, 3)

  return (
    <section className={`${dc.shell.section} pt-14 pb-8 sm:pt-20 lg:pt-28`}>
      <EditableReveal index={0}>
        <div className="flex flex-col items-start gap-6">
          <span className={dc.badge.pill}>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-soft)]" />
            {hero.badge}
          </span>
          <h1 className={`${dc.type.heroTitle} max-w-[1080px]`}>
            {hero.title[0]}{' '}
            <span className="editable-display italic text-[var(--slot4-muted-text)]">
              {hero.title[1]}
            </span>
          </h1>
          <p className="max-w-[640px] text-[17px] leading-[1.7] text-[var(--slot4-muted-text)]">
            {hero.description}
          </p>
        </div>
      </EditableReveal>

      <EditableReveal index={1} className="mt-10 flex flex-wrap items-center gap-3">
        <Link href={hero.primaryCta.href} className={dc.button.primary}>
          {hero.primaryCta.label}
          <ArrowUpRight className="h-4 w-4 transition duration-500 group-hover:-rotate-45" />
        </Link>
        <Link href={hero.secondaryCta.href} className={dc.button.secondary}>
          {hero.secondaryCta.label}
          <ArrowUpRight className="h-4 w-4 transition duration-500 group-hover:-rotate-45" />
        </Link>
        <Link href="/search" className={dc.button.ghost}>
          <Search className="h-4 w-4" /> Or search everything
        </Link>
      </EditableReveal>

      {featured.length > 0 && (
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((post, i) => (
            <EditableReveal key={post.slug || post.id || i} index={i + 2}>
              <EditorialFeatureCard
                post={post}
                href={postHref(primaryTask, post, primaryRoute)}
                label={displayLabel(primaryTask)}
              />
            </EditableReveal>
          ))}
        </div>
      )}
    </section>
  )
}

/* ---------------- Story rail ---------------- */

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const items = posts.slice(3, 11)
  if (!items.length) return null

  return (
    <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
      <EditableReveal index={0} className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className={dc.type.eyebrow}>Recent additions</p>
          <h2 className={`${dc.type.sectionTitle} mt-4 max-w-[720px]`}>
            The latest in the <span className="italic text-[var(--slot4-muted-text)]">{displayLabel(primaryTask).toLowerCase()}</span>.
          </h2>
        </div>
        <Link href={primaryRoute} className={dc.button.ghost}>
          View all <ArrowUpRight className="h-4 w-4" />
        </Link>
      </EditableReveal>

      <div className={`${dc.layout.rail} mt-12 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10`}>
        {items.map((post, i) => (
          <EditableReveal key={post.slug || post.id || i} index={i}>
            <RailPostCard post={post} href={postHref(primaryTask, post, primaryRoute)} index={i} />
          </EditableReveal>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Two-surface split ---------------- */

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = posts[11] || posts[0]
  const rest = posts.slice(12, 15)

  return (
    <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
      <EditableReveal index={0} className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className={dc.type.eyebrow}>How the platform works</p>
          <h2 className={`${dc.type.sectionTitle} mt-5 max-w-[520px]`}>
            Two surfaces. <span className="italic text-[var(--slot4-muted-text)]">One calm rhythm.</span>
          </h2>
          <p className={`${dc.type.body} mt-6 max-w-[520px]`}>
            The Local Directory holds verified places — real addresses, real hours. The Reference Library holds the documents that back them up. Both share the same search box and the same category filters.
          </p>

          <ul className="mt-10 flex flex-col gap-4">
            {[
              { icon: Building2, title: 'Local Directory', body: 'Verified places, organised by category and location.' },
              { icon: FileText, title: 'Reference Library', body: 'Documents worth keeping — preview inline, download once.' },
              { icon: ShieldCheck, title: 'Checked by hand', body: 'Every entry is reviewed before it appears.' },
              { icon: Compass, title: 'One search', body: 'Places and documents come from the same box.' },
            ].map((row, i) => (
              <EditableReveal key={row.title} as="li" index={i} className="flex items-start gap-4 rounded-2xl border border-[var(--editable-border)] bg-white p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-page-text)] text-white">
                  <row.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="editable-display text-[17px] font-semibold tracking-[-0.02em]">{row.title}</p>
                  <p className="mt-1 text-[14px] leading-[1.55] text-[var(--slot4-muted-text)]">{row.body}</p>
                </div>
              </EditableReveal>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          {lead && (
            <EditableReveal index={0}>
              <EditorialFeatureCard
                post={lead}
                href={postHref(primaryTask, lead, primaryRoute)}
                label={displayLabel(primaryTask)}
              />
            </EditableReveal>
          )}
          {rest.map((post, i) => (
            <EditableReveal key={post.slug || post.id || i} index={i + 1}>
              <ArticleListCard post={post} href={postHref(primaryTask, post, primaryRoute)} index={i} />
            </EditableReveal>
          ))}
        </div>
      </EditableReveal>
    </section>
  )
}

/* ---------------- Time-based collections (uses fetched HomeTimeSection[]) ---------------- */

export function EditableTimeCollections({ primaryTask, primaryRoute, timeSections, posts }: HomeSectionProps) {
  const sections = timeSections.filter(s => s.posts?.length > 0).slice(0, 3)
  const fallback = sections.length === 0
  const fallbackPosts = fallback ? posts.slice(0, 6) : []

  return (
    <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
      <EditableReveal index={0} className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className={dc.type.eyebrow}>Collections</p>
          <h2 className={`${dc.type.sectionTitle} mt-4 max-w-[640px]`}>
            Browse by moment — <span className="italic text-[var(--slot4-muted-text)]">new, recent, and long-standing.</span>
          </h2>
        </div>
        <Link href={primaryRoute} className={dc.button.ghost}>
          Open the full list <ArrowUpRight className="h-4 w-4" />
        </Link>
      </EditableReveal>

      {fallback ? (
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {fallbackPosts.map((post, i) => (
            <EditableReveal key={post.slug || post.id || i} index={i}>
              <EditorialFeatureCard post={post} href={postHref(primaryTask, post, primaryRoute)} label={displayLabel(primaryTask)} />
            </EditableReveal>
          ))}
        </div>
      ) : (
        <div className="mt-14 flex flex-col gap-16">
          {sections.map((section, sIdx) => (
            <EditableReveal key={section.key} index={sIdx}>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className={dc.type.eyebrow}>{section.eyebrow}</p>
                  <h3 className={`${dc.type.subsectionTitle} mt-2 max-w-[640px]`}>{section.title}</h3>
                  <p className="mt-3 max-w-[560px] text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">
                    {section.description}
                  </p>
                </div>
                <Link href={section.href || primaryRoute} className={dc.button.ghost}>
                  See all <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {section.posts.slice(0, 6).map((post, i) => (
                  <EditableReveal key={`${section.key}-${post.slug || post.id || i}`} index={i}>
                    <RailPostCard post={post} href={postHref(section.task, post, section.href || primaryRoute)} index={i} />
                  </EditableReveal>
                ))}
              </div>
            </EditableReveal>
          ))}
        </div>
      )}
    </section>
  )
}

/* ---------------- Bottom CTA ---------------- */

export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
      <EditableReveal index={0}>
        <div className="relative overflow-hidden rounded-[28px] bg-[var(--slot4-page-text)] px-6 py-16 text-white sm:px-14 sm:py-24 lg:px-20 lg:py-28">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--slot4-accent-soft)] opacity-25 blur-3xl" />
          <p className="editable-eyebrow text-white/70">{cta.badge}</p>
          <h2 className="editable-display mt-5 max-w-[820px] text-[36px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[52px] lg:text-[68px]">
            {cta.title}
          </h2>
          <p className="mt-6 max-w-[560px] text-[17px] leading-[1.7] text-white/70">
            {cta.description}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href={cta.primaryCta.href} className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-medium text-[var(--slot4-page-text)] transition duration-500 hover:gap-3">
              {cta.primaryCta.label}
              <ArrowUpRight className="h-4 w-4 transition duration-500 group-hover:-rotate-45" />
            </Link>
            <Link href={cta.secondaryCta.href} className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[14px] font-medium text-white transition duration-500 hover:bg-white/5">
              {cta.secondaryCta.label}
              <ArrowUpRight className="h-4 w-4 transition duration-500 group-hover:-rotate-45" />
            </Link>
          </div>
        </div>
      </EditableReveal>
    </section>
  )
}
