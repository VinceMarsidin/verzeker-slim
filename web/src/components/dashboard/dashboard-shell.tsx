import { useState } from 'react'
import { Banknote, Building2, LogOut, Mail } from 'lucide-react'

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
  const initiaal = adminName.trim().charAt(0).toUpperCase() || 'A'

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8 min-w-0">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                V
              </div>
              <span className="font-semibold text-slate-900 text-sm tracking-tight hidden sm:block">
                VerzekerSlim
              </span>
            </div>

            <nav className="flex items-center gap-1 bg-slate-100/80 rounded-full p-1">
              {secties.map((sectie) => {
                const Icon = sectie.icon
                const isActief = actieveSectie === sectie.id
                return (
                  <button
                    key={sectie.id}
                    onClick={() => setActieveSectie(sectie.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                      isActief
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-500 hover:text-blue-700'
                    }`}
                  >
                    <Icon size={14} strokeWidth={2.25} />
                    <span className="hidden md:inline">{sectie.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-semibold">
              {initiaal}
            </div>
            <button
              onClick={() => void authClient.signOut()}
              className="text-slate-400 hover:text-blue-700 transition-colors"
              aria-label="Uitloggen"
              title="Uitloggen"
            >
              <LogOut size={17} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {actieveSectie === 'premies' && <PremiesSectie />}
        {actieveSectie === 'maatschappijen' && <MaatschappijenSectie />}
        {actieveSectie === 'contact' && <ContactSectie />}
      </main>
    </div>
  )
}


