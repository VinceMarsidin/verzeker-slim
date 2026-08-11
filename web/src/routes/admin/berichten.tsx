import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { haalContactBerichten } from '@/lib/server/berichten'

export const Route = createFileRoute('/admin/berichten')({
    component: BerichtenPage,
})

function formatDatum(datum: string | Date | null) {
    if (!datum) return '—'
    return new Date(datum).toLocaleDateString('nl-NL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function BerichtenPage() {
    const { data: berichten, isLoading, isError } = useQuery({
        queryKey: ['contact-berichten'],
        queryFn: () => haalContactBerichten(),
    })

    return (
        <div className="p-8">
            <div className="mb-2 font-mono text-xs uppercase tracking-wide text-stamp-dark">
                Admin
            </div>
            <h1 className="font-slab text-2xl font-bold text-ink">Contactberichten</h1>
            <p className="mt-2 text-sm text-ink-soft">
                Berichten verstuurd via het contactformulier op de website.
            </p>

            <div className="mt-8 overflow-hidden rounded-[4px] border border-line bg-paper-raised">
                {isLoading && (
                    <div className="p-8 text-center text-sm text-ink-soft">Laden...</div>
                )}

                {isError && (
                    <div className="p-8 text-center text-sm text-red-600">
                        Er ging iets mis bij het ophalen van de berichten.
                    </div>
                )}

                {berichten && berichten.length === 0 && (
                    <div className="p-8 text-center text-sm text-ink-soft">
                        Nog geen berichten ontvangen.
                    </div>
                )}

                {berichten && berichten.length > 0 && (
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-line bg-paper text-xs uppercase tracking-wide text-ink-soft">
                                <th className="px-4 py-3 font-semibold">Datum</th>
                                <th className="px-4 py-3 font-semibold">Naam</th>
                                <th className="px-4 py-3 font-semibold">E-mail</th>
                                <th className="px-4 py-3 font-semibold">Bericht</th>
                            </tr>
                        </thead>
                        <tbody>
                            {berichten.map((bericht) => (
                                <tr key={bericht.id} className="border-b border-line last:border-none">
                                    <td className="whitespace-nowrap px-4 py-3 align-top font-mono text-xs text-ink-soft">
                                        {formatDatum(bericht.createdAt)}
                                    </td>
                                    <td className="px-4 py-3 align-top font-semibold text-ink">
                                        {bericht.naam}
                                    </td>
                                    <td className="px-4 py-3 align-top text-ink-soft">
                                        <a href={`mailto:${bericht.email}`} className="hover:text-stamp-dark">
                                            {bericht.email}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 align-top text-ink-soft">{bericht.bericht}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
