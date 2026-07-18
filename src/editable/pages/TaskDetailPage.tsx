import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Building2,
  Camera,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Star,
  Tag,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { taskThemeStyle } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

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

export async function generateEditableDetailMetadata(
  task: TaskKey,
  params: Promise<{ slug?: string; username?: string }>
) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({
  task,
  params,
}: {
  task: TaskKey
  params: Promise<{ slug?: string; username?: string }>
}) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter(item => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

/* ---------------- shared helpers ---------------- */

const getContent = (p: SitePost) => (p.content && typeof p.content === 'object' ? (p.content as Record<string, unknown>) : {})
const asText = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const isUrl = (v: string) => v.startsWith('/') || /^https?:\/\//i.test(v)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map(item => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map(key => asText(content[key]))
    .filter(url => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const c = getContent(post)
  return asText(c.body) || asText(c.description) || asText(c.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const safeUrl = (v: string) => (/^https?:\/\//i.test(v) ? v : '#')
const linkifyMarkdown = (v: string) =>
  v.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_m, label, url) =>
    `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`
  )
const linkifyText = (v: string) =>
  linkifyMarkdown(v).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_m, pre, url) =>
    `${pre}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`
  )
const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })
const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"')
  )
const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map(part => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}
const summaryText = (p: SitePost) => p.summary || asText(getContent(p).description) || asText(getContent(p).excerpt) || ''
const stripHtml = (v: string) => v.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main
        style={taskThemeStyle(task)}
        className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]"
      >
        {task === 'listing' && <ListingDetail post={post} related={related} />}
        {task === 'pdf' && <PdfDetail post={post} related={related} />}
        {task === 'article' && <ArticleDetail post={post} related={related} comments={comments} />}
        {task === 'classified' && <ClassifiedDetail post={post} related={related} />}
        {task === 'image' && <ImageDetail post={post} related={related} />}
        {task === 'sbm' && <BookmarkDetail post={post} related={related} />}
        {task === 'profile' && <ProfileDetail post={post} related={related} />}
      </main>
    </EditableSiteShell>
  )
}

/* ---------------- shared UI atoms ---------------- */

function Kicker({ children }: { children: React.ReactNode }) {
  return <span className={dc.badge.pill}><span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-soft)]" />{children}</span>
}

function BackLink({ label, href }: { label: string; href: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 text-[13px] font-medium text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]">
      <ArrowLeft className="h-4 w-4 transition duration-300 group-hover:-translate-x-0.5" /> {label}
    </Link>
  )
}

function BodyContent({ post }: { post: SitePost }) {
  const html = formatPlainText(getBody(post))
  return (
    <div
      className="article-content max-w-none text-[16px] leading-[1.75] text-[var(--slot4-page-text)]/85"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function TagChips({ post }: { post: SitePost }) {
  const tags = (post.tags || []).filter(Boolean).slice(0, 8)
  if (tags.length === 0) return null
  return (
    <div className="mt-8 flex flex-wrap gap-2">
      {tags.map(tag => (
        <span key={tag} className={dc.badge.pill}>
          <Tag className="h-3 w-3" /> {tag}
        </span>
      ))}
    </div>
  )
}

function ContactRow({ icon: Icon, label, value, href }: { icon: typeof MapPin; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-page-bg)]">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="editable-eyebrow">{label}</p>
        <p className="mt-1 truncate text-[14px] font-medium text-[var(--slot4-page-text)]">{value}</p>
      </div>
    </div>
  )
  if (href) return <a href={href} className="block rounded-2xl p-3 transition duration-300 hover:bg-[var(--slot4-page-bg)]">{content}</a>
  return <div className="block rounded-2xl p-3">{content}</div>
}

