'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'

export function EditableFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto w-full max-w-[var(--editable-container)] px-4 pt-14 sm:px-6 lg:px-10">
        <div className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="editable-eyebrow text-white/60">Ready to explore</p>
            <h3 className="editable-display mt-3 max-w-[560px] text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] text-white sm:text-[26px] lg:text-[30px]">
              A calm directory. A curated library. One place to start.
            </h3>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:justify-end">
            <Link
              href="/listing"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-[14px] font-medium text-[var(--slot4-page-text)] transition duration-500 hover:gap-4"
            >
              Browse the directory
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-45" />
            </Link>
            <Link
              href="/pdf"
              className="group inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-[14px] font-medium text-white transition duration-500 hover:gap-4 hover:bg-white/5"
            >
              Open the library
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-45" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.6fr_1fr_1fr_1fr] lg:px-10">
        <div className="max-w-[380px]">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white">
              <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain" />
            </span>
            <span className="editable-display truncate text-[24px] font-semibold tracking-[-0.02em] text-white">
              {SITE_CONFIG.name}
            </span>
          </Link>
          <p className="mt-6 text-[15px] leading-[1.65] text-white/70">
            {globalContent.footer?.description}
          </p>
          <p className="editable-eyebrow mt-6 text-white/50">
            {globalContent.footer?.tagline}
          </p>
        </div>

        {globalContent.footer?.columns?.map(column => (
          <div key={column.title}>
            <p className="editable-eyebrow text-white/60">{column.title}</p>
            <ul className="mt-5 flex flex-col gap-3">
              {column.links.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-white/85 transition duration-300 hover:text-white"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition duration-300 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col gap-3 px-4 py-8 text-[13px] text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <p>
            © {year} {SITE_CONFIG.name}. {globalContent.footer?.bottomNote}
          </p>
          <p className="text-white/40">{SITE_CONFIG.domain}</p>
        </div>
      </div>
    </footer>
  )
}
