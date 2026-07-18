import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Editorial',
    headline: 'Long reads worth your time.',
    description: 'Guides, essays, and stories about the places and documents in the library.',
    filterLabel: 'Filter by topic',
    secondaryNote: 'Editorial pacing, no filler.',
    chips: ['Long-form', 'Guides', 'Essays'],
  },
  classified: {
    eyebrow: 'Notices',
    headline: 'Short notices and time-sensitive posts.',
    description: 'Quick notices, offers, and updates worth surfacing on a directory.',
    filterLabel: 'Filter notices',
    secondaryNote: 'Prioritize scan-ability.',
    chips: ['Notices', 'Offers', 'Updates'],
  },
  sbm: {
    eyebrow: 'Bookmarks',
    headline: 'Curated links and outside resources.',
    description: 'Off-site references worth keeping close to the directory.',
    filterLabel: 'Filter bookmarks',
    secondaryNote: 'Curated, not scraped.',
    chips: ['Curated', 'Off-site', 'References'],
  },
  profile: {
    eyebrow: 'People',
    headline: 'The people behind the entries.',
    description: 'Profiles for owners, contributors, and researchers featured across the directory and library.',
    filterLabel: 'Filter people',
    secondaryNote: 'Identity first.',
    chips: ['Owners', 'Contributors', 'Researchers'],
  },
  pdf: {
    eyebrow: 'Reference Library',
    headline: 'A searchable library of reference documents.',
    description: 'Guides, reports, and references — organized by category, previewed inline, downloaded with one tap.',
    filterLabel: 'Filter the library',
    secondaryNote: 'Every entry is a real, downloadable document.',
    chips: ['Guides', 'Reports', 'Reference'],
  },
  listing: {
    eyebrow: 'Local Directory',
    headline: 'A directory of trusted local places.',
    description: 'Verified entries with real details — address, hours, contact — organized by category so you can find what you need quickly.',
    filterLabel: 'Filter the directory',
    secondaryNote: 'Every listing is checked before it goes live.',
    chips: ['Verified', 'Local', 'Directory'],
  },
  image: {
    eyebrow: 'Gallery',
    headline: 'Visual notes from around the directory.',
    description: 'A visual index of the places and documents in the library.',
    filterLabel: 'Filter the gallery',
    secondaryNote: 'Visual first.',
    chips: ['Gallery', 'Visual', 'Index'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
