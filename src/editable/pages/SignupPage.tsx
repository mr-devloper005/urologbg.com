import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Get started', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen">
        <section className={`${dc.shell.section} grid min-h-[calc(100vh-8rem)] items-center gap-14 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:py-24`}>
          <EditableReveal index={0}>
            <div className="rounded-[24px] border border-[var(--editable-border)] bg-white p-8">
              <h1 className="editable-display text-[24px] font-semibold tracking-[-0.02em]">{pagesContent.auth.signup.formTitle}</h1>
              <EditableLocalSignupForm />
              <p className="mt-6 text-[14px] text-[var(--slot4-muted-text)]">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-[var(--slot4-page-text)] underline underline-offset-4">
                  {pagesContent.auth.signup.loginCta}
                </Link>
              </p>
            </div>
          </EditableReveal>
          <EditableReveal index={1}>
            <span className={dc.badge.pill}>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--slot4-accent-soft)]" />
              {pagesContent.auth.signup.badge}
            </span>
            <h2 className={`${dc.type.sectionTitle} mt-6 max-w-[540px]`}>
              {pagesContent.auth.signup.title.split('.')[0]}
              <span className="italic text-[var(--slot4-muted-text)]">.</span>
            </h2>
            <p className="mt-6 max-w-[480px] text-[16px] leading-[1.7] text-[var(--slot4-muted-text)]">
              {pagesContent.auth.signup.description}
            </p>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
