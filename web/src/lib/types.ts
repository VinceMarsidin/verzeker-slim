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
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  createdAt: string
}

export type SectieId = 'premies' | 'maatschappijen' | 'contact'
