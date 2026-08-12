import { useState } from 'react'
import { Banknote, Building2, Mail, Star } from 'lucide-react'

import type { SectieId } from '#/lib/types'

import { MaatschappijenSectie } from './maatschappijen-sectie'
import { PremiesSectie } from './premies-sectie'
import { ContactSectie } from './contact-sectie'
import { ReviewsSectie } from './reviews-sectie'

const secties: {
  id: SectieId
  label: string
  icon: typeof Banknote
}[] = [
    {
      id: 'premies',
      label: 'Premies',
      icon: Banknote,
    },
    {
      id: 'maatschappijen',
      label: 'Maatschappijen',
      icon: Building2,
    },
    {
      id: 'reviews',
      label: 'Reviews',
      icon: Star,
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: Mail,
    },
  ]

export function DashboardShell() {
  const [actieveSectie, setActieveSectie] =
    useState<SectieId>('premies')

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-8 py-10">
      {/* Dashboard navigatie */}
      <div className="mb-8 flex gap-2">
        {secties.map((sectie) => {
          const Icon = sectie.icon
          const isActief = actieveSectie === sectie.id

          return (
            <button
              key={sectie.id}
              onClick={() => setActieveSectie(sectie.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${isActief
                  ? 'bg-white text-ink shadow-[0_2px_8px_rgba(13,59,102,0.10)]'
                  : 'text-ink-soft hover:text-ink'
                }`}
            >
              <Icon className="h-4 w-4" />
              {sectie.label}
            </button>
          )
        })}
      </div>

      {/* Dashboard inhoud */}
      {actieveSectie === 'premies' && <PremiesSectie />}

      {actieveSectie === 'maatschappijen' && (
        <MaatschappijenSectie />
      )}

      {actieveSectie === 'reviews' && <ReviewsSectie />}

      {actieveSectie === 'contact' && <ContactSectie />}
    </main>
  )
}
