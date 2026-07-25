import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'

import { EmptyState } from '#/components/ui/empty-state'
import { FormField, inputClass } from '#/components/ui/form-field'
import { IconButton } from '#/components/ui/icon-button'
import { Modal } from '#/components/ui/modal'
import { PageHeader } from '#/components/ui/page-header'
import { SearchInput } from '#/components/ui/search-input'
import { StatCard } from '#/components/ui/stat-card'
import type { Maatschappij, Premie } from '#/lib/types'

export function PremiesSectie() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Premie | null>(null)
  const [zoekterm, setZoekterm] = useState('')

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

  const categorieen = new Set(premies.map((p) => p.categorie)).size

  const gefilterd = premies.filter((p) => {
    const q = zoekterm.trim().toLowerCase()
    if (!q) return true
    return (
      (p.maatschappijNaam ?? '').toLowerCase().includes(q) ||
      p.categorie.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <PageHeader
        title="Premies"
        description="Beheer verzekeringspremies per maatschappij"
        onAdd={openNew}
        addLabel="Nieuwe premie"
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Totaal premies" value={premies.length} accent="orange" />
        <StatCard label="Categorieën" value={categorieen} accent="blue" />
        <StatCard
          label="Maatschappijen"
          value={maatschappijen.length}
          accent="emerald"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50/60">
          <SearchInput
            value={zoekterm}
            onChange={setZoekterm}
            placeholder="Zoek op maatschappij, categorie..."
          />
          {zoekterm && (
            <span className="text-xs text-slate-400 shrink-0">
              {gefilterd.length} van {premies.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <p className="p-8 text-center text-slate-400 text-sm">Data laden...</p>
        ) : premies.length === 0 ? (
          <EmptyState label="Nog geen premies toegevoegd." />
        ) : gefilterd.length === 0 ? (
          <EmptyState label={`Geen resultaten voor "${zoekterm}".`} />
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-medium">
                <th className="p-4 text-left">Maatschappij</th>
                <th className="p-4 text-left">Categorie</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Premie</th>
                <th className="p-4 text-right">Acties</th>
              </tr>
            </thead>
            <tbody>
              {gefilterd.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="p-4 font-medium text-slate-900">
                    {p.maatschappijNaam || 'Onbekend'}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium capitalize">
                      {p.categorie}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{p.type}</td>
                  <td className="p-4 text-slate-900 font-medium tabular-nums">
                    {p.premieBedrag}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <IconButton onClick={() => openEdit(p)} variant="default">
                        <Pencil size={14} />
                      </IconButton>
                      <IconButton
                        variant="danger"
                        onClick={() => {
                          if (confirm('Weet je zeker dat je deze premie wilt verwijderen?')) {
                            deleteMutation.mutate(p.id)
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <Modal
          title={editing ? 'Premie bewerken' : 'Nieuwe premie'}
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
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Annuleren
              </button>
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50 transition-colors"
              >
                {saveMutation.isPending ? 'Opslaan...' : 'Premie opslaan'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
