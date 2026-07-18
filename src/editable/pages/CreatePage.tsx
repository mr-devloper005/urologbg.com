'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Building2, CheckCircle2, FileText, Lock, PlusCircle, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const DISPLAY_LABEL: Record<TaskKey, string> = {
  listing: 'Local Directory',
  pdf: 'Reference Library',
  article: 'Editorial',
  classified: 'Notices',
  image: 'Gallery',
  sbm: 'Bookmarks',
  profile: 'People',
}
const DISPLAY_DESC: Record<TaskKey, string> = {
  listing: 'Add a verified place to the directory.',
  pdf: 'Send a reference document to the library.',
  article: 'Publish a long-form piece.',
  classified: 'Post a short notice.',
  image: 'Share a visual entry.',
  sbm: 'Save a link worth keeping.',
  profile: 'Create a person profile.',
}
const taskIcon: Record<TaskKey, typeof FileText> = {
  listing: Building2,
  pdf: FileText,
  article: FileText,
  classified: PlusCircle,
  image: PlusCircle,
  profile: PlusCircle,
  sbm: PlusCircle,
}

const fieldClass =
  'w-full rounded-2xl border border-[var(--editable-border)] bg-white px-4 py-3 text-[15px] text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-page-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter(t => t.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'listing') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen">
          <section className={`${dc.shell.section} py-24`}>
            <div className="grid gap-14 rounded-[28px] border border-[var(--editable-border)] bg-white p-10 lg:grid-cols-[0.9fr_1.1fr]">
              <EditableReveal index={0}>
                <div className="flex aspect-square items-center justify-center rounded-[24px] bg-[var(--slot4-page-text)] text-white">
                  <Lock className="h-20 w-20" />
                </div>
              </EditableReveal>
              <EditableReveal index={1} className="self-center">
                <span className={dc.badge.pill}>{pagesContent.create.locked.badge}</span>
                <h1 className={`${dc.type.sectionTitle} mt-6 max-w-[520px]`}>
                  {pagesContent.create.locked.title.split('.')[0]}
                  <span className="italic text-[var(--slot4-muted-text)]">.</span>
                </h1>
                <p className={`${dc.type.body} mt-6 max-w-[560px]`}>{pagesContent.create.locked.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/login" className={dc.button.primary}>Sign in <ArrowUpRight className="h-4 w-4" /></Link>
                  <Link href="/signup" className={dc.button.secondary}>Get started</Link>
                </div>
              </EditableReveal>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen">
        <section className={`${dc.shell.section} py-14 sm:py-20`}>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <EditableReveal index={0}>
              <span className={dc.badge.pill}>{pagesContent.create.hero.badge}</span>
              <h1 className={`${dc.type.sectionTitle} mt-6 max-w-[480px]`}>
                {pagesContent.create.hero.title.split('.')[0]}
                <span className="italic text-[var(--slot4-muted-text)]">.</span>
              </h1>
              <p className={`${dc.type.body} mt-6 max-w-[520px]`}>{pagesContent.create.hero.description}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {enabledTasks.map(item => {
                  const Icon = taskIcon[item.key as TaskKey] || FileText
                  const active = item.key === task
                  const label = DISPLAY_LABEL[item.key as TaskKey] || item.key
                  const desc = DISPLAY_DESC[item.key as TaskKey] || ''
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTask(item.key as TaskKey)}
                      className={`rounded-[20px] border p-5 text-left transition duration-500 ${
                        active
                          ? 'border-[var(--slot4-page-text)] bg-[var(--slot4-page-text)] text-white'
                          : 'border-[var(--editable-border)] bg-white hover:-translate-y-1'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="editable-display mt-4 block text-[17px] font-semibold tracking-[-0.02em]">{label}</span>
                      <span className="mt-1 block text-[13px] opacity-75">{desc}</span>
                    </button>
                  )
                })}
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <form onSubmit={submit} className="rounded-[24px] border border-[var(--editable-border)] bg-white p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className={dc.type.eyebrow}>New submission</p>
                    <h2 className="editable-display mt-2 text-[24px] font-semibold tracking-[-0.02em]">{pagesContent.create.formTitle}</h2>
                  </div>
                  <span className={dc.badge.pill}>{session.name}</span>
                </div>

                <div className="mt-6 grid gap-4">
                  <input className={fieldClass} value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input className={fieldClass} value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" />
                    <input className={fieldClass} value={url} onChange={e => setUrl(e.target.value)} placeholder="Website or file URL" />
                  </div>
                  <input className={fieldClass} value={image} onChange={e => setImage(e.target.value)} placeholder="Featured image URL (optional)" />
                  <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={e => setSummary(e.target.value)} placeholder="Short summary" required />
                  <textarea className={`${fieldClass} min-h-48`} value={body} onChange={e => setBody(e.target.value)} placeholder="Details, notes, or description" required />
                </div>

                {created && (
                  <div className="mt-5 rounded-[20px] border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                    <p className="flex items-center gap-2 text-[14px] font-medium"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                    <p className="mt-1 text-[13px] opacity-80">{created.title}</p>
                  </div>
                )}

                <button type="submit" className={`${dc.button.primary} mt-6 w-full`}>
                  <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
                </button>
              </form>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
