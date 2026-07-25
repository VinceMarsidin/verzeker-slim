import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/')({ component: Home })

function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-slate-900">
        Verzeker<span className="text-orange-500">Slim</span>
      </h1>
      <p className="mt-4 text-lg text-slate-600 max-w-xl">
        Vergelijk verzekeringen in Suriname, snel en overzichtelijk.
      </p>
      <Link
        to="/vergelijkingen"
        className="mt-8 inline-block bg-blue-700 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-blue-800 transition-colors"
      >
        Bekijk vergelijkingen
      </Link>
    </div>
  )
}
