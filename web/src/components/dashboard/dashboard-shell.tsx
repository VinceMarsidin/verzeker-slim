import { useState } from 'react'
import { Banknote, Building2, LogOut, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Footer } from '@/components/layout/footer'
import { authClient } from '#/lib/auth-client'
import type { SectieId } from '#/lib/types'

import { MaatschappijenSectie } from './maatschappijen-sectie'
import { PremiesSectie } from './premies-sectie'
import { ContactSectie } from './contact-sectie'

const secties: { id: SectieId; label: string; icon: typeof Banknote }[] = [
  { id: 'premies', label: 'Premies', icon: Banknote },
  { id: 'maatschappijen', label: 'Maatschappijen', icon: Building2 },
  { id: 'contact', label: 'Contact', icon: Mail },
]

export function DashboardShell({ adminName }: { adminName: string }) {
  const [actieveSectie, setActieveSectie] = useState<SectieId>('premies')

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink antialiased">
      {/* Zelfde header-opbouw als de publieke Navbar: font-slab logo,
          sticky, paper/95 backdrop-blur */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper/95 px-8 py-4 backdrop-blur-md">
        <span className="font-slab text-lg font-bold text-ink">
          Verzeker<span className="text-stamp-dark">Slim</span>
        </span>

        <nav className="flex items-center gap-2">
          {secties.map((sectie) => {
            const Icon = sectie.icon
            const isActief = actieveSectie === sectie.id
            return (
              <button
                key={sectie.id}
                onClick={() => setActieveSectie(sectie.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  isActief
                    ? 'bg-white text-ink shadow-[0_2px_8px_rgba(13,59,102,0.10)]'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                <Icon className="h-4 w-4" />
                {sectie.label}
              </button>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-ink-soft sm:block">{adminName}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => void authClient.signOut()}
          >
            <LogOut className="h-4 w-4" />
            Uitloggen
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-8 py-10">
        {actieveSectie === 'premies' && <PremiesSectie />}
        {actieveSectie === 'maatschappijen' && <MaatschappijenSectie />}
        {actieveSectie === 'contact' && <ContactSectie />}
      </main>

      <Footer />
    </div>
  )
}
