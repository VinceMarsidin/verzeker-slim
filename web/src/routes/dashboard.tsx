import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { authClient } from '#/lib/auth-client'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Maatschappij {
  id: number
  naam: string
  logoUrl: string | null
  contactEmail: string | null
}

interface Premie {
  id: number
  categorie: string
  type: string
  premieBedrag: string
  maatschappijId: number
  maatschappijNaam: string | null
}

interface ContactBericht {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  createdAt: string
}

type SectieId = 'premies' | 'maatschappijen' | 'contact'

const sectieTitels: Record<SectieId, string> = {
  premies: 'Premies Beheren',
  maatschappijen: 'Maatschappijen Beheren',
  contact: 'Contactaanvragen',
}

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

// ---------------------------------------------------------------------------
// Root component: auth-guard, daarna het echte dashboard
// ---------------------------------------------------------------------------
function DashboardPage() {
  // TIJDELIJK: guard uitgeschakeld om aan het design te werken
  return <DashboardShell adminName="Test Admin" />
}

// ---------------------------------------------------------------------------
// Dashboard shell: sidebar + content area
// ---------------------------------------------------------------------------

function DashboardShell({ adminName }: { adminName: string }) {
  const [actieveSectie, setActieveSectie] = useState<SectieId>('premies')

  return (
    <div className="min-h-screen flex bg-[#f4f7f9]">
      <aside className="w-64 shrink-0 bg-[#002b56] text-white flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <h3 className="text-lg font-bold">VerzekerSlim</h3>
          <p className="text-xs text-white/50 mt-1">Beheerpaneel</p>
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
          <NavItem
            label="Premies"
            active={actieveSectie === 'premies'}
            onClick={() => setActieveSectie('premies')}
          />
          <NavItem
            label="Maatschappijen"
            active={actieveSectie === 'maatschappijen'}
            onClick={() => setActieveSectie('maatschappijen')}
          />
          <NavItem
            label="Contact Berichten"
            active={actieveSectie === 'contact'}
            onClick={() => setActieveSectie('contact')}
          />
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => void authClient.signOut()}
            className="w-full text-left px-4 py-3 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            Uitloggen
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-slate-200">
          <h2 className="text-xl font-bold text-[#004080]">
            {sectieTitels[actieveSectie]}
          </h2>
          <div className="text-sm text-slate-500">
            Ingelogd als <strong className="text-slate-700">{adminName}</strong>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          {actieveSectie === 'premies' && <PremiesSectie />}
          {actieveSectie === 'maatschappijen' && <MaatschappijenSectie />}
          {actieveSectie === 'contact' && <ContactSectie />}
        </div>
      </main>
    </div>
  )
}

