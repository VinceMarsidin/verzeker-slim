import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Pencil, Star, Trash2 } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { EmptyState } from './empty-state'
import { FormField, inputClass } from './form-field'
import { IconButton } from './icon-button'
import { Modal } from './modal'
import { PageHeader } from './page-header'
import { SearchInput } from './search-input'
import { StatCard } from './stat-card'
import {
  haalAllePremies,
  maakPremie,
  werkPremieBij,
  verwijderPremie,
} from '@/lib/server/admin-premies'
import { haalAlleMaatschappijen } from '@/lib/server/admin-companies'

const categorieOpties = ['motor', 'reis', 'woon', 'leven'] as const
const badgeOpties = ['', 'populair', 'beste prijs', 'beste dekking'] as const

type Premie = {
  id: number
  companyId: number
  companyName: string
  companySlug: string
  region: string
  insuranceType: string
  monthlyPremium: number
  currency: string
  deductible: number
  rating: number
  coverage: string[]
  badge: string | null
  isReviewBased: boolean
}

export function PremiesSectie() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Premie | null>(null)
  const [zoekterm, setZoekterm] = useState('')
  const [gekozenCategorie, setGekozenCategorie] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const { data: premies = [], isLoading } = useQuery<Premie[]>({
    queryKey: ['admin-premies'],
    queryFn: () => haalAllePremies(),
  })

  const { data: maatschappijen = [] } = useQuery({
    queryKey: ['admin-companies'],
    queryFn: () => haalAlleMaatschappijen(),
  })

  const saveMutation = useMutation({
    mutationFn: async (payload: {
      id?: number
      companyId: number
      insuranceType: string
      monthlyPremium: number
      currency: string
      deductible: number
      rating: number
      coverage: string
      badge: string
    }) => {
      if (payload.id) {
        return werkPremieBij({ data: payload as never })
      }
      return maakPremie({ data: payload as never })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-premies'] })
      setModalOpen(false)
      setEditing(null)
      setFormError(null)
    },
    onError: (err: Error) => {
      setFormError(err.message || 'Opslaan mislukt.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => verwijderPremie({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-premies'] })
    },
  })

  const openNew = () => {
    setEditing(null)
    setFormError(null)
    setModalOpen(true)
  }

  const openEdit = (p: Premie) => {
    setEditing(p)
    setFormError(null)
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    const form = new FormData(e.currentTarget)
    saveMutation.mutate({
      id: editing?.id,
      companyId: Number(form.get('companyId')),
      insuranceType: String(form.get('insuranceType') || ''),
      monthlyPremium: Number(form.get('monthlyPremium')),
      currency: String(form.get('currency') || ''),
      deductible: Number(form.get('deductible')),
      rating: Number(form.get('rating')),
      coverage: String(form.get('coverage') || ''),
      badge: String(form.get('badge') || ''),
    })
  }

  const gemiddeldeRating = premies.length
    ? (premies.reduce((som, p) => som + p.rating, 0) / premies.length).toFixed(1)
    : '—'
  const aantalMaatschappijen = new Set(premies.map((p) => p.companySlug)).size

  const gefilterd = premies.filter((p) => {
    if (gekozenCategorie && p.insuranceType !== gekozenCategorie) return false
    const q = zoekterm.trim().toLowerCase()
    if (!q) return true
    return (
      p.companyName.toLowerCase().includes(q) ||
      p.insuranceType.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <PageHeader
        title="Premies"
        description="Alle premies per maatschappij, uit de premiums-tabel."
        onAdd={openNew}
        addLabel="Nieuwe premie"
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Totaal premies" value={premies.length} />
        <StatCard label="Maatschappijen" value={aantalMaatschappijen} />
        <StatCard label="Gemiddelde rating" value={gemiddeldeRating} />
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-[#f8fafd] px-4 py-3">
          <SearchInput
            value={zoekterm}
            onChange={setZoekterm}
            placeholder="Zoek op maatschappij of categorie..."
          />
          <div className="flex shrink-0 items-center gap-3">
            <select
              value={gekozenCategorie}
              onChange={(e) => setGekozenCategorie(e.target.value)}
              className="rounded-[6px] border border-line bg-white px-3 py-1.5 text-sm capitalize text-ink outline-none focus:border-stamp-dark"
            >
              <option value="">Alle categorieën</option>
              {categorieOpties.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat}
                </option>
              ))}
            </select>
            {(zoekterm || gekozenCategorie) && (
              <span className="text-xs text-ink-soft">
                {gefilterd.length} van {premies.length}
              </span>
            )}
          </div>
        </div>

        {isLoading ? (
          <p className="p-8 text-center text-sm text-ink-soft">Data laden...</p>
        ) : premies.length === 0 ? (
          <EmptyState label="Nog geen premies in de database. Draai tsx scripts/seed-premiums.ts." />
        ) : gefilterd.length === 0 ? (
          <EmptyState label="Geen premies gevonden voor deze zoekopdracht/filter." />
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
                <th className="p-4 text-left">Maatschappij</th>
                <th className="p-4 text-left">Categorie</th>
                <th className="p-4 text-left">Premie</th>
                <th className="p-4 text-left">Eigen risico</th>
                <th className="p-4 text-left">Rating</th>
                <th className="p-4 text-left">Dekking</th>
                <th className="p-4 text-right">Acties</th>
              </tr>
            </thead>
            <tbody>
              {gefilterd.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-line last:border-0 hover:bg-[#f8fafd]"
                >
                  <td className="p-4 font-medium text-ink">{p.companyName}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <Badge className="capitalize">{p.insuranceType}</Badge>
                      {p.badge && (
                        <span className="text-xs text-stamp-dark">({p.badge})</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-mono font-semibold text-ink">
                    {p.currency} {p.monthlyPremium}
                    <span className="text-xs font-normal text-ink-soft">/mnd</span>
                  </td>
                  <td className="p-4 text-ink-soft">
                    {p.currency} {p.deductible}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-ink-soft">
                      <Star className="h-3.5 w-3.5 fill-stamp-dark text-stamp-dark" />
                      {p.rating.toFixed(1)}
                      {!p.isReviewBased && (
                        <span
                          className="ml-1 text-[10px] text-ink-soft/60"
                          title="Nog geen reviews — dit is een standaardwaarde"
                        >
                          (nog geen reviews)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="max-w-xs p-4 text-ink-soft">
                    {p.coverage.join(', ')}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <IconButton onClick={() => openEdit(p)} variant="default">
                        <Pencil className="h-3.5 w-3.5" />
                      </IconButton>
                      <IconButton
                        variant="danger"
                        onClick={() => {
                          if (
                            confirm(
                              `Weet je zeker dat je de ${p.insuranceType}-premie van ${p.companyName} wilt verwijderen?`,
                            )
                          ) {
                            deleteMutation.mutate(p.id)
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {modalOpen && (
        <Modal
          title={editing ? 'Premie bewerken' : 'Nieuwe premie'}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit}>
            <FormField label="Verzekeringsmaatschappij">
              <select
                name="companyId"
                defaultValue={editing?.companyId}
                required
                className={inputClass}
              >
                <option value="">-- Kies een maatschappij --</option>
                {maatschappijen.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Categorie">
                <select
                  name="insuranceType"
                  defaultValue={editing?.insuranceType ?? 'motor'}
                  required
                  className={inputClass}
                >
                  {categorieOpties.map((cat) => (
                    <option key={cat} value={cat} className="capitalize">
                      {cat}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Badge (optioneel)">
                <select
                  name="badge"
                  defaultValue={editing?.badge ?? ''}
                  className={inputClass}
                >
                  {badgeOpties.map((b) => (
                    <option key={b} value={b}>
                      {b === '' ? '-- Geen --' : b}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Premie per maand">
                <input
                  name="monthlyPremium"
                  type="number"
                  step="0.01"
                  defaultValue={editing?.monthlyPremium}
                  required
                  placeholder="Bijv. 145"
                  className={inputClass}
                />
              </FormField>
              <FormField label="Valuta">
                <input
                  name="currency"
                  defaultValue={editing?.currency ?? 'SRD'}
                  required
                  placeholder="SRD"
                  className={inputClass}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Eigen risico">
                <input
                  name="deductible"
                  type="number"
                  step="0.01"
                  defaultValue={editing?.deductible}
                  required
                  placeholder="Bijv. 500"
                  className={inputClass}
                />
              </FormField>
              <FormField label="Standaard rating (fallback)">
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  defaultValue={editing?.rating}
                  required
                  placeholder="Bijv. 4.5"
                  className={inputClass}
                />
              </FormField>
            </div>

            <FormField label="Dekking (komma-gescheiden)">
              <input
                name="coverage"
                defaultValue={editing?.coverage?.join(', ')}
                required
                placeholder="WA, Diefstal, Brand"
                className={inputClass}
              />
            </FormField>
            <p className="-mt-3 mb-4 text-xs text-ink-soft">
              Let op: de "Standaard rating" wordt alleen getoond zolang deze
              maatschappij nog geen reviews heeft — daarna telt automatisch
              het gemiddelde van de reviews.
            </p>

            {formError && (
              <p className="mt-2 text-sm text-red-600">{formError}</p>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
              >
                Annuleren
              </Button>
              <Button
                type="submit"
                disabled={saveMutation.isPending}
                className="bg-ink hover:bg-ink/90"
              >
                {saveMutation.isPending ? 'Opslaan...' : 'Premie opslaan'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}


// test