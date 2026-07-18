import type { CSSProperties } from 'react'

/*
  Wordcraft editorial reference tokens.
  Warm-dark ink on pale warm-gray page, soft-rounded 20-24px cards,
  pill buttons, Poppins display + Inter body.
*/

export const editableRootStyle = {
  '--slot4-page-bg': '#f3f3f3',
  '--slot4-page-text': '#0c0407',
  '--slot4-panel-bg': '#ffffff',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#4c4c4c',
  '--slot4-soft-muted-text': '#7a7a7a',
  '--slot4-accent': '#0c0407',
  '--slot4-accent-fill': '#0c0407',
  '--slot4-accent-soft': '#f7d046',
  '--slot4-on-accent': '#ffffff',
  '--slot4-warm-yellow': '#f7d046',
  '--slot4-hot': '#ff5a1f',
  '--slot4-dark-bg': '#0c0407',
  '--slot4-dark-text': '#f3f3f3',
  '--slot4-media-bg': '#ececec',
  '--slot4-cream': '#faf8f4',
  '--slot4-warm': '#f3f3f3',
  '--slot4-lavender': '#ffffff',
  '--slot4-gray': '#ececec',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#f3f3f3',
  '--editable-page-text': '#0c0407',
  '--editable-container': '1280px',
  '--editable-border': 'rgba(12,4,7,0.08)',
  '--editable-nav-bg': '#f3f3f3',
  '--editable-nav-text': '#0c0407',
  '--editable-nav-active': '#0c0407',
  '--editable-nav-active-text': '#ffffff',
  '--editable-cta-bg': '#0c0407',
  '--editable-cta-text': '#ffffff',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#0c0407',
  '--editable-footer-text': '#f3f3f3',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_1px_3px_rgba(12,4,7,0.04)]',
  shadowStrong: 'shadow-[0_18px_60px_-30px_rgba(12,4,7,0.35)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(12,4,7,0)_0%,rgba(12,4,7,0.72)_100%)]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10',
    sectionY: 'py-14 sm:py-20 lg:py-28',
    sectionYLg: 'py-20 sm:py-28 lg:py-36',
    sectionYSm: 'py-10 sm:py-14 lg:py-16',
  },
  layout: {
    safeGrid: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center',
    rail: 'flex snap-x gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    eyebrow: 'text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]',
    heroTitle: 'font-[var(--editable-font-display)] text-[44px] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-[64px] lg:text-[88px]',
    sectionTitle: 'font-[var(--editable-font-display)] text-[36px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[48px] lg:text-[60px]',
    subsectionTitle: 'font-[var(--editable-font-display)] text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[32px]',
    cardTitle: 'font-[var(--editable-font-display)] text-[22px] font-medium leading-[1.2] tracking-[-0.02em] sm:text-[24px]',
    body: 'text-[16px] leading-[1.7] text-[var(--slot4-muted-text)]',
    emphasis: 'font-[var(--editable-font-display)] text-[22px] leading-[1.4] tracking-[-0.015em] text-[var(--slot4-page-text)]',
  },
  surface: {
    card: `rounded-[20px] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    soft: `rounded-[20px] ${editablePalette.panelBg}`,
    dark: `rounded-[20px] ${editablePalette.darkBg} ${editablePalette.darkText}`,
    outline: `rounded-[20px] border ${editablePalette.border}`,
  },
  badge: {
    pill: 'inline-flex items-center gap-1.5 rounded-full border border-[var(--editable-border)] bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]',
    accentPill: 'inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-page-text)]',
    darkPill: 'inline-flex items-center gap-1.5 rounded-full bg-[var(--slot4-page-text)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white',
  },
  button: {
    primary: 'group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-3 text-[14px] font-medium text-white transition duration-300 hover:bg-[var(--slot4-page-text)]/85 active:scale-[0.98]',
    secondary: 'group inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-6 py-3 text-[14px] font-medium text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-page-text)] active:scale-[0.98]',
    accent: 'group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-6 py-3 text-[14px] font-semibold text-[var(--slot4-page-text)] transition duration-300 hover:brightness-95 active:scale-[0.98]',
    ghost: 'group inline-flex items-center gap-2 text-[14px] font-medium text-[var(--slot4-page-text)] transition duration-300 hover:opacity-70',
  },
  media: {
    frame: `relative overflow-hidden rounded-[20px] ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden rounded-[24px] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/5]',
    ratioWide: 'aspect-[16/10]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1',
    fade: 'transition duration-500 hover:opacity-80',
    zoom: 'transition duration-700 group-hover:scale-[1.04]',
  },
} as const

export const aiLayoutRules = [
  'Every color comes from --slot4-* CSS vars set here. Never hardcode hex.',
  'Every font family comes from --editable-font-display / --editable-font-body.',
  'All buttons are pill (rounded-full). All cards are 20px radius with hairline border.',
  'Wrap section headers and grid items in EditableReveal with index props for stagger.',
] as const
