import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Sign in', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen">
        <section className={`${dc.shell.section} grid min-h-[calc(100vh-8rem)] items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24`}>
          <EditableReveal index={0}>
            <span className={dc.badge.pill}>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-soft)]" />
              {pagesContent.auth.login.badge}
            </span>
            <h1 className={`${dc.type.sectionTitle} mt-6 max-w-[540px]`}>
              {pagesContent.auth.login.title.split('.')[0]}
              <span className="italic text-[var(--slot4-muted-text)]">.</span>
            </h1>
            <p className="mt-6 max-w-[480px] text-[16px] leading-[1.7] text-[var(--slot4-muted-text)]">
              {pagesContent.auth.login.description}
            </p>
          </EditableReveal>
          <EditableReveal index={1}>
            <div className="rounded-[24px] border border-[var(--editable-border)] bg-white p-8">
              <h2 className="editable-display text-[24px] font-semibold tracking-[-0.02em]">{pagesContent.auth.login.formTitle}</h2>
              <EditableLocalLoginForm />
              <p className="mt-6 text-[14px] text-[var(--slot4-muted-text)]">
                New here?{' '}
                <Link href="/signup" className="font-medium text-[var(--slot4-page-text)] underline underline-offset-4">
                  {pagesContent.auth.login.createCta}
                </Link>
              </p>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
