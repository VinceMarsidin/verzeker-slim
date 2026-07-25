import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'

import { EmptyState } from '#/components/ui/empty-state'
import { IconButton } from '#/components/ui/icon-button'
import { Modal } from '#/components/ui/modal'
import { PageHeader } from '#/components/ui/page-header'
import { SearchInput } from '#/components/ui/search-input'
import { StatCard } from '#/components/ui/stat-card'
import { avatarKleur } from '#/lib/avatar-color'
import type { ContactBericht } from '#/lib/types'

export function ContactSectie() {
  const queryClient = useQueryClient()
  const [bekijken, setBekijken] = useState<ContactBericht | null>(null)
  const [zoekterm, setZoekterm] = useState('')

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

  const vandaag = new Date().toDateString()
  const nieuwVandaag = berichten.filter(
    (m) => new Date(m.createdAt).toDateString() === vandaag,
  ).length

  const gefilterd = berichten.filter((m) => {
    const q = zoekterm.trim().toLowerCase()
    if (!q) return true
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <PageHeader
        title="Contact Berichten"
        description="Berichten die via het contactformulier zijn binnengekomen"
      />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard label="Totaal berichten" value={berichten.length} accent="orange" />
        <StatCard label="Vandaag ontvangen" value={nieuwVandaag} accent="emerald" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50/60">
          <SearchInput
            value={zoekterm}
            onChange={setZoekterm}
            placeholder="Zoek op naam, e-mail..."
          />
          {zoekterm && (
            <span className="text-xs text-slate-400 shrink-0">
              {gefilterd.length} van {berichten.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <p className="p-8 text-center text-slate-400 text-sm">Data laden...</p>
        ) : berichten.length === 0 ? (
          <EmptyState label="Nog geen contactberichten ontvangen." />
        ) : gefilterd.length === 0 ? (
          <EmptyState label={`Geen resultaten voor "${zoekterm}".`} />
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-medium">
                <th className="p-4 text-left">Afzender</th>
                <th className="p-4 text-left">Onderwerp</th>
                <th className="p-4 text-left">Datum</th>
                <th className="p-4 text-right">Acties</th>
              </tr>
            </thead>
            <tbody>
              {gefilterd.map((msg) => (
                <tr
                  key={msg.id}
                  className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${avatarKleur(msg.name)}`}
                      >
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-slate-900 truncate">
                          {msg.name}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {msg.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full bg-blue-50 text-xs font-medium text-blue-700">
                      {msg.subject}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 whitespace-nowrap">
                    {formatDatum(msg.createdAt)}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setBekijken(msg)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors"
                      >
                        Bekijken
                      </button>
                      <IconButton
                        variant="danger"
                        onClick={() => {
                          if (confirm('Weet je zeker dat je dit bericht wilt verwijderen?')) {
                            deleteMutation.mutate(msg.id)
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

      {bekijken && (
        <Modal title="Contact bericht details" onClose={() => setBekijken(null)}>
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-slate-400">Van:</span>{' '}
              <span className="text-slate-900 font-medium">
                {bekijken.name} ({bekijken.email})
              </span>
            </p>
            <p>
              <span className="text-slate-400">Telefoon:</span>{' '}
              <span className="text-slate-900">{bekijken.phone || 'Niet opgegeven'}</span>
            </p>
            <p>
              <span className="text-slate-400">Onderwerp:</span>{' '}
              <span className="text-slate-900">{bekijken.subject}</span>
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap text-slate-700">
              {bekijken.message}
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setBekijken(null)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Sluiten
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