function TrustPanel({ items }: { items: string[] }) {
  return (
    <div className="mt-6 rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] p-5">
      <p className="editable-eyebrow">Trust panel</p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {items.map(item => (
          <li key={item} className="flex items-start gap-2.5 text-[13px] text-[var(--slot4-page-text)]">
            <CheckCircle2 className="mt-[3px] h-4 w-4 shrink-0" /> {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------------- Listing detail (premium) ---------------- */

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'contact', 'contactNumber'])
  const email = getField(post, ['email', 'contactEmail'])
  const website = getField(post, ['website', 'url', 'link'])
  const hours = getField(post, ['hours', 'timing', 'openingHours'])
  const category = categoryOf(post, 'Business')
  const images = getImages(post)
  const heroImg = images[0] || '/placeholder.svg?height=900&width=1600'
  const gallery = images.slice(1, 7)
  const mapSrc = mapSrcFor(post)

  return (
    <>
      {/* Hero */}
      <section className={`${dc.shell.section} pt-10 sm:pt-14`}>
        <EditableReveal index={0}>
          <BackLink label="Back to directory" href="/listing" />
        </EditableReveal>
        <EditableReveal index={1} className="mt-6 flex flex-wrap items-center gap-2">
          <Kicker>Local Directory</Kicker>
          <span className={dc.badge.pill}>
            <Building2 className="h-3 w-3" /> {category}
          </span>
          {address && (
            <span className={dc.badge.pill}>
              <MapPin className="h-3 w-3" /> {address.split(',')[0]}
            </span>
          )}
        </EditableReveal>

        <EditableReveal index={2}>
          <h1 className="editable-display mt-8 max-w-[1000px] text-[44px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[64px] lg:text-[84px]">
            {post.title}
          </h1>
        </EditableReveal>

        {leadText(post) && (
          <EditableReveal index={3}>
            <p className="mt-8 max-w-[720px] text-[18px] leading-[1.65] text-[var(--slot4-muted-text)]">
              {leadText(post)}
            </p>
          </EditableReveal>
        )}

        <EditableReveal index={4} className="mt-12 overflow-hidden rounded-[24px] bg-[var(--slot4-media-bg)]">
          <div className="relative aspect-[16/9]">
            <img src={heroImg} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </EditableReveal>

        {/* Quick-facts strip */}
        <EditableReveal index={5} className="mt-8 grid gap-3 rounded-[20px] border border-[var(--editable-border)] bg-white p-4 sm:grid-cols-4">
          {[
            address && { icon: MapPin, label: 'Where', value: address },
            phone && { icon: Phone, label: 'Call', value: phone },
            hours && { icon: Star, label: 'Hours', value: hours },
            { icon: CheckCircle2, label: 'Status', value: 'Verified entry' },
          ]
            .filter(Boolean)
            .slice(0, 4)
            .map((item: any) => (
              <div key={item.label} className="flex items-start gap-3 rounded-2xl p-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--slot4-page-bg)]">
                  <item.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="editable-eyebrow">{item.label}</p>
                  <p className="mt-1 text-[14px] font-medium">{item.value}</p>
                </div>
              </div>
            ))}
        </EditableReveal>
      </section>

      {/* Body + sidebar */}
      <section className={`${dc.shell.section} py-16`}>
        <div className="grid gap-12 lg:grid-cols-[1.55fr_0.85fr]">
          {/* Article column */}
          <div>
            <EditableReveal index={0}>
              <h2 className={`${dc.type.subsectionTitle} max-w-[640px]`}>
                About this <span className="italic text-[var(--slot4-muted-text)]">place</span>.
              </h2>
            </EditableReveal>
            <EditableReveal index={1} className="mt-8">
              <BodyContent post={post} />
              <TagChips post={post} />
            </EditableReveal>

            {gallery.length > 0 && (
              <EditableReveal index={2} className="mt-14">
                <h3 className="editable-display text-[24px] font-semibold tracking-[-0.02em]">Gallery</h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {gallery.map((src, i) => (
                    <div key={src + i} className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[var(--slot4-media-bg)]">
                      <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 hover:scale-[1.04]" />
                    </div>
                  ))}
                </div>
              </EditableReveal>
            )}

            {mapSrc && (
              <EditableReveal index={3} className="mt-14">
                <h3 className="editable-display text-[24px] font-semibold tracking-[-0.02em]">Find it</h3>
                <div className="mt-6 overflow-hidden rounded-[24px] border border-[var(--editable-border)] bg-white">
                  <iframe src={mapSrc} className="h-[420px] w-full" loading="lazy" title={`${post.title} — map`} />
                </div>
              </EditableReveal>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <EditableReveal index={0} className="rounded-[24px] border border-[var(--editable-border)] bg-white p-6">
              <p className="editable-eyebrow">Contact</p>
              <h3 className="editable-display mt-3 text-[20px] font-semibold tracking-[-0.02em]">{post.title}</h3>
              <div className="mt-5 flex flex-col gap-1">
                {address && <ContactRow icon={MapPin} label="Address" value={address} />}
                {phone && <ContactRow icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} />}
                {email && <ContactRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} />}
                {website && <ContactRow icon={Globe2} label="Website" value={website.replace(/^https?:\/\//, '')} href={safeUrl(website)} />}
                {hours && <ContactRow icon={Star} label="Hours" value={hours} />}
              </div>
              <a
                href={website ? safeUrl(website) : `tel:${phone || ''}`}
                className={`${dc.button.primary} mt-6 w-full`}
              >
                Visit official site
                <ArrowUpRight className="h-4 w-4 transition duration-500 group-hover:-rotate-45" />
              </a>
              <TrustPanel items={['Address checked by editors', 'Contact tested before publish', 'Hours refreshed regularly']} />
            </EditableReveal>

            <div className="mt-6">
              <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel className="mx-auto w-full" />
            </div>
          </aside>
        </div>
      </section>

      {/* Related directory strip */}
      <RelatedStrip task="listing" related={related} title="More in the directory" />
    </>
  )
}

/* ---------------- PDF detail (Reference Library — document workspace) ---------------- */

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const category = categoryOf(post, 'Reference')
  const pages = getField(post, ['pages', 'pageCount'])
  const size = getField(post, ['fileSize', 'size'])
  const format = getField(post, ['format', 'fileType']) || 'PDF'
  const uploader = getField(post, ['author', 'uploader', 'contributor'])
  const rawPdf = getField(post, ['pdfUrl', 'fileUrl', 'downloadUrl', 'url'])
  const pdfUrl = rawPdf && isUrl(rawPdf) ? rawPdf : ''
  const lead = leadText(post)

  return (
    <>
      {/* Header */}
      <section className={`${dc.shell.section} pt-10 sm:pt-14`}>
        <EditableReveal index={0}>
          <BackLink label="Back to the library" href="/pdf" />
        </EditableReveal>

        <EditableReveal index={1} className="mt-6 flex flex-wrap items-center gap-2">
          <span className={`${dc.badge.pill} font-mono`}>
            <FileText className="h-3 w-3" /> Reference document
          </span>
          <span className={`${dc.badge.pill} font-mono`}>{format.toUpperCase()}</span>
          <span className={`${dc.badge.pill}`}>
            <Tag className="h-3 w-3" /> {category}
          </span>
        </EditableReveal>

        <EditableReveal index={2}>
          <h1 className="editable-display mt-10 max-w-[1100px] text-[52px] font-semibold leading-[1.0] tracking-[-0.05em] sm:text-[80px] lg:text-[108px]">
            {post.title}
          </h1>
        </EditableReveal>

        {lead && (
          <EditableReveal index={3}>
            <blockquote className="mt-10 max-w-[880px] border-l-2 border-[var(--slot4-page-text)] pl-6">
              <p className="editable-display text-[22px] font-medium leading-[1.4] tracking-[-0.015em] text-[var(--slot4-page-text)] sm:text-[26px]">
                “{lead}”
              </p>
            </blockquote>
          </EditableReveal>
        )}

        <EditableReveal index={4} className="mt-10 flex flex-wrap items-center gap-3">
          {pdfUrl && (
            <a href={pdfUrl} download className={dc.button.primary}>
              <Download className="h-4 w-4" /> Download {format.toUpperCase()}
            </a>
          )}
          {pdfUrl && (
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={dc.button.secondary}>
              Open in new tab
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </EditableReveal>

        {/* Quick-facts strip */}
        <EditableReveal index={5} className="mt-10 grid gap-3 rounded-[20px] border border-[var(--editable-border)] bg-white p-4 sm:grid-cols-4">
          {[
            pages && { label: 'Pages', value: pages },
            size && { label: 'File size', value: size },
            { label: 'Format', value: format.toUpperCase() },
            { label: 'Updated', value: 'Latest revision' },
          ]
            .filter(Boolean)
            .slice(0, 4)
            .map((item: any) => (
              <div key={item.label} className="rounded-2xl p-3">
                <p className="editable-eyebrow font-mono">{item.label}</p>
                <p className="editable-display mt-1 text-[20px] font-semibold tracking-[-0.02em]">{item.value}</p>
              </div>
            ))}
        </EditableReveal>

        {/* Embedded PDF preview */}
        <EditableReveal index={6} className="mt-12 overflow-hidden rounded-[24px] border border-[var(--editable-border)] bg-white">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="h-[820px] w-full"
              title={`${post.title} — preview`}
            />
          ) : (
            <div className="flex h-[520px] flex-col items-center justify-center gap-4 bg-[var(--slot4-media-bg)]">
              <span className="editable-display text-[96px] font-semibold tracking-[-0.06em] text-[var(--slot4-muted-text)]">
                PDF
              </span>
              <p className="text-[14px] text-[var(--slot4-muted-text)]">Preview not attached — use the download button.</p>
            </div>
          )}
        </EditableReveal>
      </section>

      {/* Body + sidebar */}
      <section className={`${dc.shell.section} py-16`}>
        <div className="grid gap-12 lg:grid-cols-[1.55fr_0.85fr]">
          <div>
            <EditableReveal index={0}>
              <h2 className="editable-display text-[36px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[48px]">
                About this <span className="italic text-[var(--slot4-muted-text)]">document</span>.
              </h2>
            </EditableReveal>

            <EditableReveal index={1} className="mt-8">
              <BodyContent post={post} />
              <TagChips post={post} />
            </EditableReveal>

            {/* Repeated CTA callout */}
            {pdfUrl && (
              <EditableReveal index={2} className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-[24px] bg-[var(--slot4-page-text)] p-8 text-white">
                <div>
                  <p className="editable-eyebrow text-white/60">Grab the document</p>
                  <p className="editable-display mt-3 max-w-[420px] text-[24px] font-semibold tracking-[-0.02em]">
                    Download the full {format.toUpperCase()} — {pages ? `${pages} pages, ` : ''}ready for offline reading.
                  </p>
                </div>
                <a href={pdfUrl} download className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-medium text-[var(--slot4-page-text)]">
                  <Download className="h-4 w-4" /> Download {format.toUpperCase()}
                </a>
              </EditableReveal>
            )}

            {/* article-bottom ad — before related strip */}
            <div className="mt-14">
              <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel className="mx-auto w-full" />
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <EditableReveal index={0} className="rounded-[24px] border border-[var(--editable-border)] bg-white p-6">
              <div className="flex aspect-[4/5] items-center justify-center rounded-[16px] bg-[var(--slot4-page-bg)]">
                <span className="editable-display text-[88px] font-semibold tracking-[-0.06em] text-[var(--slot4-muted-text)]">
                  {(format.slice(0, 3) || 'PDF').toUpperCase()}
                </span>
              </div>
              <p className="editable-display mt-6 line-clamp-2 text-[18px] font-medium tracking-[-0.02em]">
                {post.title}
              </p>
              <dl className="mt-5 grid gap-3 text-[13px]">
                <div className="flex justify-between border-b border-[var(--editable-border)] pb-3">
                  <dt className="text-[var(--slot4-muted-text)]">Category</dt>
                  <dd className="font-medium">{category}</dd>
                </div>
                {pages && (
                  <div className="flex justify-between border-b border-[var(--editable-border)] pb-3">
                    <dt className="text-[var(--slot4-muted-text)]">Pages</dt>
                    <dd className="font-medium">{pages}</dd>
                  </div>
                )}
                {size && (
                  <div className="flex justify-between border-b border-[var(--editable-border)] pb-3">
                    <dt className="text-[var(--slot4-muted-text)]">File size</dt>
                    <dd className="font-medium">{size}</dd>
                  </div>
                )}
                {uploader && (
                  <div className="flex justify-between border-b border-[var(--editable-border)] pb-3">
                    <dt className="text-[var(--slot4-muted-text)]">Uploaded by</dt>
                    <dd className="font-medium">{uploader}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-[var(--slot4-muted-text)]">Format</dt>
                  <dd className="font-medium">{format.toUpperCase()}</dd>
                </div>
              </dl>
              {pdfUrl && (
                <a href={pdfUrl} download className={`${dc.button.primary} mt-6 w-full`}>
                  <Download className="h-4 w-4" /> Download
                </a>
              )}
            </EditableReveal>

            <EditableReveal index={1} className="mt-6 rounded-[24px] border border-[var(--editable-border)] bg-white p-6">
              <p className="editable-eyebrow">What&apos;s inside</p>
              <ul className="mt-4 flex flex-col gap-3 text-[14px]">
                {['Overview & scope', 'Key definitions', 'Detailed sections', 'Data tables & figures', 'References'].map(row => (
                  <li key={row} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4" /> {row}
                  </li>
                ))}
              </ul>
            </EditableReveal>
          </aside>
        </div>
      </section>

      {/* Related documents — glyph, no images */}
      <PdfRelatedStrip related={related} />
    </>
  )
}

function PdfRelatedStrip({ related }: { related: SitePost[] }) {
  if (related.length === 0) return null
  return (
    <section className={`${dc.shell.section} pb-24`}>
      <EditableReveal index={0}>
        <h2 className={`${dc.type.subsectionTitle} max-w-[640px]`}>
          More <span className="italic text-[var(--slot4-muted-text)]">reference documents</span>.
        </h2>
      </EditableReveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((rp, i) => {
          const size = getField(rp, ['fileSize', 'size'])
          return (
            <EditableReveal key={rp.slug || rp.id || i} index={i}>
              <Link
                href={`/pdf/${rp.slug}`}
                className="group flex flex-col rounded-[20px] border border-[var(--editable-border)] bg-white p-5 transition duration-500 hover:-translate-y-1"
              >
                <div className="flex aspect-[4/5] items-center justify-center rounded-[14px] bg-[var(--slot4-page-bg)]">
                  <span className="editable-display text-[56px] font-semibold tracking-[-0.05em] text-[var(--slot4-muted-text)]">PDF</span>
                </div>
                <h3 className="editable-display mt-4 line-clamp-2 text-[16px] font-medium tracking-[-0.02em]">{rp.title}</h3>
                {size && <span className={`${dc.badge.pill} mt-3 self-start`}>{size}</span>}
              </Link>
            </EditableReveal>
          )
        })}
      </div>
    </section>
  )
}

/* ---------------- Article detail ---------------- */

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const category = categoryOf(post, 'Editorial')
  const images = getImages(post)
  const hero = images[0] || '/placeholder.svg?height=900&width=1600'
  return (
    <>
      <section className={`${dc.shell.section} pt-10 sm:pt-14`}>
        <EditableReveal index={0}><BackLink label="Back to editorial" href="/article" /></EditableReveal>
        <EditableReveal index={1} className="mt-6 flex flex-wrap gap-2">
          <Kicker>Editorial</Kicker>
          <span className={dc.badge.pill}>{category}</span>
        </EditableReveal>
        <EditableReveal index={2}>
          <h1 className="editable-display mt-8 max-w-[1000px] text-[44px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[64px] lg:text-[80px]">{post.title}</h1>
        </EditableReveal>
        {leadText(post) && (
          <EditableReveal index={3}>
            <p className="mt-8 max-w-[720px] text-[18px] leading-[1.65] text-[var(--slot4-muted-text)]">{leadText(post)}</p>
          </EditableReveal>
        )}
        <EditableReveal index={4} className="mt-10 overflow-hidden rounded-[24px] bg-[var(--slot4-media-bg)]">
          <div className="relative aspect-[16/9]"><img src={hero} alt={post.title} className="absolute inset-0 h-full w-full object-cover" /></div>
        </EditableReveal>
      </section>
      <section className={`${dc.shell.section} py-16`}>
        <div className="mx-auto max-w-[760px]">
          <EditableReveal index={0}><BodyContent post={post} /></EditableReveal>
          <TagChips post={post} />
          <div className="mt-16">
            <EditableArticleComments slug={post.slug} comments={comments} />
          </div>
        </div>
      </section>
      <RelatedStrip task="article" related={related} title="Keep reading" />
    </>
  )
}

/* ---------------- Classified detail ---------------- */

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const category = categoryOf(post, 'Notice')
  const images = getImages(post)
  const hero = images[0] || '/placeholder.svg?height=900&width=1600'
  return (
    <>
      <section className={`${dc.shell.section} pt-10 sm:pt-14`}>
        <EditableReveal index={0}><BackLink label="Back to notices" href="/classified" /></EditableReveal>
        <EditableReveal index={1} className="mt-6 flex flex-wrap gap-2">
          <Kicker>Notices</Kicker>
          <span className={dc.badge.pill}>{category}</span>
        </EditableReveal>
        <EditableReveal index={2}>
          <h1 className="editable-display mt-8 max-w-[1000px] text-[40px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[60px]">{post.title}</h1>
        </EditableReveal>
        <EditableReveal index={3} className="mt-10 overflow-hidden rounded-[24px] bg-[var(--slot4-media-bg)]">
          <div className="relative aspect-[16/9]"><img src={hero} alt={post.title} className="absolute inset-0 h-full w-full object-cover" /></div>
        </EditableReveal>
      </section>
      <section className={`${dc.shell.section} py-16`}>
        <div className="mx-auto max-w-[760px]">
          <BodyContent post={post} />
          <TagChips post={post} />
        </div>
      </section>
      <RelatedStrip task="classified" related={related} title="More notices" />
    </>
  )
}

/* ---------------- Image detail ---------------- */

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const hero = images[0] || '/placeholder.svg?height=900&width=1600'
  const category = categoryOf(post, 'Gallery')
  return (
    <>
      <section className={`${dc.shell.section} pt-10 sm:pt-14`}>
        <EditableReveal index={0}><BackLink label="Back to gallery" href="/image" /></EditableReveal>
        <EditableReveal index={1} className="mt-6 flex flex-wrap gap-2">
          <Kicker>Gallery</Kicker>
          <span className={dc.badge.pill}><Camera className="h-3 w-3" /> {category}</span>
        </EditableReveal>
        <EditableReveal index={2}>
          <h1 className="editable-display mt-8 max-w-[1000px] text-[40px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[60px]">{post.title}</h1>
        </EditableReveal>
        <EditableReveal index={3} className="mt-10 overflow-hidden rounded-[24px] bg-[var(--slot4-media-bg)]">
          <img src={hero} alt={post.title} className="h-auto w-full object-contain" />
        </EditableReveal>
      </section>
      <section className={`${dc.shell.section} py-16`}>
        <div className="mx-auto max-w-[760px]"><BodyContent post={post} /><TagChips post={post} /></div>
        {images.length > 1 && (
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.slice(1).map((src, i) => (
              <div key={src + i} className="overflow-hidden rounded-[20px] bg-[var(--slot4-media-bg)]">
                <img src={src} alt="" className="h-auto w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </section>
      <RelatedStrip task="image" related={related} title="More visuals" />
    </>
  )
}

/* ---------------- Bookmark detail ---------------- */

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['url', 'link', 'website'])
  const category = categoryOf(post, 'Bookmark')
  return (
    <>
      <section className={`${dc.shell.section} pt-10 sm:pt-14`}>
        <EditableReveal index={0}><BackLink label="Back to bookmarks" href="/sbm" /></EditableReveal>
        <EditableReveal index={1} className="mt-6 flex flex-wrap gap-2">
          <Kicker>Bookmarks</Kicker>
          <span className={dc.badge.pill}><Bookmark className="h-3 w-3" /> {category}</span>
        </EditableReveal>
        <EditableReveal index={2}>
          <h1 className="editable-display mt-8 max-w-[1000px] text-[40px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[60px]">{post.title}</h1>
        </EditableReveal>
        {website && (
          <EditableReveal index={3} className="mt-8">
            <a href={safeUrl(website)} target="_blank" rel="noopener noreferrer" className={dc.button.primary}>
              Open link <ArrowUpRight className="h-4 w-4" />
            </a>
          </EditableReveal>
        )}
      </section>
      <section className={`${dc.shell.section} py-16`}>
        <div className="mx-auto max-w-[760px]"><BodyContent post={post} /><TagChips post={post} /></div>
      </section>
      <RelatedStrip task="sbm" related={related} title="More bookmarks" />
    </>
  )
}

/* ---------------- Profile detail ---------------- */

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const avatar = images[0] || '/placeholder.svg?height=400&width=400'
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className={`${dc.shell.section} pt-10 sm:pt-14`}>
        <EditableReveal index={0}><BackLink label="Back to people" href="/profile" /></EditableReveal>
        <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr] lg:items-start">
          <EditableReveal index={1}>
            <div className="relative aspect-square overflow-hidden rounded-[24px] bg-[var(--slot4-media-bg)]">
              <img src={avatar} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </EditableReveal>
          <EditableReveal index={2}>
            <Kicker>People</Kicker>
            <h1 className="editable-display mt-6 text-[40px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[60px]">{post.title}</h1>
            <p className="mt-6 max-w-[560px] text-[16px] leading-[1.7] text-[var(--slot4-muted-text)]">{leadText(post)}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {website && <a href={safeUrl(website)} className={dc.button.primary} target="_blank" rel="noopener noreferrer"><Globe2 className="h-4 w-4" /> Visit site</a>}
              {email && <a href={`mailto:${email}`} className={dc.button.secondary}><Mail className="h-4 w-4" /> Email</a>}
            </div>
          </EditableReveal>
        </div>
      </section>
      <section className={`${dc.shell.section} py-16`}>
        <div className="mx-auto max-w-[760px]"><BodyContent post={post} /><TagChips post={post} /></div>
      </section>
      <RelatedStrip task="profile" related={related} title="More people" />
    </>
  )
}

/* ---------------- Generic related strip (for non-pdf tasks) ---------------- */

function RelatedStrip({ task, related, title }: { task: TaskKey; related: SitePost[]; title: string }) {
  if (related.length === 0) return null
  const taskCfg = getTaskConfig(task)
  const route = taskCfg?.route || `/${task}`
  return (
    <section className={`${dc.shell.section} pb-24`}>
      <EditableReveal index={0}>
        <h2 className={`${dc.type.subsectionTitle} max-w-[640px]`}>{title}</h2>
      </EditableReveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((rp, i) => {
          const img = getImages(rp)[0] || '/placeholder.svg?height=600&width=800'
          const cat = categoryOf(rp, DISPLAY_LABEL[task])
          return (
            <EditableReveal key={rp.slug || rp.id || i} index={i}>
              <Link href={`${route}/${rp.slug}`} className="group block overflow-hidden rounded-[20px] border border-[var(--editable-border)] bg-white transition duration-500 hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={img} alt={rp.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                  <span className={`${dc.badge.pill} absolute left-3 top-3 bg-white/95`}>{cat}</span>
                </div>
                <div className="p-4">
                  <h3 className="editable-display line-clamp-2 text-[16px] font-medium tracking-[-0.02em]">{rp.title}</h3>
                </div>
              </Link>
            </EditableReveal>
          )
        })}
      </div>
    </section>
  )
}
