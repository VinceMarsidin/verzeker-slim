import type { Company } from '@/lib/types/insurance'

export const companies: Company[] = [
  // Suriname 
  {
    slug: 'assuria-suriname',
    name: 'Assuria',
    logoInitial: 'A',
    region: 'suriname',
    website: 'https://www.assuria.sr',
    description: 'Assuria is een van de grootste verzekeraars in Suriname met een breed aanbod aan schade- en levensverzekeringen.',
  },
  {
    slug: 'self-reliance',
    name: 'Self Reliance',
    logoInitial: 'S',
    region: 'suriname',
    website: 'https://www.selfreliance.sr',
    description: 'Self Reliance biedt betaalbare verzekeringen voor particulieren en bedrijven in Suriname.',
  },
  {
    slug: 'fatum-suriname',
    name: 'Fatum',
    logoInitial: 'F',
    region: 'suriname',
    website: 'https://www.fatum.com',
    description: 'Fatum Verzekeringen dekt motor, woon, reis en leven met uitgebreide polissen.',
  },
  {
    slug: 'parsasco',
    name: 'Parsasco',
    logoInitial: 'P',
    region: 'suriname',
    website: 'https://www.parsasco.com',
    description: 'Parsasco Verzekeringen bedient klanten in Suriname met schade- en levensproducten.',
  },

  // Aruba 
  {
    slug: 'nagico-aruba',
    name: 'Nagico',
    logoInitial: 'N',
    region: 'aruba',
    website: 'https://www.nagico.com/',
    description: 'Nagico Insurances biedt schadeverzekeringen op Aruba en in de rest van de Caraïben.',
  },

  {
    slug: 'pan-american-life-aruba',
    name: 'Pan-American Life Insurance Company',
    logoInitial: 'P',
    region: 'aruba',
    website: 'https://palig.com/en/aw/home',
    description: 'Pan-American Life biedt levens- en aanvullende verzekeringen op Aruba.',
  },
 
  {
    slug: 'sagicor-life-aruba',
    name: 'Sagicor Life',
    logoInitial: 'S',
    region: 'aruba',
    website: 'https://www.sagicor.com',
    description: 'Sagicor Life levert levensverzekeringen en spaarproducten op Aruba.',
  },

  // Curaçao 
  {
    slug: 'ennia-curacao',
    name: 'Ennia Insurance',
    logoInitial: 'E',
    region: 'curacao',
    website: 'https://www.ennia.com/?island=3',
    description: 'Ennia Insurance bedient Curaçao met motor-, woon- en levensverzekeringen.',
  },

  {
    slug: 'bsure-curacao',
    name: 'Bsure',
    logoInitial: 'B',
    region: 'curacao',
    website: 'https://www.bsure.cc/',
    description: 'Bsure is een lokale verzekeringsmakelaar op Curaçao met schade- en levensproducten.',
  },
  {
    slug: 'nagico-curacao',
    name: 'Nagico',
    logoInitial: 'N',
    region: 'curacao',
    website: 'https://www.nagico.com',
    description: 'Nagico biedt schadeverzekeringen voor motor, woon en reis op Curaçao.',
  },
  

  // Bonaire 
  {
    slug: 'ennia-bonaire',
    name: 'Ennia',
    logoInitial: 'E',
    region: 'bonaire',
    website: 'https://www.ennia.com',
    description: 'Ennia bedient Bonaire met schade- en levensverzekeringen.',
  },
   {
    slug: 'bsure-bonaire',
    name: 'Bsure',
    logoInitial: 'B',
    region: 'bonaire',
    website: 'https://www.bsurebonaire.com/',
    description: 'Bsure is een lokale verzekeringsmakelaar op Bonaire met schade- en levensproducten.',
  },
  {
    slug: 'boogaard-insurance',
    name: 'Boogaard Insurance',
    logoInitial: 'B',
    region: 'bonaire',
    website: 'https://boogaard-aruba.com/online-travel/en/',
    description: 'Boogaard Insurance is een onafhankelijke verzekeringsmakelaar op Bonaire.',
  },


  // Jamaica
  {
    slug: 'sagicor-jamaica',
    name: 'Sagicor',
    logoInitial: 'S',
    region: 'jamaica',
    website: 'https://www.sagicor.com/en-jm',
    description: 'Sagicor is een toonaangevende verzekeraar in Jamaica met schade- en levensproducten.',
  },

  {
    slug: 'advantage-general-jamaica',
    name: 'Advantage General Insurance Company',
    logoInitial: 'A',
    region: 'jamaica',
    website: 'https://www.advantagegeneral.com/',
    description: 'Advantage General is een van de grootste schadeverzekeraars in Jamaica.',
  },
  {
    slug: 'british-caribbean-insurance',
    name: 'British Caribbean Insurance Company',
    logoInitial: 'B',
    region: 'jamaica',
    website: 'https://bciconline.com/',
    description: 'BCIC biedt motor-, woon- en zakelijke verzekeringen in Jamaica.',
  },

  // Trinidad & Tobago (existing + new)
 
  {
    slug: 'sagicor-trinidad',
    name: 'Sagicor Trinidad',
    logoInitial: 'S',
    region: 'trinidad',
    website: 'https://www.sagicor.com/en-tt',
    description: 'Sagicor Trinidad levert schade- en levensverzekeringen in Trinidad & Tobago.',
  },
  {
    slug: 'nagico-trinidad',
    name: 'Nagico',
    logoInitial: 'N',
    region: 'trinidad',
    website: 'https://www.nagico.com/?territory=trinidad-tobago',
    description: 'Nagico bedient Trinidad & Tobago met schadeverzekeringen.',
  },
 
  {
    slug: 'maritime-financial-group',
    name: 'Maritime Financial Group',
    logoInitial: 'M',
    region: 'trinidad',
    website: 'https://maritimefinancial.com/maritime-general/',
    description: 'Maritime Financial Group levert verzekeringen en financiële diensten in Trinidad & Tobago.',
  },

  // Guyana 
  {
    slug: 'assuria-guyana',
    name: 'Assuria Guyana',
    logoInitial: 'A',
    region: 'guyana',
    website: 'https://www.assuria.gy',
    description: 'Assuria Guyana biedt schade- en levensverzekeringen in Guyana.',
  },
  {
    slug: 'cg-united-insurance',
    name: 'CG United Insurance',
    logoInitial: 'C',
    region: 'guyana',
    website: 'https://gy.cgcoralisle.com/',
    description: 'CG United Insurance levert motor-, woon- en zakelijke verzekeringen in Guyana.',
  },
  {
    slug: 'hand-in-hand-guyana',
    name: 'Hand in Hand Mutual Fire and Life',
    logoInitial: 'H',
    region: 'guyana',
    website: 'https://hihgy.com/',
    description: 'Hand in Hand Mutual biedt brand-, levens- en schadeverzekeringen in Guyana.',
  },

  // French Guiana 
  {
    slug: 'groupama-antilles-guyane',
    name: 'Groupama Antilles-Guyane',
    logoInitial: 'G',
    region: 'french-guiana',
    website: 'https://www.groupama.fr',
    description: 'Groupama Antilles-Guyane bedient Frans-Guyana met auto-, woon- en levensverzekeringen.',
  },
  {
    slug: 'allianz-guyane',
    name: 'Allianz Guyane',
    logoInitial: 'A',
    region: 'french-guiana',
    website: 'https://agence.allianz.fr/cayenne-97300-IA5000100',
    description: 'Allianz Guyane levert schade- en levensverzekeringen in Frans-Guyana.',
  },
  {
    slug: 'gmf-assurances',
    name: 'GMF Assurances',
    logoInitial: 'G',
    region: 'french-guiana',
    website: 'https://www.gmf.fr/agences-gmf/assurance-cayenne',
    description: 'GMF Assurances biedt motor-, woon- en levensverzekeringen in Frans-Guyana.',
  },
]

export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug)
}

export function getCompaniesByRegion(region: string): Company[] {
  return companies.filter((c) => c.region === region)
}
