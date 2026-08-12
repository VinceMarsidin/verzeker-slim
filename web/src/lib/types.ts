export interface Maatschappij {
  id: number
  naam: string
  logoUrl: string | null
  contactEmail: string | null
}

export interface Premie {
  id: number
  categorie: string
  type: string
  premieBedrag: string
  maatschappijId: number
  maatschappijNaam: string | null
}

export interface ContactBericht {
  id: number
  naam: string
  email: string
  bericht: string
  createdAt: string
}

export interface ReviewAdmin {
  id: number
  companyName: string
  companySlug: string
  userName: string
  rating: number
  title: string
  body: string
  createdAt: Date | null
}

export type SectieId = 'premies' | 'maatschappijen' | 'contact' | 'reviews'