'use client'

import { Building2, FileText, MapPin, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

function getLanes(_kind: ReturnType<typeof getProductKind>) {
  return [
    { icon: Building2, title: 'Suggest a directory entry', body: 'Tell us about a place worth adding — we verify every entry before it goes live.' },
    { icon: FileText, title: 'Send a reference document', body: 'Have a document worth hosting in the reference library? Share the file and its context.' },
    { icon: MapPin, title: 'Report a change', body: 'Spot an address, phone number, or hours that need updating? Point us at the record.' },
    { icon: Sparkles, title: 'General questions', body: 'Everything else — partnerships, feedback, corrections — reach out here.' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)

  return (
    <EditableSiteShell>
      <main className="min-h-screen">
        <section className={`${dc.shell.section} pt-14 pb-8 sm:pt-20 lg:pt-28`}>
          <EditableReveal index={0}>
            <span className={dc.badge.pill}>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-soft)]" />
              {pagesContent.contact.eyebrow}
            </span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`${dc.type.heroTitle} mt-8 max-w-[1000px]`}>
              {pagesContent.contact.title.split('.')[0]}
              <span className="italic text-[var(--slot4-muted-text)]">.</span>
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className={`${dc.type.body} mt-8 max-w-[680px] text-[17px]`}>{pagesContent.contact.description}</p>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} pb-24`}>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col gap-4">
              {lanes.map((lane, i) => (
                <EditableReveal key={lane.title} index={i}>
                  <div className="rounded-[20px] border border-[var(--editable-border)] bg-white p-5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--slot4-page-text)] text-white">
                      <lane.icon className="h-5 w-5" />
                    </span>
                    <h2 className="editable-display mt-4 text-[20px] font-semibold tracking-[-0.02em]">{lane.title}</h2>
                    <p className="mt-2 text-[14px] leading-[1.6] text-[var(--slot4-muted-text)]">{lane.body}</p>
                  </div>
                </EditableReveal>
              ))}
            </div>
            <EditableReveal index={0}>
              <div className="rounded-[24px] border border-[var(--editable-border)] bg-white p-8">
                <h2 className="editable-display text-[28px] font-semibold tracking-[-0.03em]">{pagesContent.contact.formTitle}</h2>
                <p className="mt-3 text-[14px] text-[var(--slot4-muted-text)]">We usually reply within two working days.</p>
                <div className="mt-6">
                  <EditableContactLeadForm />
                </div>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
