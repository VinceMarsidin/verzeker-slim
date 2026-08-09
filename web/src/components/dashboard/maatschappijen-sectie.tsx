import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { EmptyState } from './empty-state'
import { FormField, inputClass } from './form-field'
import { IconButton } from './icon-button'
import { Modal } from './modal'
import { PageHeader } from './page-header'
import { SearchInput } from './search-input'
import { StatCard } from './stat-card'
import { avatarKleur } from '#/lib/avatar-color'
import type { Maatschappij } from '#/lib/types'

export function MaatschappijenSectie() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Maatschappij | null>(null)
  const [zoekterm, setZoekterm] = useState('')

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

  const gefilterd = maatschappijen.filter((m) => {
    const q = zoekterm.trim().toLowerCase()
    if (!q) return true
    return (
      m.naam.toLowerCase().includes(q) ||
      (m.contactEmail ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <PageHeader
        title="Maatschappijen"
        description="Beheer de verzekeringsmaatschappijen in het systeem"
        onAdd={openNew}
        addLabel="Nieuwe maatschappij"
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Totaal" value={maatschappijen.length} />
        <StatCard
          label="Met logo"
          value={maatschappijen.filter((m) => m.logoUrl).length}
        />
        <StatCard
          label="Met contactmail"
          value={maatschappijen.filter((m) => m.contactEmail).length}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-[#f8fafd] px-4 py-3">
          <SearchInput
            value={zoekterm}
            onChange={setZoekterm}
            placeholder="Zoek op naam of e-mail..."
          />
          {zoekterm && (
            <span className="shrink-0 text-xs text-ink-soft">
              {gefilterd.length} van {maatschappijen.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <p className="p-8 text-center text-sm text-ink-soft">Data laden...</p>
        ) : maatschappijen.length === 0 ? (
          <EmptyState label="Nog geen maatschappijen toegevoegd." />
        ) : gefilterd.length === 0 ? (
          <EmptyState label={`Geen resultaten voor "${zoekterm}".`} />
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
                <th className="p-4 text-left">Maatschappij</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-right">Acties</th>
              </tr>
            </thead>
            <tbody>
              {gefilterd.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-line last:border-0 hover:bg-[#f8fafd]"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${avatarKleur(m.naam)}`}
                      >
                        {m.naam.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-ink">{m.naam}</span>
                    </div>
                  </td>
                  <td className="p-4 text-ink-soft">{m.contactEmail || '—'}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <IconButton onClick={() => openEdit(m)} variant="default">
                        <Pencil className="h-3.5 w-3.5" />
                      </IconButton>
                      <IconButton
                        variant="danger"
                        onClick={() => {
                          if (confirm('Weet je zeker dat je deze maatschappij wilt verwijderen?')) {
                            deleteMutation.mutate(m.id)
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
          title={editing ? 'Maatschappij bewerken' : 'Nieuwe maatschappij'}
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
                {saveMutation.isPending ? 'Opslaan...' : 'Opslaan'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
