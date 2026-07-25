import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/vergelijkingen')({
  component: VergelijkingenPage,
})

function VergelijkingenPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Vergelijkingen</h1>
      <p className="mt-2 text-slate-600">
        Hier komt de premievergelijking — deze pagina bouwen we nog verder uit.
      </p>
    </div>
  )
}
