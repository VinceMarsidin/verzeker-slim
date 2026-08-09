import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'

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

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Totaal premies" value={premies.length} />
        <StatCard label="Categorieën" value={categorieen} />
        <StatCard label="Maatschappijen" value={maatschappijen.length} />
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-[#f8fafd] px-4 py-3">
          <SearchInput
            value={zoekterm}
            onChange={setZoekterm}
            placeholder="Zoek op maatschappij, categorie..."
          />
          {zoekterm && (
            <span className="shrink-0 text-xs text-ink-soft">
              {gefilterd.length} van {premies.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <p className="p-8 text-center text-sm text-ink-soft">Data laden...</p>
        ) : premies.length === 0 ? (
          <EmptyState label="Nog geen premies toegevoegd." />
        ) : gefilterd.length === 0 ? (
          <EmptyState label={`Geen resultaten voor "${zoekterm}".`} />
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
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
                  className="border-b border-line last:border-0 hover:bg-[#f8fafd]"
                >
                  <td className="p-4 font-medium text-ink">
                    {p.maatschappijNaam || 'Onbekend'}
                  </td>
                  <td className="p-4">
                    <Badge className="capitalize">{p.categorie}</Badge>
                  </td>
                  <td className="p-4 text-ink-soft">{p.type}</td>
                  <td className="p-4 font-mono font-semibold text-ink">
                    {p.premieBedrag}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <IconButton onClick={() => openEdit(p)} variant="default">
                        <Pencil className="h-3.5 w-3.5" />
                      </IconButton>
                      <IconButton
                        variant="danger"
                        onClick={() => {
                          if (confirm('Weet je zeker dat je deze premie wilt verwijderen?')) {
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
