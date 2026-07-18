import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'A curated directory & reference library',
      description: 'Discover trusted places in the Local Directory and download curated documents from the Reference Library — one calm home for both.',
      openGraphTitle: 'A curated directory & reference library',
      openGraphDescription: 'One calm home for a trusted local directory and a searchable library of reference documents.',
      keywords: ['local directory', 'reference library', 'business directory', 'document library', 'downloadable guides'],
    },
    hero: {
      badge: 'Directory · Reference library',
      title: ['Find trusted places.', 'Download curated references.'],
      description:
        'A calmer way to browse a hand-picked local directory and a searchable library of reference documents — verified entries, real details, no clutter.',
      primaryCta: { label: 'Browse the directory', href: '/listing' },
      secondaryCta: { label: 'Open the library', href: '/pdf' },
      searchPlaceholder: 'Search places, categories, or documents',
      focusLabel: 'Focus',
      featureCardBadge: 'This week',
      featureCardTitle: 'Fresh entries and new reference documents added weekly.',
      featureCardDescription: 'Curated additions keep the directory dependable and the reference library useful — nothing filler.',
    },
    intro: {
      badge: 'About the platform',
      title: 'A quiet home for a directory and a reference library.',
      paragraphs: [
        'Every entry in the Local Directory is checked before it appears — real addresses, real details, category and location clear at a glance.',
        'The Reference Library gathers documents worth keeping: guides, references, reports. Preview inline, or download the PDF with one tap.',
        'Both surfaces share the same calm rhythm so browsing the two feels like one continuous experience.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Verified local directory with location, hours, and contact detail.',
        'Reference library with inline preview and one-tap download.',
        'One search across places and documents.',
        'Category filters that actually mean something.',
      ],
      primaryLink: { label: 'Browse the directory', href: '/listing' },
      secondaryLink: { label: 'Open the library', href: '/pdf' },
    },
    cta: {
      badge: 'Ready to explore',
      title: 'Two calm surfaces. One place to start.',
      description: 'Jump into the Local Directory to find a trusted place, or open the Reference Library to download the document you need.',
      primaryCta: { label: 'Browse the directory', href: '/listing' },
      secondaryCta: { label: 'Open the library', href: '/pdf' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Fresh entries added regularly.',
    },
  },
  about: {
    badge: 'About',
    title: 'A calmer way to discover what matters.',
    description: `${slot4BrandConfig.siteName} is a small, carefully curated place to explore useful things — organized, verified, and free of noise.`,
    paragraphs: [
      'Everything you see here is picked and reviewed by real people. If it looks out of date, it usually is not — we check entries regularly and keep the shelves tidy.',
      'The experience is designed around clarity: clean typography, simple navigation, and no distractions. You come here to find something. We try to get out of your way while you do.',
      'Whether you are looking for a place, a document, or an answer, everything is one calm search away.',
    ],
    values: [
      { title: 'Curated by hand', description: 'Real people review every entry before it appears — and revisit it when things change.' },
      { title: 'Search that just works', description: 'One search box, sensible filters, and results that stay relevant.' },
      { title: 'Calm by design', description: 'No autoplay, no popups, no dark patterns. Just what you came for.' },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Suggest an entry. Report a change. Send a document.',
    description:
      'Tell us the place we should add, the listing we should fix, or the reference document we should host. We route each request to the right lane instead of sending everything to the same inbox.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search across the local directory and the reference library.',
    },
    hero: {
      badge: 'One search',
      title: 'Find a place, or the document that goes with it.',
      description: 'Search across every verified directory entry and every reference document in one place.',
      placeholder: 'Search places, categories, or documents',
    },
    resultsTitle: 'Latest matching entries',
  },
  create: {
    metadata: {
      title: 'Submit',
      description: 'Suggest a directory entry or a reference document.',
    },
    locked: {
      badge: 'Sign in required',
      title: 'Sign in to suggest an entry.',
      description: 'Use your account to open the submission form and suggest a place for the directory or a document for the reference library.',
    },
    hero: {
      badge: 'Submit',
      title: 'Suggest a directory entry or a reference document.',
      description: 'Pick the surface, add the details, and send it. Every submission is reviewed before it goes live.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Send for review',
    successTitle: 'Thanks — your submission is in review.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to your account.',
      badge: 'Member area',
      title: 'Welcome back.',
      description: 'Sign in to save entries, download documents faster, and submit new suggestions.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched those details. Create one first, then sign in.',
      success: 'Signed in. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create an account.',
      badge: 'Get started',
      title: 'Create an account.',
      description: 'A quick account lets you save entries, download documents, and suggest additions.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting...',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Keep reading',
      fallbackTitle: 'Reading',
    },
    listing: {
      relatedTitle: 'More in the directory',
      fallbackTitle: 'Directory entry',
    },
    image: {
      relatedTitle: 'More visuals',
      fallbackTitle: 'Image',
    },
    profile: {
      relatedTitle: 'Suggested reading',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