function NavItem({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition ${
        active
          ? 'bg-[#ff8c00] text-white'
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Kleine, herbruikbare UI-stukjes
// ---------------------------------------------------------------------------

function SectionHeader({
  title,
  onAdd,
  addLabel,
}: {
  title: string
  onAdd?: () => void
  addLabel?: string
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-bold text-[#004080]">{title}</h3>
      {onAdd && (
        <button
          onClick={onAdd}
          className="bg-[#ff8c00] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#e67e00] transition"
        >
          + {addLabel}
        </button>
      )}
    </div>
  )
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-[#004080]">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function FormField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full px-4 py-3 border-2 border-slate-200 rounded-xl outline-none focus:border-[#ff8c00] transition text-sm'

// ---------------------------------------------------------------------------
// Sectie: Maatschappijen
// ---------------------------------------------------------------------------

function MaatschappijenSectie() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Maatschappij | null>(null)

  const { data: maatschappijen = [], isLoading } = useQuery<Maatschappij[]>({
    queryKey: ['dashboard', 'maatschappijen'],
    queryFn: async () => {
      const res = await fetch('/api/maatschappijen')
      if (!res.ok) throw new Error('Fout bij ophalen maatschappijen')
      return res.json()
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (data: {
      id?: number
      naam: string
      logoUrl: string
      contactEmail: string
    }) => {
      const url = data.id
        ? `/api/maatschappijen/${data.id}`
        : '/api/maatschappijen'
      const res = await fetch(url, {
        method: data.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Opslaan mislukt')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'maatschappijen'] })
      setModalOpen(false)
      setEditing(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/maatschappijen/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Verwijderen mislukt')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'maatschappijen'] })
    },
  })

  const openNew = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (m: Maatschappij) => {
    setEditing(m)
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    saveMutation.mutate({
      id: editing?.id,
      naam: String(form.get('naam') || ''),
      logoUrl: String(form.get('logoUrl') || ''),
      contactEmail: String(form.get('contactEmail') || ''),
    })
  }

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm">
      <SectionHeader
        title="Overzicht Maatschappijen"
        onAdd={openNew}
        addLabel="Nieuwe Maatschappij"
      />

      {isLoading ? (
        <p className="text-slate-500 text-sm">Data laden...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#004080] text-white text-xs uppercase tracking-wider">
                <th className="p-3 text-left">Naam</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Acties</th>
              </tr>
            </thead>
            <tbody>
              {maatschappijen.map((m) => (
                <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 font-semibold text-[#004080]">{m.naam}</td>
                  <td className="p-3 text-slate-600">{m.contactEmail || '—'}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(m)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                      >
                        Bewerken
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Weet je zeker dat je deze maatschappij wilt verwijderen?')) {
                            deleteMutation.mutate(m.id)
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium"
                      >
                        Verwijderen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {maatschappijen.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-slate-400">
                    Nog geen maatschappijen toegevoegd.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal
          title={editing ? 'Maatschappij Bewerken' : 'Nieuwe Maatschappij'}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit}>
            <FormField label="Naam Maatschappij">
              <input
                name="naam"
                defaultValue={editing?.naam}
                required
                placeholder="Bijv. Assuria"
                className={inputClass}
              />
            </FormField>
            <FormField label="Logo URL">
              <input
                name="logoUrl"
                defaultValue={editing?.logoUrl ?? ''}
                placeholder="/img/logos/naam.png"
                className={inputClass}
              />
            </FormField>
            <FormField label="Contact Email">
              <input
                name="contactEmail"
                type="email"
                defaultValue={editing?.contactEmail ?? ''}
                placeholder="info@bedrijf.sr"
                className={inputClass}
              />
            </FormField>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Annuleren
              </button>
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#004080] text-white hover:bg-[#0066cc] disabled:opacity-50"
              >
                {saveMutation.isPending ? 'Opslaan...' : 'Opslaan'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Sectie: Premies
// ---------------------------------------------------------------------------

function PremiesSectie() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Premie | null>(null)

  const { data: maatschappijen = [] } = useQuery<Maatschappij[]>({
    queryKey: ['dashboard', 'maatschappijen'],
    queryFn: async () => {
      const res = await fetch('/api/maatschappijen')
      if (!res.ok) throw new Error('Fout bij ophalen maatschappijen')
      return res.json()
    },
  })

  const { data: premies = [], isLoading } = useQuery<Premie[]>({
    queryKey: ['dashboard', 'premies'],
    queryFn: async () => {
      const res = await fetch('/api/premies')
      if (!res.ok) throw new Error('Fout bij ophalen premies')
      return res.json()
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (data: {
      id?: number
      categorie: string
      type: string
      premieBedrag: string
      maatschappijId: number
    }) => {
      const url = data.id ? `/api/premies/${data.id}` : '/api/premies'
      const res = await fetch(url, {
        method: data.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Opslaan mislukt')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'premies'] })
      setModalOpen(false)
      setEditing(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/premies/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Verwijderen mislukt')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'premies'] })
    },
  })

  const openNew = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (p: Premie) => {
    setEditing(p)
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    saveMutation.mutate({
      id: editing?.id,
      categorie: String(form.get('categorie') || ''),
      type: String(form.get('type') || ''),
      premieBedrag: String(form.get('premieBedrag') || ''),
      maatschappijId: Number(form.get('maatschappijId')),
    })
  }

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm">
      <SectionHeader title="Overzicht Premies" onAdd={openNew} addLabel="Nieuwe Premie" />

      {isLoading ? (
        <p className="text-slate-500 text-sm">Data laden...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#004080] text-white text-xs uppercase tracking-wider">
                <th className="p-3 text-left">Maatschappij</th>
                <th className="p-3 text-left">Categorie</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Premie</th>
                <th className="p-3 text-left">Acties</th>
              </tr>
            </thead>
            <tbody>
              {premies.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 font-semibold text-[#004080]">
                    {p.maatschappijNaam || 'Onbekend'}
                  </td>
                  <td className="p-3 text-slate-600 capitalize">{p.categorie}</td>
                  <td className="p-3 text-slate-600">{p.type}</td>
                  <td className="p-3 text-slate-600">{p.premieBedrag}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                      >
                        Bewerken
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Weet je zeker dat je deze premie wilt verwijderen?')) {
                            deleteMutation.mutate(p.id)
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium"
                      >
                        Verwijderen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {premies.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    Nog geen premies toegevoegd.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal
          title={editing ? 'Premie Bewerken' : 'Nieuwe Premie Toevoegen'}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit}>
            <FormField label="Verzekeringsmaatschappij">
              <select
                name="maatschappijId"
                defaultValue={editing?.maatschappijId}
                required
                className={inputClass}
              >
                <option value="">-- Kies een maatschappij --</option>
                {maatschappijen.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.naam}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Hoofdcategorie">
              <select
                name="categorie"
                defaultValue={editing?.categorie ?? 'motor'}
                required
                className={inputClass}
              >
                <option value="motor">🚗 Motorrijtuigverzekering</option>
                <option value="reis">✈️ Reisverzekering</option>
                <option value="woon">🏠 Woonverzekering</option>
                <option value="leven">🛡️ Levensverzekering</option>
              </select>
            </FormField>
            <FormField label="Specifieke Dekking (bijv. WA of Casco)">
              <input
                name="type"
                defaultValue={editing?.type}
                required
                placeholder="Bijv: WA of Casco"
                className={inputClass}
              />
            </FormField>
            <FormField label="Premie">
              <input
                name="premieBedrag"
                defaultValue={editing?.premieBedrag}
                required
                placeholder="Bijv: SRD 500 of Op aanvraag"
                className={inputClass}
              />
            </FormField>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Annuleren
              </button>
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#004080] text-white hover:bg-[#0066cc] disabled:opacity-50"
              >
                {saveMutation.isPending ? 'Opslaan...' : 'Premie Opslaan'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Sectie: Contactberichten
// ---------------------------------------------------------------------------

function ContactSectie() {
  const queryClient = useQueryClient()
  const [bekijken, setBekijken] = useState<ContactBericht | null>(null)

  const { data: berichten = [], isLoading } = useQuery<ContactBericht[]>({
    queryKey: ['dashboard', 'contact'],
    queryFn: async () => {
      const res = await fetch('/api/contact')
      if (!res.ok) throw new Error('Fout bij ophalen berichten')
      return res.json()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Verwijderen mislukt')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'contact'] })
    },
  })

  const formatDatum = (iso: string) =>
    new Date(iso).toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm">
      <SectionHeader title="Binnengekomen Contactaanvragen" />

      {isLoading ? (
        <p className="text-slate-500 text-sm">Data laden...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#004080] text-white text-xs uppercase tracking-wider">
                <th className="p-3 text-left">Datum</th>
                <th className="p-3 text-left">Afzender</th>
                <th className="p-3 text-left">Onderwerp</th>
                <th className="p-3 text-left">Bericht</th>
                <th className="p-3 text-left">Acties</th>
              </tr>
            </thead>
            <tbody>
              {berichten.map((msg) => (
                <tr key={msg.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-3 text-slate-600 whitespace-nowrap">
                    {formatDatum(msg.createdAt)}
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-[#004080]">{msg.name}</div>
                    <div className="text-xs text-slate-400">{msg.email}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                      {msg.subject}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 max-w-xs truncate">
                    {msg.message}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setBekijken(msg)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                      >
                        Bekijken
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Weet je zeker dat je dit bericht wilt verwijderen?')) {
                            deleteMutation.mutate(msg.id)
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium"
                      >
                        Verwijderen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {berichten.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    Nog geen contactberichten ontvangen.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {bekijken && (
        <Modal title="Contact Bericht Details" onClose={() => setBekijken(null)}>
          <div className="space-y-3 text-sm">
            <p>
              <strong>Van:</strong> {bekijken.name} ({bekijken.email})
            </p>
            <p>
              <strong>Telefoon:</strong> {bekijken.phone || 'Niet opgegeven'}
            </p>
            <p>
              <strong>Onderwerp:</strong> {bekijken.subject}
            </p>
            <hr className="border-slate-100" />
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
              {bekijken.message}
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setBekijken(null)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Sluiten
            </button>
          </div>
        </Modal>
      )}
    </section>
  )
}
