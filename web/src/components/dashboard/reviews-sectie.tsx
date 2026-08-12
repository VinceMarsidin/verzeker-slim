import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Star, Trash2 } from 'lucide-react'

import { Card } from '@/components/ui/card'

import { EmptyState } from './empty-state'
import { IconButton } from './icon-button'
import { PageHeader } from './page-header'
import { SearchInput } from './search-input'
import { StatCard } from './stat-card'
import { avatarKleur } from '#/lib/avatar-color'
import { haalAlleReviews, verwijderReview } from '@/lib/server/admin-reviews'
import type { ReviewAdmin } from '#/lib/types'

export function ReviewsSectie() {
    const queryClient = useQueryClient()
    const [zoekterm, setZoekterm] = useState('')
    const [gekozenMaatschappij, setGekozenMaatschappij] = useState('')

    const { data: reviews = [], isLoading } = useQuery<ReviewAdmin[]>({
        queryKey: ['admin-reviews'],
        queryFn: () => haalAlleReviews(),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => verwijderReview({ data: id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-reviews'] })
        },
    })

    const formatDatum = (datum: Date | null) => {
        if (!datum) return '—'
        return new Date(datum).toLocaleDateString('nl-NL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }

    const gemiddeldeRating = reviews.length
        ? (reviews.reduce((som, r) => som + r.rating, 0) / reviews.length).toFixed(1)
        : '—'
    const aantalMaatschappijen = new Set(reviews.map((r) => r.companySlug)).size

    // Unieke maatschappijen afgeleid uit de al opgehaalde reviews, gesorteerd
    // op naam — geen aparte databasecall nodig voor de filter-dropdown.
    const maatschappijOpties = Array.from(
        new Map(reviews.map((r) => [r.companySlug, r.companyName])).entries(),
    ).sort((a, b) => a[1].localeCompare(b[1]))

    const gefilterd = reviews.filter((r) => {
        if (gekozenMaatschappij && r.companySlug !== gekozenMaatschappij) return false

        const q = zoekterm.trim().toLowerCase()
        if (!q) return true
        return (
            r.companyName.toLowerCase().includes(q) ||
            r.userName.toLowerCase().includes(q) ||
            r.title.toLowerCase().includes(q)
        )
    })

    return (
        <div>
            <PageHeader
                title="Reviews"
                description="Alle reviews die gebruikers hebben geplaatst bij maatschappijen."
            />

            <div className="mb-6 grid grid-cols-3 gap-4">
                <StatCard label="Totaal reviews" value={reviews.length} />
                <StatCard label="Gemiddelde rating" value={gemiddeldeRating} />
                <StatCard label="Maatschappijen met reviews" value={aantalMaatschappijen} />
            </div>

            <Card className="overflow-hidden">
                <div className="flex items-center justify-between gap-3 border-b border-line bg-[#f8fafd] px-4 py-3">
                    <SearchInput
                        value={zoekterm}
                        onChange={setZoekterm}
                        placeholder="Zoek op maatschappij, naam of titel..."
                    />
                    <div className="flex shrink-0 items-center gap-3">
                        <select
                            value={gekozenMaatschappij}
                            onChange={(e) => setGekozenMaatschappij(e.target.value)}
                            className="rounded-[6px] border border-line bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-stamp-dark"
                        >
                            <option value="">Alle maatschappijen</option>
                            {maatschappijOpties.map(([slug, naam]) => (
                                <option key={slug} value={slug}>
                                    {naam}
                                </option>
                            ))}
                        </select>
                        {(zoekterm || gekozenMaatschappij) && (
                            <span className="text-xs text-ink-soft">
                                {gefilterd.length} van {reviews.length}
                            </span>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <p className="p-8 text-center text-sm text-ink-soft">Data laden...</p>
                ) : reviews.length === 0 ? (
                    <EmptyState label="Nog geen reviews geplaatst." />
                ) : gefilterd.length === 0 ? (
                    <EmptyState label="Geen reviews gevonden voor deze zoekopdracht/filter." />
                ) : (
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-line font-mono text-xs font-semibold uppercase tracking-wider text-ink-soft">
                                <th className="p-4 text-left">Gebruiker</th>
                                <th className="p-4 text-left">Maatschappij</th>
                                <th className="p-4 text-left">Rating</th>
                                <th className="p-4 text-left">Review</th>
                                <th className="p-4 text-left">Datum</th>
                                <th className="p-4 text-right">Acties</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gefilterd.map((review) => (
                                <tr
                                    key={review.id}
                                    className="border-b border-line last:border-0 hover:bg-[#f8fafd]"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${avatarKleur(review.userName)}`}
                                            >
                                                {review.userName.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-ink">{review.userName}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-ink-soft">{review.companyName}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-0.5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3.5 w-3.5 ${i < review.rating
                                                            ? 'fill-stamp-dark text-stamp-dark'
                                                            : 'text-line'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="max-w-xs p-4">
                                        <div className="font-medium text-ink">{review.title}</div>
                                        <div className="line-clamp-1 text-xs text-ink-soft" title={review.body}>
                                            {review.body}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap p-4 text-ink-soft">
                                        {formatDatum(review.createdAt)}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end">
                                            <IconButton
                                                variant="danger"
                                                onClick={() => {
                                                    if (confirm('Weet je zeker dat je deze review wilt verwijderen?')) {
                                                        deleteMutation.mutate(review.id)
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
        </div>
    )
}
