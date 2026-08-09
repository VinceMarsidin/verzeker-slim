export const insuranceTypes = [
  { value: 'motor', label: 'Motor' },
  { value: 'reis', label: 'Reis' },
  { value: 'woon', label: 'Woon' },
  { value: 'leven', label: 'Leven' },
] as const

export type InsuranceType = (typeof insuranceTypes)[number]['value']

export const regions = [
  { value: 'suriname', label: 'Suriname', flag: '🇸🇷', currency: 'SRD' },
  { value: 'aruba', label: 'Aruba', flag: '🇦🇼', currency: 'AWG' },
  { value: 'curacao', label: 'Curaçao', flag: '🇨🇼', currency: 'ANG' },
  { value: 'bonaire', label: 'Bonaire', flag: '🇧🇶', currency: 'USD' },
  { value: 'trinidad', label: 'Trinidad & Tobago', flag: '🇹🇹', currency: 'TTD' },
  { value: 'jamaica', label: 'Jamaica', flag: '🇯🇲', currency: 'JMD' },
  { value: 'guyana', label: 'Guyana', flag: '🇬🇾', currency: 'GYD' },
  { value: 'french-guiana', label: 'Frans-Guyana', flag: '🇬🇫', currency: 'EUR' },
] as const

export type Region = (typeof regions)[number]['value']

export type QuoteBadge = 'populair' | 'beste prijs' | 'beste dekking'

export type SortKey = 'price-asc' | 'price-desc' | 'rating-desc'

export interface Company {
  slug: string
  name: string
  logoInitial: string
  region: Region
  website: string
  description: string
}

export interface Quote {
  companySlug: string
  insurer: string
  logoInitial: string
  monthlyPremium: number
  currency: string
  deductible: number
  rating: number
  coverage: string[]
  badge?: QuoteBadge
  insuranceType?: InsuranceType
}

export interface Review {
  id: number
  companySlug: string
  userId: string
  userName: string
  rating: number
  title: string
  body: string
  createdAt: Date
}
