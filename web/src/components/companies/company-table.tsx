import { useQuery } from '@tanstack/react-query'
import CompanyRow from './company-row'
import { haalAlleMaatschappijen } from '@/lib/server/admin-companies'

export default function CompanyTable() {
    const { data: bedrijven, isLoading, isError } = useQuery({
        queryKey: ['admin-companies'],
        queryFn: () => haalAlleMaatschappijen(),
    })

    return (
        <div className="overflow-hidden rounded-[4px] border border-line bg-paper-raised">
            {isLoading && (
                <div className="p-8 text-center text-sm text-ink-soft">Laden...</div>
            )}

            {isError && (
                <div className="p-8 text-center text-sm text-red-600">
                    Er ging iets mis bij het ophalen van de maatschappijen.
                </div>
            )}

            {bedrijven && bedrijven.length === 0 && (
                <div className="p-8 text-center text-sm text-ink-soft">
                    Nog geen maatschappijen in de database. Draai eerst{' '}
                    <code className="rounded bg-paper px-1.5 py-0.5 font-mono text-xs">
                        tsx scripts/seed-companies.ts
                    </code>
                    .
                </div>
            )}

            {bedrijven && bedrijven.length > 0 && (
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-line bg-paper text-xs uppercase tracking-wide text-ink-soft">
                            <th className="px-4 py-3 font-semibold">Maatschappij</th>
                            <th className="px-4 py-3 font-semibold">Regio</th>
                            <th className="px-4 py-3 font-semibold">Website</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bedrijven.map((bedrijf) => (
                            <CompanyRow
                                key={bedrijf.id}
                                name={bedrijf.name}
                                slug={bedrijf.slug}
                                region={bedrijf.region}
                                logoInitial={bedrijf.logoInitial}
                                logoUrl={bedrijf.logoUrl}
                                website={bedrijf.website}
                            />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
