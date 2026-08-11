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

export type SectieId = 'premies' | 'maatschappijen' | 'contact'