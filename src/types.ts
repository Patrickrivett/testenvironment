export type ForwardMode = '' | 'all' | 'filter'

export type SocialAccount = {
  handle: string
  connected: boolean
  followers: string
}

export type OnboardingData = {
  // Account
  email: string
  password: string

  // Basics
  firstName: string
  lastName: string
  displayName: string
  dateOfBirth: string
  country: string
  city: string
  phone: string
  pronouns: string

  // Socials
  instagram: SocialAccount
  tiktok: SocialAccount
  youtube: SocialAccount
  portfolioUrl: string

  // Creator profile
  ugcTypes: string[]
  niches: string[]
  contentFormats: string[]
  experience: string
  typicalRate: string
  languages: string
  bio: string

  // Business / contract details
  legalName: string
  businessType: string
  businessName: string
  hasManager: boolean
  managerName: string
  managerEmail: string
  paymentTerms: string

  // Inbox
  inboxAddress: string
  forwardingConfirmed: boolean
  /** 'all' = Gmail forwards everything and we filter; 'filter' = user sets up a Gmail filter. */
  forwardMode: ForwardMode
  filterCreated: boolean
  testReceived: boolean

  // Consent
  consentProcessing: boolean
  consentAi: boolean
  consentRetention: boolean
  consentConfidentiality: boolean
}

export const emptySocial: SocialAccount = { handle: '', connected: false, followers: '' }

export const initialData: OnboardingData = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  displayName: '',
  dateOfBirth: '',
  country: '',
  city: '',
  phone: '',
  pronouns: '',
  instagram: { ...emptySocial },
  tiktok: { ...emptySocial },
  youtube: { ...emptySocial },
  portfolioUrl: '',
  ugcTypes: [],
  niches: [],
  contentFormats: [],
  experience: '',
  typicalRate: '',
  languages: '',
  bio: '',
  legalName: '',
  businessType: '',
  businessName: '',
  hasManager: false,
  managerName: '',
  managerEmail: '',
  paymentTerms: '',
  inboxAddress: '',
  forwardingConfirmed: false,
  forwardMode: '',
  filterCreated: false,
  testReceived: false,
  consentProcessing: false,
  consentAi: false,
  consentRetention: false,
  consentConfidentiality: false,
}

export type StepProps = {
  data: OnboardingData
  update: (patch: Partial<OnboardingData>) => void
  next: () => void
  back: () => void
}
