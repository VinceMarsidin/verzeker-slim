import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
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
import {
  haalAlleMaatschappijen,
  maakMaatschappij,
  werkMaatschappijBij,
  verwijderMaatschappij,
} from '@/lib/server/admin-companies'
import { uploadCompanyImage } from '@/lib/server/upload-company-image'

const regioOpties = [
  'suriname',
  'aruba',
  'curacao',
  'bonaire',
  'trinidad',
  'jamaica',
  'guyana',
  'french-guiana',
] as const

function CompanyImageUploader({
  label,
  name,
  slug,
  soort,
  value,
  onChange,
}: {
  label: string
  name: string
  slug: string
  soort: 'logo' | 'homepage'
  value: string
  onChange: (url: string) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onBestandGekozen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!slug.trim()) {
      setError('Vul eerst de slug hierboven in.')
      return
    }
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError('Alleen PNG, JPEG of WebP toegestaan.')
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      setError('Afbeelding is te groot (max 3MB).')
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Kon bestand niet lezen'))
        reader.readAsDataURL(file)
      })

      const { url } = await uploadCompanyImage({ data: { slug, soort, dataUrl } })
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Uploaden mislukt.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <FormField label={label}>
      <div className="flex items-center gap-2.5">
        {value ? (
          <img
            src={value}
            alt=""
            className="h-10 w-10 shrink-0 rounded-[4px] border border-line bg-white object-contain p-1"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-dashed border-line text-[10px] text-ink-soft">
            geen
          </div>
        )}
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-sm font-medium text-stamp-dark hover:underline"
          >
            {isUploading ? 'Bezig...' : value ? 'Vervangen' : 'Uploaden'}
          </button>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={onBestandGekozen}
        className="hidden"
      />
      {/* Zorgt dat de uploade URL toch als gewoon formuliervield meegaat
          bij handleSubmit's FormData-uitlezing. */}
      <input type="hidden" name={name} value={value} />
    </FormField>
  )
}

type Bedrijf = {
  id: number
  slug: string
  name: string
  logoInitial: string
  logoUrl: string | null
  homepageImage: string | null
  region: string
  website: string
  description: string
  aantalPremies: number
  aantalReviews: number
}

