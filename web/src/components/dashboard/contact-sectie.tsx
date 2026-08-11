import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

import { EmptyState } from './empty-state'
import { IconButton } from './icon-button'
import { Modal } from './modal'
import { PageHeader } from './page-header'
import { SearchInput } from './search-input'
import { StatCard } from './stat-card'
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
    return m.naam.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
  })

  return (
    <div>
      <PageHeader
        title="Contact Berichten"
        description="Berichten die via het contactformulier zijn binnengekomen"
      />

      <div className="mb-6 grid grid-cols-2 gap-4">
        <StatCard label="Totaal berichten" value={berichten.length} />
        <StatCard label="Vandaag ontvangen" value={nieuwVandaag} />
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-[#f8fafd] px-4 py-3">
          <SearchInput
            value={zoekterm}
            onChange={setZoekterm}
            placeholder="Zoek op naam, e-mail..."
          />
          {zoekterm && (
            <span className="shrink-0 text-xs text-ink-soft">
              {gefilterd.length} van {berichten.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <p className="p-8 text-center text-sm text-ink-soft">Data laden...</p>
        ) : berichten.length === 0 ? (
          <EmptyState label="Nog geen contactberichten ontvangen." />
        ) : gefilterd.length === 0 ? (
          <EmptyState label={`Geen resultaten voor "${zoekterm}".`} />
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
                <th className="p-4 text-left">Afzender</th>
                <th className="p-4 text-left">Bericht</th>
                <th className="p-4 text-left">Datum</th>
                <th className="p-4 text-right">Acties</th>
              </tr>
            </thead>
            <tbody>
              {gefilterd.map((msg) => (
                <tr
                  key={msg.id}
                  className="border-b border-line last:border-0 hover:bg-[#f8fafd]"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${avatarKleur(msg.naam)}`}
                      >
                        {msg.naam.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium text-ink">{msg.naam}</div>
                        <div className="truncate text-xs text-ink-soft">{msg.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="max-w-xs truncate p-4 text-ink-soft">{msg.bericht}</td>
                  <td className="whitespace-nowrap p-4 text-ink-soft">
                    {formatDatum(msg.createdAt)}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setBekijken(msg)}>
                        Bekijken
                      </Button>
                      <IconButton
                        variant="danger"
                        onClick={() => {
                          if (confirm('Weet je zeker dat je dit bericht wilt verwijderen?')) {
                            deleteMutation.mutate(msg.id)
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

      {bekijken && (
        <Modal title="Contact bericht details" onClose={() => setBekijken(null)}>
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-ink-soft">Van:</span>{' '}
              <span className="font-medium text-ink">
                {bekijken.naam} ({bekijken.email})
              </span>
            </p>
            <div className="whitespace-pre-wrap rounded-xl border border-line bg-[#f8fafd] p-4 text-ink-soft">
              {bekijken.bericht}
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="ghost" onClick={() => setBekijken(null)}>
              Sluiten
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
