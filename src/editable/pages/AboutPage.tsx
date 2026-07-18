import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen">
        <section className={`${dc.shell.section} pt-14 pb-8 sm:pt-20 lg:pt-28`}>
          <EditableReveal index={0}>
            <span className={dc.badge.pill}>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-soft)]" />
              {pagesContent.about.badge}
            </span>
          </EditableReveal>
          <EditableReveal index={1}>
            <h1 className={`${dc.type.heroTitle} mt-8 max-w-[1000px]`}>
              About <span className="italic text-[var(--slot4-muted-text)]">{SITE_CONFIG.name}</span>.
            </h1>
          </EditableReveal>
          <EditableReveal index={2}>
            <p className={`${dc.type.body} mt-8 max-w-[680px] text-[18px]`}>{pagesContent.about.description}</p>
          </EditableReveal>
        </section>

        <section className={`${dc.shell.section} pb-16`}>
          <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col gap-6">
              {pagesContent.about.paragraphs.map((paragraph, i) => (
                <EditableReveal key={paragraph} index={i}>
                  <p className="editable-display text-[22px] font-medium leading-[1.5] tracking-[-0.015em] text-[var(--slot4-page-text)]">
                    {paragraph}
                  </p>
                </EditableReveal>
              ))}
            </div>
            <div className="flex flex-col gap-5">
              {pagesContent.about.values.map((value, i) => (
                <EditableReveal key={value.title} index={i}>
                  <div className="rounded-[24px] border border-[var(--editable-border)] bg-white p-6">
                    <p className="editable-eyebrow">0{i + 1}</p>
                    <h2 className="editable-display mt-4 text-[22px] font-semibold tracking-[-0.02em]">{value.title}</h2>
                    <p className="mt-3 text-[15px] leading-[1.6] text-[var(--slot4-muted-text)]">{value.description}</p>
                  </div>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