export function MaatschappijenSectie() {
  const queryClient = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Bedrijf | null>(null)
  const [zoekterm, setZoekterm] = useState('')
  const [gekozenRegio, setGekozenRegio] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [slugVeld, setSlugVeld] = useState('')
  const [logoUrlVeld, setLogoUrlVeld] = useState('')
  const [homepageImageVeld, setHomepageImageVeld] = useState('')

  const { data: maatschappijen = [], isLoading } = useQuery({
    queryKey: ['admin-companies'],
    queryFn: () => haalAlleMaatschappijen(),
  })

  const saveMutation = useMutation({
    mutationFn: async (payload: {
      id?: number
      slug: string
      name: string
      logoInitial: string
      logoUrl: string
      homepageImage: string
      region: (typeof regioOpties)[number]
      website: string
      description: string
    }) => {
      if (payload.id) {
        return werkMaatschappijBij({ data: payload as never })
      }
      return maakMaatschappij({ data: payload })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] })
      setModalOpen(false)
      setEditing(null)
      setFormError(null)
    },
    onError: (err: Error) => {
      setFormError(err.message || 'Opslaan mislukt.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => verwijderMaatschappij({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] })
    },
  })

  const openNew = () => {
    setEditing(null)
    setFormError(null)
    setSlugVeld('')
    setLogoUrlVeld('')
    setHomepageImageVeld('')
    setModalOpen(true)
  }

  const openEdit = (m: Bedrijf) => {
    setEditing(m)
    setFormError(null)
    setSlugVeld(m.slug)
    setLogoUrlVeld(m.logoUrl ?? '')
    setHomepageImageVeld(m.homepageImage ?? '')
    setModalOpen(true)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    const form = new FormData(e.currentTarget)
    saveMutation.mutate({
      id: editing?.id,
      slug: String(form.get('slug') || ''),
      name: String(form.get('name') || ''),
      logoInitial: String(form.get('logoInitial') || ''),
      logoUrl: String(form.get('logoUrl') || ''),
      homepageImage: String(form.get('homepageImage') || ''),
      region: form.get('region') as (typeof regioOpties)[number],
      website: String(form.get('website') || ''),
      description: String(form.get('description') || ''),
    })
  }

  const gefilterd = maatschappijen.filter((m) => {
    if (gekozenRegio && m.region !== gekozenRegio) return false

    const q = zoekterm.trim().toLowerCase()
    if (!q) return true
    return (
      m.name.toLowerCase().includes(q) ||
      m.region.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <PageHeader
        title="Maatschappijen"
        description="Alle verzekeringsmaatschappijen in het systeem (uit de companies-tabel)."
        onAdd={openNew}
        addLabel="Nieuwe maatschappij"
      />

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Totaal maatschappijen" value={maatschappijen.length} />
        <StatCard
          label="Totaal premies"
          value={maatschappijen.reduce((som, m) => som + m.aantalPremies, 0)}
        />
        <StatCard
          label="Totaal reviews"
          value={maatschappijen.reduce((som, m) => som + m.aantalReviews, 0)}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-[#f8fafd] px-4 py-3">
          <SearchInput
            value={zoekterm}
            onChange={setZoekterm}
            placeholder="Zoek op naam of regio..."
          />
          <div className="flex shrink-0 items-center gap-3">
            <select
              value={gekozenRegio}
              onChange={(e) => setGekozenRegio(e.target.value)}
              className="rounded-[6px] border border-line bg-white px-3 py-1.5 text-sm capitalize text-ink outline-none focus:border-stamp-dark"
            >
              <option value="">Alle regio's</option>
              {regioOpties.map((regio) => (
                <option key={regio} value={regio} className="capitalize">
                  {regio}
                </option>
              ))}
            </select>
            {(zoekterm || gekozenRegio) && (
              <span className="text-xs text-ink-soft">
                {gefilterd.length} van {maatschappijen.length}
              </span>
            )}
          </div>
        </div>

        {isLoading ? (
          <p className="p-8 text-center text-sm text-ink-soft">Data laden...</p>
        ) : maatschappijen.length === 0 ? (
          <EmptyState label="Nog geen maatschappijen in de database. Draai tsx scripts/seed-companies.ts." />
        ) : gefilterd.length === 0 ? (
          <EmptyState label="Geen maatschappijen gevonden voor deze zoekopdracht/filter." />
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
                <th className="p-4 text-left">Maatschappij</th>
                <th className="p-4 text-left">Homepage</th>
                <th className="p-4 text-left">Beschrijving</th>
                <th className="p-4 text-left">Website</th>
                <th className="p-4 text-right">Premies</th>
                <th className="p-4 text-right">Reviews</th>
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
                      {m.logoUrl ? (
                        <img
                          src={m.logoUrl}
                          alt=""
                          className="h-9 w-9 shrink-0 rounded-[4px] border border-line bg-white object-contain p-1"
                        />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-line/40 text-sm font-semibold text-ink">
                          {m.logoInitial}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-ink">{m.name}</div>
                        <div className="text-xs capitalize text-ink-soft">{m.region}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {m.homepageImage ? (
                      <img
                        src={m.homepageImage}
                        alt=""
                        className="h-9 w-14 rounded-[4px] border border-line object-cover"
                      />
                    ) : (
                      <span className="text-xs text-ink-soft">—</span>
                    )}
                  </td>
                  <td className="max-w-xs p-4 text-ink-soft">
                    <span className="line-clamp-2" title={m.description}>
                      {m.description}
                    </span>
                  </td>
                  <td className="p-4">
                    <a
                      href={m.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stamp-dark hover:underline"
                    >
                      {m.website.replace(/^https?:\/\//, '')}
                    </a>
                  </td>
                  <td className="p-4 text-right text-ink-soft">{m.aantalPremies}</td>
                  <td className="p-4 text-right text-ink-soft">{m.aantalReviews}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <IconButton onClick={() => openEdit(m)} variant="default">
                        <Pencil className="h-3.5 w-3.5" />
                      </IconButton>
                      <IconButton
                        variant="danger"
                        onClick={() => {
                          if (
                            confirm(
                              `Weet je zeker dat je "${m.name}" wilt verwijderen? Dit verwijdert ook automatisch alle ${m.aantalPremies} premie(s) en ${m.aantalReviews} review(s) die hieraan gekoppeld zijn.`,
                            )
                          ) {
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
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Naam">
                <input
                  name="name"
                  defaultValue={editing?.name}
                  required
                  placeholder="Bijv. Assuria"
                  className={inputClass}
                />
              </FormField>
              <FormField label="Slug (uniek, url-vriendelijk)">
                <input
                  name="slug"
                  value={slugVeld}
                  onChange={(e) => setSlugVeld(e.target.value)}
                  required
                  placeholder="bijv-assuria-suriname"
                  className={inputClass}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Regio">
                <select
                  name="region"
                  defaultValue={editing?.region ?? regioOpties[0]}
                  required
                  className={`${inputClass} appearance-none`}
                >
                  {regioOpties.map((regio) => (
                    <option key={regio} value={regio}>
                      {regio}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Logo-letter (max 2 tekens)">
                <input
                  name="logoInitial"
                  defaultValue={editing?.logoInitial}
                  required
                  maxLength={2}
                  placeholder="A"
                  className={inputClass}
                />
              </FormField>
            </div>

            <FormField label="Website">
              <input
                name="website"
                type="url"
                defaultValue={editing?.website}
                required
                placeholder="https://www.voorbeeld.sr"
                className={inputClass}
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <CompanyImageUploader
                label="Logo"
                name="logoUrl"
                slug={slugVeld}
                soort="logo"
                value={logoUrlVeld}
                onChange={setLogoUrlVeld}
              />

              <CompanyImageUploader
                label="Homepage-afbeelding"
                name="homepageImage"
                slug={slugVeld}
                soort="homepage"
                value={homepageImageVeld}
                onChange={setHomepageImageVeld}
              />
            </div>

            <FormField label="Beschrijving">
              <textarea
                name="description"
                defaultValue={editing?.description}
                required
                rows={3}
                placeholder="Korte omschrijving van de maatschappij..."
                className={inputClass}
              />
            </FormField>

            {formError && (
              <p className="mt-2 text-sm text-red-600">{formError}</p>
            )}

            <div className="mt-6 flex items-center justify-between gap-2">
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        `Weet je zeker dat je "${editing.name}" wilt verwijderen? Dit verwijdert ook automatisch alle ${editing.aantalPremies} premie(s) en ${editing.aantalReviews} review(s) die hieraan gekoppeld zijn.`,
                      )
                    ) {
                      deleteMutation.mutate(editing.id)
                      setModalOpen(false)
                    }
                  }}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Verwijderen
                </button>
              )}
              <div className="ml-auto flex gap-2">
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
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
