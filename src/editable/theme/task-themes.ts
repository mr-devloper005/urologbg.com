import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Wordcraft editorial reference — one shared visual language.
  Warm-dark ink on pale warm gray, soft-rounded 20px cards, Poppins display,
  Inter body. Only kicker/note vary per task; visual tokens are shared.
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY = "'Poppins', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
const BODY = "'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY,
  fontBody: BODY,
  bg: '#f3f3f3',
  surface: '#ffffff',
  raised: '#ffffff',
  text: '#0c0407',
  muted: '#4c4c4c',
  line: 'rgba(12,4,7,0.08)',
  accent: '#0c0407',
  accentSoft: '#f7d046',
  onAccent: '#ffffff',
  glow: 'rgba(12,4,7,0.06)',
  radius: '1.25rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Editorial', note: 'Long-form reads worth your time.' },
  listing: { ...base, kicker: 'Local Directory', note: 'Directory of trusted places, verified and searchable.' },
  classified: { ...base, kicker: 'Marketplace', note: 'Fresh offers curated for you.' },
  image: { ...base, kicker: 'Gallery', note: 'A visual feed of standout imagery.' },
  sbm: { ...base, kicker: 'Bookmarks', note: 'Handpicked links worth saving.' },
  pdf: { ...base, kicker: 'Reference Library', note: 'Curated reference documents ready to download.' },
  profile: { ...base, kicker: 'People', note: 'Meet the makers behind the work.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
