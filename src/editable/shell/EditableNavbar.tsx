'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, LogOut, Menu, PlusCircle, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const staticLinks = globalContent.nav.primaryLinks

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header
      className={[
        'sticky top-0 z-50 transition-[background,box-shadow,padding] duration-500',
        scrolled
          ? 'bg-[var(--slot4-page-bg)]/85 shadow-[0_1px_0_var(--editable-border)] backdrop-blur-xl'
          : 'bg-transparent',
      ].join(' ')}
    >
      <nav className="mx-auto flex min-h-[76px] w-full max-w-[var(--editable-container)] items-center gap-4 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[var(--editable-border)] transition duration-500 group-hover:rotate-[-8deg]">
            <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="editable-display block max-w-[220px] truncate text-[20px] font-semibold leading-none tracking-[-0.02em]">
              {SITE_CONFIG.name}
            </span>
            <span className="editable-eyebrow mt-1 block max-w-[220px] truncate">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </span>
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          {staticLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'relative px-4 py-2 text-[14px] font-medium transition duration-300',
                active(link.href) ? 'text-[var(--slot4-page-text)]' : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]',
              ].join(' ')}
            >
              {link.label}
              {active(link.href) && (
                <span className="absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full bg-[var(--slot4-page-text)]" />
              )}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 lg:ml-4">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] bg-white text-[var(--slot4-page-text)] transition duration-300 hover:bg-[var(--slot4-page-text)] hover:text-white"
          >
            <Search className="h-4 w-4" />
          </Link>

          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-1.5 rounded-full border border-[var(--editable-border)] bg-white px-4 py-2 text-[13px] font-medium text-[var(--slot4-page-text)] transition duration-300 hover:bg-[var(--slot4-page-text)] hover:text-white md:inline-flex"
              >
                <PlusCircle className="h-4 w-4" /> Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-1.5 rounded-full bg-[var(--slot4-page-text)] px-4 py-2 text-[13px] font-medium text-white transition duration-300 hover:bg-[var(--slot4-page-text)]/85 md:inline-flex"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-full border border-[var(--editable-border)] bg-white px-4 py-2 text-[13px] font-medium text-[var(--slot4-page-text)] transition duration-300 hover:bg-[var(--slot4-page-text)] hover:text-white md:inline-flex"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-1.5 rounded-full bg-[var(--slot4-page-text)] px-4 py-2 text-[13px] font-medium text-white transition duration-300 hover:bg-[var(--slot4-page-text)]/85 md:inline-flex"
              >
                <UserPlus className="h-4 w-4" /> Get started
              </Link>
            </>
          )}

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(v => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] bg-white text-[var(--slot4-page-text)] transition duration-300 hover:bg-[var(--slot4-page-text)] hover:text-white lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)] lg:hidden">
          <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col gap-1 px-4 py-6 sm:px-6">
            {staticLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'rounded-2xl px-4 py-3 text-[15px] font-medium transition duration-300',
                  active(link.href)
                    ? 'bg-[var(--slot4-page-text)] text-white'
                    : 'text-[var(--slot4-page-text)] hover:bg-white',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-[var(--editable-border)] pt-4">
              {session ? (
                <>
                  <Link href="/create" className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--editable-border)] bg-white px-4 py-3 text-[14px] font-medium">
                    <PlusCircle className="h-4 w-4" /> Submit an entry
                  </Link>
                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--slot4-page-text)] px-4 py-3 text-[14px] font-medium text-white"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--editable-border)] bg-white px-4 py-3 text-[14px] font-medium">
                    <LogIn className="h-4 w-4" /> Sign in
                  </Link>
                  <Link href="/signup" className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[var(--slot4-page-text)] px-4 py-3 text-[14px] font-medium text-white">
                    <UserPlus className="h-4 w-4" /> Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
