import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vergelijkingen/$type')({
  component: VergelijkingenTypePage,
})

const categorieLabels: Record<string, string> = {
  motor: 'Motor',
  reis: 'Reis',
  woon: 'Woon',
  leven: 'Leven',
}

function VergelijkingenTypePage() {
  const { type } = Route.useParams()
  const label = categorieLabels[type] ?? type

  return (
    <div className="mx-auto max-w-5xl px-8 py-16">
      <div className="mb-2 font-mono text-xs uppercase tracking-wide text-stamp-dark">
        Vergelijken &middot; {label}
      </div>
      <h1 className="font-slab text-3xl font-bold text-ink">
        {label}verzekeringen vergelijken
      </h1>
      <p className="mt-3 max-w-md text-ink-soft">
        Hier komt de vergelijkingstabel voor {label.toLowerCase()}verzekeringen,
        met live premies per maatschappij zodra de query is aangesloten.
      </p>

      {/* TODO: vervang door useQuery / route loader op /api/vergelijking/{type}
          zodra de backend-endpoint klaar is, en render de resultaten in een
          tabel/ledger-component in plaats van deze placeholder. */}
      <div className="mt-8 rounded-[4px] border border-dashed border-line bg-paper-raised p-8 text-center text-sm text-ink-soft">
        Nog geen data aangesloten voor &ldquo;{type}&rdquo;.
      </div>
    </div>
  )
}